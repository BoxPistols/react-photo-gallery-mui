import type { Meta, StoryObj } from '@storybook/react'

import DroneInspectionGallery from './drone-inspection-gallery'

const meta: Meta<typeof DroneInspectionGallery> = {
  title: 'Gallery/DroneInspectionGallery',
  component: DroneInspectionGallery,
  argTypes: {
    forceColumns: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Force specific number of columns',
    },
    showDebugInfo: {
      control: 'boolean',
      description: 'Show debug information',
    },
    themeMode: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Theme mode',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Drone inspection gallery with MUI ImageList and PhotoSwipe integration',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DroneInspectionGallery>

export const Default: Story = {
  args: {
    forceColumns: null,
    showDebugInfo: false,
    themeMode: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default gallery with sample drone inspection images',
      },
    },
  },
}

export const WithDebugInfo: Story = {
  args: {
    forceColumns: null,
    showDebugInfo: true,
    themeMode: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gallery with debug information displayed',
      },
    },
  },
}

export const ForcedColumns: Story = {
  args: {
    forceColumns: 4,
    showDebugInfo: true,
    themeMode: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gallery with forced 4 columns layout',
      },
    },
  },
}

export const WithInteractions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Gallery with interaction examples - click on thumbnails to open detail modal',
      },
    },
  },
}
