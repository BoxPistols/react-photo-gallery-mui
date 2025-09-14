import type { Meta, StoryObj } from '@storybook/react'

import { DroneInspectionGallery } from '../components/gallery/drone-inspection-gallery'

const meta: Meta<typeof DroneInspectionGallery> = {
  title: 'Components/DroneInspectionGallery',
  component: DroneInspectionGallery,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'ドローン点検用の高機能ギャラリーコンポーネント。任意箇所ズーム機能、メタデータ表示、カルーセルナビゲーションを提供します。',
      },
    },
  },
  argTypes: {
    forceColumns: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'レスポンシブなカラム数を上書きして固定値に設定',
    },
    showDebugInfo: {
      control: 'boolean',
      description: 'デバッグ情報の表示（開発機能）',
    },
    themeMode: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'ギャラリーのテーマモード',
    },
  },
}

export default meta
type Story = StoryObj<typeof DroneInspectionGallery>

export const Default: Story = {
  args: {
    forceColumns: null,
    showDebugInfo: false,
    themeMode: 'dark',
  },
  parameters: {
    docs: {
      description: {
        story:
          'デフォルトのドローン点検ギャラリー。サムネイル一覧から画像をクリックすると詳細モーダルが開き、任意の箇所にズームできます。',
      },
    },
  },
}

export const ZoomFunctionality: Story = {
  args: {
    forceColumns: 3,
    showDebugInfo: false,
    themeMode: 'dark',
  },
  parameters: {
    docs: {
      description: {
        story:
          '任意箇所ズーム機能のデモ。画像をクリックした位置を中心にズームし、ドラッグでパン、マウスホイールでズームレベル調整が可能です。',
      },
    },
  },
}
