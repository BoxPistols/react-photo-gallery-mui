#!/bin/bash

# GitHub ラベル管理ツール（統合版）
# 機能：ラベルの取得・作成・削除・バックアップ・リストア
# 対応OS：Mac / Linux / WSL

# 使い方:
# - chmod +x shells/github_labels.sh で実行権限を付与
# - ./shells/github_labels.sh で対話型メニューを表示
# - または ./shells/github_labels.sh [pull|create|list|delete] [オプション] でコマンド実行
# - どこから実行しても自動的にプロジェクトルートに移動します

# セーフモード
set -eo pipefail

# 環境変数
VERSION="1.0.0"
DEBUG_MODE=${DEBUG_MODE:-false}

# スクリプトの絶対パスを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# プロジェクトルートに移動
cd "$PROJECT_ROOT"

SHELL_DIR="$SCRIPT_DIR"
DEFAULT_LABELS_FILE="${SHELL_DIR}/labels.json"
REPO=""

# ディレクトリが存在しない場合のみ作成（バックアップ用ディレクトリなど）
ensure_dir_exists() {
  if [ ! -d "$1" ]; then
    mkdir -p "$1"
    echo "ディレクトリ '$1' を作成しました"
  fi
}

# shellsディレクトリの存在確認（作成はしない）
if [ ! -d "$SHELL_DIR" ]; then
  echo "エラー: shellsディレクトリが見つかりません: $SHELL_DIR" >&2
  echo "プロジェクト構造に問題がある可能性があります" >&2
  exit 1
fi

# 環境検出
detect_os() {
  case "$(uname -s)" in
  Darwin*) echo "mac" ;;
  Linux*) echo "linux" ;;
  *) echo "unknown" ;;
  esac
}

OS_TYPE=$(detect_os)
# OS情報はデバッグ時のみ表示（静かな起動）
# [DEBUG] 検出されたOS: $OS_TYPE

# エラーハンドリング
handle_error() {
  local exit_code=$?
  local line_number=$1
  echo "エラーが発生しました (行: $line_number, 終了コード: $exit_code)" >&2
  echo "実行したコマンド: $BASH_COMMAND" >&2
  exit $exit_code
}

trap 'handle_error $LINENO' ERR

# ヘルプ表示
show_help() {
  echo "GitHub ラベル管理ツール v${VERSION}"
  echo "使い方: $(basename "$0") [コマンド] [オプション]"
  echo
  echo "コマンド:"
  echo "  pull [ファイル名]  - リポジトリからラベル情報を取得してJSONファイルに保存"
  echo "                     （デフォルト: ${DEFAULT_LABELS_FILE}）"
  echo "  create [ファイル名] - JSONファイルからラベルを作成"
  echo "                     （デフォルト: ${DEFAULT_LABELS_FILE}）"
  echo "  list             - 現在のリポジトリのラベル一覧を表示"
  echo "  delete           - 対話形式でラベルを削除"
  echo "  backup           - 既存ラベルをバックアップ（日付付きファイル名）"
  echo "  restore [ファイル名] - バックアップからラベルを復元"
  echo
  echo "オプションなしで実行すると対話型メニューが表示されます"
  echo
  echo "例:"
  echo "  $(basename "$0")                    # 対話型メニュー"
  echo "  $(basename "$0") pull               # ラベル情報を取得"
  echo "  $(basename "$0") create             # ラベルを作成"
  echo "  $(basename "$0") pull custom.json    # 指定ファイル名で保存"
  echo "  $(basename "$0") backup             # ラベルをバックアップ"
  echo ""
  echo "デバッグモード:"
  echo "  DEBUG_MODE=true $(basename "$0") create  # 詳細な比較情報を表示"
  echo ""
  echo "注意: どのディレクトリから実行しても自動的にプロジェクトルートに移動します"
}

# ファイルパスを正規化する関数
normalize_path() {
  local input_path="$1"

  # パスが指定されていない場合はデフォルトを使用
  if [ -z "$input_path" ]; then
    echo "$DEFAULT_LABELS_FILE"
    return
  fi

  # パスにディレクトリ部分が含まれているかチェック
  if [[ "$input_path" == */* ]]; then
    # すでにパスが含まれている場合はそのまま使用
    echo "$input_path"
  else
    # ファイル名のみの場合は shells/ ディレクトリを追加
    echo "${SHELL_DIR}/$input_path"
  fi
}

# リポジトリ情報の自動取得（両方のスクリプトの良い部分を統合）
get_repo_info() {
  local remote_url
  if ! remote_url=$(git remote get-url origin 2>/dev/null); then
    echo "エラー: Gitリポジトリが見つかりません" >&2
    echo "このコマンドはGitリポジトリのルートディレクトリで実行してください" >&2
    exit 1
  fi

  # 異なるGit URL形式に対応
  if [[ "$remote_url" =~ ^https://github.com/ ]]; then
    # HTTPS形式: https://github.com/ユーザー/リポジトリ.git
    REPO=$(echo "$remote_url" | sed -E 's#^https://github.com/##' | sed -E 's/\.git$//')
  elif [[ "$remote_url" =~ ^git@github.com: ]]; then
    # SSH形式: git@github.com:ユーザー/リポジトリ.git
    REPO=$(echo "$remote_url" | sed -E 's#^git@github.com:##' | sed -E 's/\.git$//')
  else
    echo "エラー: サポートされていないGit URL形式です: $remote_url" >&2
    exit 1
  fi

  if [[ -z "$REPO" ]]; then
    echo "エラー: リポジトリ情報の取得に失敗しました" >&2
    exit 1
  fi

  echo "対象リポジトリ: $REPO"
}

# base64デコード関数（環境差異を吸収）
decode_base64() {
  if [ "$OS_TYPE" = "mac" ]; then
    # macOS
    echo "$1" | base64 --decode
  else
    # Linux
    echo "$1" | base64 --decode
  fi
}

# 依存コマンドのチェック
check_dependencies() {
  local missing=false

  for cmd in jq gh git base64; do
    if ! command -v $cmd &>/dev/null; then
      echo "エラー: $cmd がインストールされていません" >&2
      case $cmd in
      jq)
        echo "  インストール方法:"
        echo "    MacOS: brew install jq"
        echo "    Ubuntu/Debian: sudo apt install jq"
        echo "    CentOS/RHEL: sudo yum install jq"
        ;;
      gh)
        echo "  インストール方法: https://cli.github.com/manual/installation"
        echo "    MacOS: brew install gh"
        echo "    Ubuntu/Debian: apt install gh"
        echo "    その他: https://github.com/cli/cli#installation"
        ;;
      git)
        echo "  インストール方法:"
        echo "    MacOS: brew install git"
        echo "    Ubuntu/Debian: sudo apt install git"
        echo "    CentOS/RHEL: sudo yum install git"
        ;;
      base64)
        echo "  インストール方法:"
        echo "    MacOS: 標準搭載されています"
        echo "    Ubuntu/Debian: sudo apt install coreutils"
        echo "    CentOS/RHEL: sudo yum install coreutils"
        ;;
      esac
      missing=true
    fi
  done

  if $missing; then
    exit 1
  fi

  # GitHub CLIの認証状態を確認
  if ! gh auth status &>/dev/null; then
    echo "エラー: GitHub CLIの認証が必要です" >&2
    echo "  認証方法: gh auth login" >&2
    echo "  認証確認: gh auth status" >&2
    exit 1
  fi

  echo "GitHub CLI認証: 成功"
}

# ラベル一覧を取得して表示
list_labels() {
  echo "ラベル一覧を取得中..."

  local label_data
  label_data=$(gh label list --repo "$REPO" --json name,color,description | jq 'sort_by(.name)')

  if [ -z "$label_data" ] || [ "$(echo "$label_data" | jq '. | length')" -eq 0 ]; then
    echo "ラベルが見つかりません。"
    return
  fi

  local tsv_data
  tsv_data=$(echo "$label_data" | jq -r '.[] | [.name, .color, .description] | @tsv')

  get_visual_width() {
    local str="$1"
    if [ -z "$str" ]; then
      echo 0
      return
    fi
    local bytes
    bytes=$(echo -n "$str" | wc -c)
    local chars
    chars=$(echo -n "$str" | wc -m)
    echo $(((bytes - chars) / 2 + chars))
  }

  local names=()
  local colors=()
  local descriptions=()
  local max_visual_width=0

  while IFS=$'\t' read -r name color description; do
    local visual_width
    visual_width=$(get_visual_width "$name")
    if ((visual_width > max_visual_width)); then
      max_visual_width=$visual_width
    fi
    names+=("$name")
    colors+=("$color")
    descriptions+=("$description")
  done <<<"$tsv_data"

  # ヘッダー表示
  local name_header="名前"
  local name_header_width
  name_header_width=$(get_visual_width "$name_header")
  local header_padding_size=$((max_visual_width - name_header_width))
  local header_padding=""
  for ((j = 0; j < header_padding_size; j++)); do header_padding="${header_padding} "; done
  printf "%s%s  カラー  コード   説明\n" "$name_header" "$header_padding"
  printf "%s\n" "$(printf '=%.0s' {1..80})"

  # ラベル情報の表示
  for i in "${!names[@]}"; do
    local name="${names[$i]}"
    local color="${colors[$i]}"
    local description="${descriptions[$i]}"

    local visual_width
    visual_width=$(get_visual_width "$name")

    local padding_size=$((max_visual_width - visual_width))
    local padding=""
    for ((j = 0; j < padding_size; j++)); do
      padding="${padding} "
    done

    local color_preview="\033[48;2;$((16#${color:0:2}));$((16#${color:2:2}));$((16#${color:4:2}))m    \033[0m"
    printf "%s%s  %b  #%-6s  %s\n" "$name" "$padding" "$color_preview" "$color" "$description"
  done
}

# ラベル情報をJSONとして保存
pull_labels() {
  local output_file=${1:-$DEFAULT_LABELS_FILE}
  output_file=$(normalize_path "$output_file")

  # 出力ディレクトリの確認
  local output_dir=$(dirname "$output_file")
  ensure_dir_exists "$output_dir"

  echo "ラベル情報を取得中..."
  gh label list --repo "$REPO" \
    --json name,color,description \
    --jq 'sort_by(.name)' >"$output_file"

  local count=$(jq '. | length' "$output_file")
  echo "成功: $count 個のラベル情報を $output_file に保存しました"
}

# ラベルをバックアップ
backup_labels() {
  local timestamp=$(date +"%Y%m%d_%H%M%S")
  local backup_file="${SHELL_DIR}/labels_backup_${timestamp}.json"

  # バックアップディレクトリの確認
  ensure_dir_exists "$SHELL_DIR"

  pull_labels "$backup_file"
  echo "ラベルを $backup_file にバックアップしました"
}

# JSONファイルからラベルを作成
create_labels() {
  local input_file=${1:-$DEFAULT_LABELS_FILE}
  input_file=$(normalize_path "$input_file")

  # 入力ファイルの存在確認
  if [ ! -f "$input_file" ]; then
    echo "エラー: $input_file が見つかりません" >&2
    exit 1
  fi

  # ラベル数の取得
  local total=$(jq '. | length' "$input_file")
  echo "読み込んだラベル数: $total"

  echo "同名ラベルの処理について:"
  echo "- 同名で同値のラベル: スキップ（変更なし）"
  echo "- 同名で異なる値のラベル: 既存ラベルを削除して新規作成"
  echo "- 新規ラベル: 新規作成"
  echo "※ 比較ロジックの制限により、同値でも更新される場合があります"
  echo

  # ラベル作成
  echo "リポジトリ $REPO にラベルを作成しています..."
  local current=0
  local success=0
  local failed_labels=()

  for row in $(jq -r '.[] | @base64' "$input_file"); do
    _jq() {
      decode_base64 "$row" | jq -r "${1}"
    }

    name=$(_jq '.name')
    color=$(_jq '.color')
    description=$(_jq '.description')

    current=$((current + 1))
    echo "[$current/$total] ラベル '${name}' を処理中..."

    # 既存ラベルのチェックと処理
    local existing_label_info=""
    if gh label list -R "${REPO}" --json name | jq -r '.[].name' | grep -q "^${name}$"; then
      # 既存ラベルの詳細情報を取得
      existing_label_info=$(gh label list -R "${REPO}" --json name,color,description | jq -r ".[] | select(.name == \"${name}\") | @base64")

      if [ -n "$existing_label_info" ]; then
        _existing_jq() {
          echo "$existing_label_info" | decode_base64 | jq -r "${1}"
        }

        local existing_color=$(_existing_jq '.color')
        local existing_description=$(_existing_jq '.description')

                  # null値を空文字列に正規化
         if [ "$existing_description" = "null" ]; then
           existing_description=""
         fi
         if [ "$description" = "null" ]; then
           description=""
         fi

         # 色の値を小文字に統一（GitHub APIは大文字小文字を区別しない場合がある）
         existing_color=$(echo "$existing_color" | tr '[:upper:]' '[:lower:]')
         color=$(echo "$color" | tr '[:upper:]' '[:lower:]')

         # 同値チェック
         if [ "$color" = "$existing_color" ] && [ "$description" = "$existing_description" ]; then
           echo "  ⏭️  ラベル '${name}' は同値のためスキップ"
           success=$((success + 1))
           continue
         else
           echo "  🔄 ラベル '${name}' を更新します"
           if [ "$DEBUG_MODE" = "true" ]; then
             echo "    既存: color='$existing_color', description='$existing_description'"
             echo "    新規: color='$color', description='$description'"
           fi
           gh label delete "${name}" -R "${REPO}" --yes
         fi
       else
         echo "  🔄 ラベル '${name}' を更新します"
         gh label delete "${name}" -R "${REPO}" --yes
       fi
     else
       echo "  ➕ 新規ラベル '${name}' を作成します"
     fi

    if ! gh label create "${name}" -c "${color}" -d "${description}" -R "${REPO}"; then
      echo "  警告: ラベル '${name}' の作成に失敗しました" >&2
      failed_labels+=("$name")
    else
      echo "  ✓ ラベル '${name}' を作成しました"
      success=$((success + 1))
    fi
  done

  echo "成功: $success/$total 個のラベルを処理しました"

  # 失敗したラベルがある場合の処理
  if [ ${#failed_labels[@]} -gt 0 ]; then
    echo
    echo "⚠️  以下のラベルの作成に失敗しました:"
    for label in "${failed_labels[@]}"; do
      echo "  - $label"
    done
    echo
    echo "失敗したラベルの再トライを行いますか？"
    read -r -p "再トライしますか？ (y/N): " retry_choice

    if [[ "$retry_choice" =~ ^[Yy]$ ]]; then
      echo "失敗したラベルの再トライを開始します..."
      local retry_success=0
      local still_failed=()

      for label in "${failed_labels[@]}"; do
        echo "再トライ: ラベル '$label' を処理中..."

        # ラベル情報を取得
        local label_info=$(jq -r ".[] | select(.name == \"$label\") | @base64" "$input_file")
        if [ -n "$label_info" ]; then
          _jq() {
            echo "$label_info" | decode_base64 | jq -r "${1}"
          }

          local color=$(_jq '.color')
          local description=$(_jq '.description')

          # 既存ラベルの削除を試行
          if gh label list -R "${REPO}" --json name | jq -r '.[].name' | grep -q "^${label}$"; then
            gh label delete "${label}" -R "${REPO}" --yes 2>/dev/null || true
          fi

          # 再作成を試行
          if gh label create "${label}" -c "${color}" -d "${description}" -R "${REPO}"; then
            echo "  ✓ ラベル '$label' の再作成に成功しました"
            retry_success=$((retry_success + 1))
          else
            echo "  ✗ ラベル '$label' の再作成に失敗しました"
            still_failed+=("$label")
          fi
        fi
      done

      echo
      echo "再トライ結果: $retry_success/${#failed_labels[@]} 個のラベルが成功しました"

      if [ ${#still_failed[@]} -gt 0 ]; then
        echo "⚠️  以下のラベルは引き続き失敗しています:"
        for label in "${still_failed[@]}"; do
          echo "  - $label"
        done
        echo
        echo "これらのラベルは手動で確認してください。"
      fi
    else
      echo "再トライをスキップしました。失敗したラベルは手動で確認してください。"
    fi
  fi
}

# バックアップからラベルを復元
restore_labels() {
  local input_file=${1:-""}
  input_file=$(normalize_path "$input_file")

  # 入力ファイルが指定されていない場合、バックアップファイルを検索
  if [ -z "$input_file" ] || [ "$input_file" = "$SHELL_DIR/" ]; then
    echo "バックアップファイルを検索中..."
    local backups=($SHELL_DIR/labels_backup_*.json)

    if [ ${#backups[@]} -eq 0 ]; then
      echo "エラー: バックアップファイルが見つかりません" >&2
      exit 1
    fi

    echo "利用可能なバックアップ:"
    for i in "${!backups[@]}"; do
      echo "$((i + 1)). ${backups[$i]}"
    done

    echo -n "復元するバックアップ番号を選択してください: "
    read -r selection

    if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt ${#backups[@]} ]; then
      echo "エラー: 無効な選択です" >&2
      exit 1
    fi

    input_file=${backups[$((selection - 1))]}
  fi

  echo "バックアップファイル $input_file からラベルを復元します"
  create_labels "$input_file"
}

# ラベルを対話的に削除
delete_labels() {
  echo "削除するラベルを選択してください"
  echo "ラベル一覧を取得中..."

  # ラベル一覧を取得
  local labels=($(gh label list -R "${REPO}" --json name | jq -r '.[].name'))

  if [ ${#labels[@]} -eq 0 ]; then
    echo "ラベルが存在しません"
    return
  fi

  # ラベル一覧を表示
  for i in "${!labels[@]}"; do
    echo "$((i + 1)). ${labels[$i]}"
  done

  echo "削除するラベル番号を入力してください（複数選択可、スペース区切り）"
  echo "例: 1 3 5 （1番、3番、5番のラベルを削除）"
  echo "キャンセルする場合は何も入力せずにエンターキーを押してください"
  read -r selections

  # キャンセル処理
  if [ -z "$selections" ]; then
    echo "削除をキャンセルしました"
    return
  fi

  local failed_deletions=()
  local success_count=0
  local total_selections=0

  # 選択されたラベルを削除
  for selection in $selections; do
    if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt ${#labels[@]} ]; then
      echo "警告: 無効な選択: $selection - スキップします" >&2
      continue
    fi

    local label=${labels[$((selection - 1))]}
    total_selections=$((total_selections + 1))
    echo "ラベル '$label' を削除中..."

    if gh label delete "$label" -R "${REPO}" --yes; then
      echo "✓ ラベル '$label' を削除しました"
      success_count=$((success_count + 1))
    else
      echo "警告: ラベル '$label' の削除に失敗しました" >&2
      failed_deletions+=("$label")
    fi
  done

  echo "削除完了: $success_count/$total_selections 個のラベルを削除しました"

  # 失敗した削除がある場合の処理
  if [ ${#failed_deletions[@]} -gt 0 ]; then
    echo
    echo "⚠️  以下のラベルの削除に失敗しました:"
    for label in "${failed_deletions[@]}"; do
      echo "  - $label"
    done
    echo
    echo "失敗したラベルの削除を再試行しますか？"
    read -r -p "再試行しますか？ (y/N): " retry_choice

    if [[ "$retry_choice" =~ ^[Yy]$ ]]; then
      echo "失敗したラベルの削除を再試行します..."
      local retry_success=0
      local still_failed=()

      for label in "${failed_deletions[@]}"; do
        echo "再試行: ラベル '$label' を削除中..."

        if gh label delete "$label" -R "${REPO}" --yes; then
          echo "  ✓ ラベル '$label' の削除に成功しました"
          retry_success=$((retry_success + 1))
        else
          echo "  ✗ ラベル '$label' の削除に失敗しました"
          still_failed+=("$label")
        fi
      done

      echo
      echo "再試行結果: $retry_success/${#failed_deletions[@]} 個のラベルを削除しました"

      if [ ${#still_failed[@]} -gt 0 ]; then
        echo "⚠️  以下のラベルは引き続き削除に失敗しています:"
        for label in "${still_failed[@]}"; do
          echo "  - $label"
        done
        echo
        echo "これらのラベルは手動で確認してください。"
      fi
    else
      echo "再試行をスキップしました。失敗したラベルは手動で確認してください。"
    fi
  fi
}

# 対話型メニュー
show_menu() {
  while true; do
    echo
    echo "GitHub ラベル管理ツール v${VERSION}"
    echo "リポジトリ: $REPO"
    echo
    echo "操作を選択してください:"
    echo "1) ラベル一覧表示"
    echo "2) ラベル情報取得（JSON保存）"
    echo "3) ラベル作成/更新"
    echo "4) ラベル削除"
    echo "5) ラベルバックアップ"
    echo "6) ラベル復元"
    echo "q) 終了"
    echo
    echo "※ 各操作でエンターキーを押すとデフォルト値が使用されます"
    echo
    read -r -p "選択: " choice

    case $choice in
    1)
      list_labels
      ;;
    2)
      echo "ラベル情報を取得してJSONファイルに保存します"
      echo "デフォルトファイル ($DEFAULT_LABELS_FILE) に保存する場合はエンターキーを押してください"
      read -r -p "保存ファイル名 [${DEFAULT_LABELS_FILE}]: " filename
      filename=${filename:-$DEFAULT_LABELS_FILE}
      pull_labels "$filename"
      ;;
    3)
      # デフォルトファイルが存在するかチェック
      if [ -f "$DEFAULT_LABELS_FILE" ]; then
        echo "デフォルトファイル ($DEFAULT_LABELS_FILE) からラベルを作成します"
        echo "エンターキーを押すとデフォルトファイルを使用します"
        read -r -p "別のファイルを使用しますか？ (y/N): " use_custom
        if [[ "$use_custom" =~ ^[Yy]$ ]]; then
          read -r -p "JSONファイル名: " filename
        else
          filename="$DEFAULT_LABELS_FILE"
        fi
      else
        echo "デフォルトファイル ($DEFAULT_LABELS_FILE) が見つかりません"
        read -r -p "JSONファイル名: " filename
        filename=${filename:-$DEFAULT_LABELS_FILE}
      fi
      create_labels "$filename"
      ;;
    4)
      delete_labels
      ;;
    5)
      backup_labels
      ;;
    6)
      # バックアップファイルを自動検出
      local backups=($SHELL_DIR/labels_backup_*.json)
      if [ ${#backups[@]} -gt 0 ]; then
        echo "利用可能なバックアップファイル:"
        for i in "${!backups[@]}"; do
          echo "$((i + 1)). ${backups[$i]}"
        done
        echo "0. 手動でファイル名を指定"
        echo
        echo "最新のバックアップ（番号1）を使用する場合はエンターキーを押してください"
        read -r -p "復元するバックアップ番号を選択してください [1]: " selection
        selection=${selection:-1}

        if [[ "$selection" =~ ^[0-9]+$ ]] && [ "$selection" -gt 0 ] && [ "$selection" -le ${#backups[@]} ]; then
          filename=${backups[$((selection - 1))]}
        elif [ "$selection" = "0" ]; then
          read -r -p "復元ファイル名: " filename
        else
          echo "無効な選択です。手動でファイル名を指定してください。"
          read -r -p "復元ファイル名: " filename
        fi
      else
        echo "バックアップファイルが見つかりません"
        read -r -p "復元ファイル名: " filename
      fi
      restore_labels "$filename"
      ;;
    q | Q)
      exit 0
      ;;
    *)
      echo "無効な選択です。もう一度お試しください。"
      ;;
    esac
  done
}

# メイン処理
main() {
  # 依存関係のチェック
  check_dependencies

  # リポジトリ情報取得
  get_repo_info

  # コマンドライン引数がない場合は対話型メニュー
  if [ $# -eq 0 ]; then
    show_menu
    exit 0
  fi

  # コマンド処理
  case "$1" in
  help | -h | --help)
    show_help
    ;;
  pull)
    pull_labels "${2}"
    ;;
  create)
    create_labels "${2}"
    ;;
  list)
    list_labels
    ;;
  delete)
    delete_labels
    ;;
  backup)
    backup_labels
    ;;
  restore)
    restore_labels "$2"
    ;;
  *)
    echo "エラー: 不明なコマンド '$1'" >&2
    show_help
    exit 1
    ;;
  esac
}

# スクリプト実行
main "$@"