import type { SxProps, Theme } from '@mui/material'
import type { ReactNode, MouseEvent } from 'react'

// Basic media types
export default {}
export type MediaType = 'image' | 'video'

export interface LocationData {
  name: string
  lat: number
  lng: number
  altitude?: number
}

export interface InspectionTag {
  id: string
  label: string
  color: string
}

export interface DroneInspectionMetadata {
  captureDate: string
  location: LocationData
  resolution: string
  droneModel: string
  tags: InspectionTag[]
  status: 'normal' | 'attention' | 'repair_needed' | 'repaired'
  customFields?: Record<string, unknown>
}

// Core gallery item interface
export interface GalleryItem {
  id: string
  type: MediaType
  url: string
  thumbnail: string
  title: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  duration?: number // for video types
  metadata?: DroneInspectionMetadata
}

// Gallery component props
export interface GalleryProps {
  id?: string | number
  items: GalleryItem[]
  variant?: 'masonry' | 'quilted' | 'woven' | 'standard'
  cols?: number | { xs?: number; sm?: number; md?: number; lg?: number }
  gap?: number
  sx?: SxProps<Theme>
  withMap?: boolean
  mapProvider?: 'google' | 'leaflet' | 'maplibre'
  withFilters?: boolean
  tagOptions?: InspectionTag[]
  onItemClick?: (item: GalleryItem, index: number) => void
  onMetadataUpdate?: (itemId: string, metadata: DroneInspectionMetadata) => void
  exportOptions?: ExportOptions
}

// PhotoSwipe integration types
export interface PhotoSwipeOptions {
  bgOpacity?: number
  showHideAnimationType?: 'zoom' | 'fade' | 'none'
  padding?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  [key: string]: unknown
}

export interface GalleryContextValue {
  items: GalleryItem[]
  currentIndex: number
  isOpen: boolean
  openGallery: (index: number) => void
  closeGallery: () => void
  nextItem: () => void
  previousItem: () => void
  updateItem: (itemId: string, updates: Partial<GalleryItem>) => void
}

// Render props types
export interface ChildrenFnProps<T extends HTMLElement = HTMLElement> {
  ref: (node: T | null) => void
  open: (event?: MouseEvent) => void
  close: () => void
}

export interface ItemProps<T extends HTMLElement = HTMLElement>
  extends Omit<GalleryItem, 'id'> {
  sourceId: string | number
  children: (props: ChildrenFnProps<T>) => ReactNode
}

// Hook types
export interface UseGalleryReturn {
  items: GalleryItem[]
  currentIndex: number
  isOpen: boolean
  open: (index: number) => void
  close: () => void
  next: () => void
  previous: () => void
}

export interface UseDroneInspectionReturn {
  metadata: DroneInspectionMetadata | null
  updateMetadata: (metadata: Partial<DroneInspectionMetadata>) => void
  exportData: (itemIds: string[]) => Promise<void>
  filterItems: (criteria: FilterCriteria) => GalleryItem[]
}

export interface UseMapIntegrationReturn {
  showOnMap: (item: GalleryItem) => void
  mapInstance: unknown // depends on map provider
  syncWithGallery: () => void
}

// Filter and search types
export interface FilterCriteria {
  dateRange?: [Date, Date]
  locationBounds?: {
    north: number
    south: number
    east: number
    west: number
  }
  tags?: string[]
  status?: DroneInspectionMetadata['status'][]
  textQuery?: string
}

// Export types
export interface ExportOptions {
  formats: ('pdf' | 'csv' | 'json')[]
  template?: 'default' | 'detailed' | 'summary'
  includeImages?: boolean
}

// Map integration types
export type MapProvider = 'google' | 'leaflet' | 'maplibre'

export interface MapConfig {
  provider: MapProvider
  apiKey?: string
  initialZoom: number
  markers: {
    itemId: string
    position: [number, number]
    popup?: string
  }[]
}
