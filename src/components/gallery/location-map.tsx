'use client'

import React, { useRef, useEffect, useState } from 'react'
import type MaplibreGl from 'maplibre-gl'

interface LocationMapProps {
  lat: number
  lng: number
  name?: string
  height?: number
  zoom?: number
}

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

export const LocationMap: React.FC<LocationMapProps> = ({
  lat,
  lng,
  name,
  height = 200,
  zoom = 14,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MaplibreGl.Map | null>(null)
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

  useEffect(() => {
    if (!mapContainer.current || !maplibregl) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: GSI_STYLE,
      center: [lng, lat],
      zoom,
      attributionControl: {},
    })

    mapRef.current = map

    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    const popup = name
      ? new maplibregl.Popup({ offset: 25, closeButton: false }).setText(name)
      : undefined

    const marker = new maplibregl.Marker({ color: '#1976d2' })
      .setLngLat([lng, lat])
      .addTo(map)

    if (popup) {
      marker.setPopup(popup).togglePopup()
    }

    return () => {
      marker.remove()
      map.remove()
      mapRef.current = null
    }
  }, [lat, lng, name, zoom, maplibregl])

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height,
        borderRadius: 4,
      }}
    />
  )
}

export default LocationMap
