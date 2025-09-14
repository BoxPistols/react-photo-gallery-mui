import type { Meta, StoryObj } from '@storybook/react'

import { DroneInspectionGallery } from './drone-inspection-gallery'

const meta: Meta<typeof DroneInspectionGallery> = {
  title: 'Gallery/DroneInspectionGallery',
  component: DroneInspectionGallery,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Drone inspection gallery with MUI ImageList and PhotoSwipe integration. Features responsive layout, zoom functionality, and metadata display.',
      },
    },
  },
  argTypes: {
    forceColumns: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Override responsive column count with a fixed number',
    },
    showDebugInfo: {
      control: 'boolean',
      description: 'Show debug information (development feature)',
    },
    themeMode: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Theme mode for the gallery',
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
    themeMode: 'dark',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default gallery with responsive layout and sample drone inspection images',
      },
    },
  },
}

export const TwoColumns: Story = {
  args: {
    forceColumns: 2,
    showDebugInfo: false,
    themeMode: 'dark',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gallery forced to 2-column layout',
      },
    },
  },
}

export const FourColumns: Story = {
  args: {
    forceColumns: 4,
    showDebugInfo: false,
    themeMode: 'dark',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gallery forced to 4-column layout for wide screens',
      },
    },
  },
}

export const WithDebugInfo: Story = {
  args: {
    forceColumns: null,
    showDebugInfo: true,
    themeMode: 'dark',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gallery with debug information enabled (development feature)',
      },
    },
  },
}
