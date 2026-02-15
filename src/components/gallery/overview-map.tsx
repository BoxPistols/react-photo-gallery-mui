'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Box, Typography } from '@mui/material'
import type MaplibreGl from 'maplibre-gl'

import type { GalleryItem } from '@/types/gallery'

const GSI_STYLE: MaplibreGl.StyleSpecification = {
  version: 8,
  sources: {
    gsi: {
      type: 'raster',
      tiles: ['https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution:
        '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>',
    },
  },
  layers: [
    {
      id: 'gsi-tiles',
      type: 'raster',
      source: 'gsi',
      minzoom: 0,
      maxzoom: 18,
    },
  ],
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'repair_needed':
      return '#d32f2f'
    case 'attention':
      return '#ff9800'
    case 'repaired':
      return '#4caf50'
    default:
      return '#1976d2'
  }
}

interface OverviewMapProps {
  items: GalleryItem[]
  height?: number
  activeItemId?: string | null
  onPinClick?: (item: GalleryItem, index: number) => void
}

export const OverviewMap: React.FC<OverviewMapProps> = ({
  items,
  height = 400,
  activeItemId,
  onPinClick,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MaplibreGl.Map | null>(null)
  const markersRef = useRef<
    Map<string, { marker: MaplibreGl.Marker; el: HTMLDivElement }>
  >(new Map())
  const [maplibregl, setMaplibregl] = useState<typeof MaplibreGl | null>(null)

  useEffect(() => {
    let cancelled = false
    import('maplibre-gl').then((mod) => {
      if (!cancelled) {
        setMaplibregl(mod.default || mod)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const handlePinClick = useCallback(
    (item: GalleryItem, index: number) => {
      if (onPinClick) {
        onPinClick(item, index)
      }
    },
    [onPinClick]
  )

  useEffect(() => {
    if (!mapContainer.current || !maplibregl) return

    const geoItems = items
      .map((item, index) => ({ item, index }))
      .filter(
        ({ item }) =>
          item.metadata?.location?.lat && item.metadata?.location?.lng
      )

    if (geoItems.length === 0) return

    const firstLoc = geoItems[0].item.metadata?.location
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: GSI_STYLE,
      center: [firstLoc?.lng ?? 139.7, firstLoc?.lat ?? 35.7],
      zoom: 5,
    })

    mapRef.current = map

    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.on('load', () => {
      geoItems.forEach(({ item, index }) => {
        const loc = item.metadata?.location
        if (!loc) return
        const status = item.metadata?.status || 'normal'

        const markerEl = document.createElement('div')
        markerEl.style.width = '32px'
        markerEl.style.height = '32px'
        markerEl.style.cursor = 'pointer'
        markerEl.style.transition = 'transform 0.2s ease'
        markerEl.innerHTML = `<svg viewBox="0 0 24 24" width="32" height="32">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${getStatusColor(status)}" stroke="white" stroke-width="1.5"/>
          <circle cx="12" cy="9" r="3" fill="white"/>
        </svg>`

        const popupContent = document.createElement('div')
        popupContent.style.cursor = 'pointer'
        popupContent.style.minWidth = '160px'
        popupContent.innerHTML = `
          <div style="text-align:center;">
            <img
              src="${item.thumbnail}"
              alt="${item.title}"
              style="width:150px;height:100px;object-fit:cover;border-radius:4px;"
              onerror="this.style.display='none'"
            />
            <div style="font-weight:600;font-size:13px;margin-top:6px;">${item.title}</div>
            <div style="font-size:11px;color:#666;margin-top:2px;">${loc.name}</div>
          </div>
        `
        popupContent.addEventListener('click', () => {
          handlePinClick(item, index)
        })

        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: true,
          maxWidth: '200px',
        }).setDOMContent(popupContent)

        const marker = new maplibregl.Marker({ element: markerEl })
          .setLngLat([loc.lng, loc.lat])
          .setPopup(popup)
          .addTo(map)

        markersRef.current.set(item.id, { marker, el: markerEl })
      })

      if (geoItems.length > 1) {
        const bounds = new maplibregl.LngLatBounds()
        geoItems.forEach(({ item }) => {
          const loc = item.metadata?.location
          if (loc) bounds.extend([loc.lng, loc.lat])
        })
        map.fitBounds(bounds, { padding: 60 })
      }
    })

    const currentMarkers = markersRef.current
    return () => {
      currentMarkers.forEach(({ marker }) => marker.remove())
      currentMarkers.clear()
      map.remove()
      mapRef.current = null
    }
  }, [items, maplibregl, handlePinClick])

  // ギャラリー側のアクティブアイテムに連動してピンをハイライト＆フライ
  useEffect(() => {
    markersRef.current.forEach(({ el }, id) => {
      if (id === activeItemId) {
        el.style.transform = 'scale(1.5)'
        el.style.zIndex = '10'
      } else {
        el.style.transform = 'scale(1)'
        el.style.zIndex = '1'
      }
    })

    if (activeItemId && mapRef.current) {
      const entry = markersRef.current.get(activeItemId)
      if (entry) {
        const lngLat = entry.marker.getLngLat()
        mapRef.current.flyTo({
          center: lngLat,
          zoom: Math.max(mapRef.current.getZoom(), 8),
          duration: 600,
        })
        entry.marker.togglePopup()
      }
    }
  }, [activeItemId])

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        📍 撮影位置マップ
      </Typography>
      <Box
        ref={mapContainer}
        sx={{
          width: '100%',
          height,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      />
      <Typography
        variant="caption"
        sx={{ mt: 0.5, display: 'block', color: 'text.secondary' }}
      >
        ピンをクリックするとサムネイルが表示されます。サムネイルをクリックで写真を拡大表示します。
      </Typography>
    </Box>
  )
}

export default OverviewMap
