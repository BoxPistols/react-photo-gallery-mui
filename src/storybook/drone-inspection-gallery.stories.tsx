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
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
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
  parameters: {
    docs: {
      description: {
        story:
          '任意箇所ズーム機能のデモ。画像をクリックした位置を中心にズームし、ドラッグでパン、マウスホイールでズームレベル調整が可能です。',
      },
    },
  },
}
