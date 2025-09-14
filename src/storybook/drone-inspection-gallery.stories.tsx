'use client'

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import DroneInspectionGallery from '../components/gallery/drone-inspection-gallery'

// Props interface for Storybook controls
interface StoryArgs {
  containerWidth?: number
  themeMode?: 'light' | 'dark'
  showDebugInfo?: boolean
  forceColumns?: number | null
}

const meta: Meta<StoryArgs> = {
  title: 'Components/DroneInspectionGallery',
  component: DroneInspectionGallery,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'ドローン点検用の高機能ギャラリーコンポーネント。任意箇所ズーム機能、メタデータ表示、カルーセルナビゲーションを提供します。30枚の産業・インフラ画像サンプルが含まれており、各画像には詳細なメタデータ（撮影日時、場所、ドローンモデル、検査ステータス）が付属しています。',
      },
    },
    viewport: {
      defaultViewport: 'responsive',
    },
  },
  argTypes: {
    // レスポンシブ表示のシミュレーション用
    containerWidth: {
      control: { type: 'range', min: 320, max: 1920, step: 10 },
      description: 'ギャラリーコンテナの幅（レスポンシブ表示のテスト用）',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'auto' },
      },
    },
    // テーマカラーの切り替え
    themeMode: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
      description: 'Material-UIテーマモード',
      table: {
        category: 'Theme',
        defaultValue: { summary: 'light' },
      },
    },
    // デバッグ用の表示オプション
    showDebugInfo: {
      control: 'boolean',
      description: '画像のロード状態やエラー情報を表示',
      table: {
        category: 'Debug',
        defaultValue: { summary: false },
      },
    },
    // 画像グリッドの列数制御
    forceColumns: {
      control: { type: 'select' },
      options: [null, 1, 2, 3, 4],
      description: 'グリッドの列数を強制指定（null: レスポンシブ）',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'null' },
      },
    },
  },
  args: {
    containerWidth: 1200,
    themeMode: 'light',
    showDebugInfo: false,
    forceColumns: null,
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<StoryArgs>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトのドローン点検ギャラリー。サムネイル一覧から画像をクリックすると詳細モーダルが開き、任意の箇所にズームできます。キーボード操作（左右矢印キー、ESCキー）にも対応しています。',
      },
    },
  },
  render: (args) => (
    <div
      style={{
        width: args.containerWidth ? `${args.containerWidth}px` : 'auto',
        margin: '0 auto',
      }}
    >
      <DroneInspectionGallery
        forceColumns={args.forceColumns}
        showDebugInfo={args.showDebugInfo}
        themeMode={args.themeMode}
      />
    </div>
  ),
}

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone12',
    },
    docs: {
      description: {
        story:
          'モバイルデバイスでの表示例。2列グリッドレイアウトで最適化され、タッチジェスチャーによるナビゲーションが可能です。',
      },
    },
  },
  args: {
    containerWidth: 375,
    forceColumns: 2,
  },
  render: (args) => (
    <div style={{ width: `${args.containerWidth}px`, margin: '0 auto' }}>
      <DroneInspectionGallery
        forceColumns={args.forceColumns}
        showDebugInfo={args.showDebugInfo}
        themeMode={args.themeMode}
      />
    </div>
  ),
}

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
    docs: {
      description: {
        story:
          'タブレットでの表示例。3列グリッドレイアウトでバランスの取れた表示を提供します。',
      },
    },
  },
  args: {
    containerWidth: 768,
    forceColumns: 3,
  },
  render: (args) => (
    <div style={{ width: `${args.containerWidth}px`, margin: '0 auto' }}>
      <DroneInspectionGallery
        forceColumns={args.forceColumns}
        showDebugInfo={args.showDebugInfo}
        themeMode={args.themeMode}
      />
    </div>
  ),
}

export const DesktopView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story:
          'デスクトップでの表示例。3列グリッドレイアウトで詳細なメタデータ表示と高品質な画像ズーム機能を活用できます。',
      },
    },
  },
  args: {
    containerWidth: 1200,
    forceColumns: 3,
  },
  render: (args) => (
    <div style={{ width: `${args.containerWidth}px`, margin: '0 auto' }}>
      <DroneInspectionGallery
        forceColumns={args.forceColumns}
        showDebugInfo={args.showDebugInfo}
        themeMode={args.themeMode}
      />
    </div>
  ),
}

export const ZoomFunctionality: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '任意箇所ズーム機能のデモ。画像をクリックした位置を中心にズームし、ドラッグでパン、マウスホイールでズームレベル調整が可能です。ズーム倍率は1倍から4倍まで、0.5倍刻みで調整できます。',
      },
    },
    actions: {
      handles: ['click', 'wheel', 'keydown'],
    },
  },
  render: (args) => (
    <div
      style={{
        width: args.containerWidth ? `${args.containerWidth}px` : 'auto',
        margin: '0 auto',
      }}
    >
      <DroneInspectionGallery
        forceColumns={args.forceColumns}
        showDebugInfo={args.showDebugInfo}
        themeMode={args.themeMode}
      />
      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#666',
        }}
      >
        <strong>ズーム操作方法:</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>画像クリック: クリック位置を中心にズーム</li>
          <li>マウスホイール: ズームレベル調整</li>
          <li>ドラッグ: ズーム後の画像移動</li>
          <li>矢印キー: 画像の切り替え</li>
          <li>ESCキー: モーダルを閉じる</li>
        </ul>
      </div>
    </div>
  ),
}

export const KeyboardNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'キーボードナビゲーションのデモ。画像を開いた状態で左右矢印キーで画像を切り替え、ESCキーでモーダルを閉じることができます。アクセシビリティ対応の一環として実装されています。',
      },
    },
    actions: {
      handles: ['keydown'],
    },
  },
  render: (args) => (
    <div
      style={{
        width: args.containerWidth ? `${args.containerWidth}px` : 'auto',
        margin: '0 auto',
      }}
    >
      <DroneInspectionGallery
        forceColumns={args.forceColumns}
        showDebugInfo={args.showDebugInfo}
        themeMode={args.themeMode}
      />
      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#1976d2',
        }}
      >
        <strong>キーボード操作:</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>
            <kbd>←</kbd> 前の画像
          </li>
          <li>
            <kbd>→</kbd> 次の画像
          </li>
          <li>
            <kbd>ESC</kbd> モーダルを閉じる
          </li>
          <li>
            <kbd>Tab</kbd> フォーカス移動
          </li>
        </ul>
      </div>
    </div>
  ),
}
