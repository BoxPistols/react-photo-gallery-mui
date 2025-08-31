import type { Meta, StoryObj } from '@storybook/react'
import { DroneInspectionGallery } from './drone-inspection-gallery'

const meta: Meta<typeof DroneInspectionGallery> = {
  title: 'Gallery/DroneInspectionGallery',
  component: DroneInspectionGallery,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Drone inspection gallery with MUI ImageList and PhotoSwipe integration',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DroneInspectionGallery>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default gallery with sample drone inspection images',
      },
    },
  },
}

export const WithInteractions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Gallery with interaction examples - click on thumbnails to open detail modal',
      },
    },
  },
}