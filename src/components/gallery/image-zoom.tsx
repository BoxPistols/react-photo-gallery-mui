'use client'

import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as ResetIcon,
} from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import React, { useState, useRef, useCallback } from 'react'

interface ImageZoomProps {
  src: string
  alt: string
  maxZoom?: number
  minZoom?: number
  zoomStep?: number
}

export const ImageZoom: React.FC<ImageZoomProps> = ({
  src,
  alt,
  maxZoom = 3,
  minZoom = 1,
  zoomStep = 0.5,
}) => {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // ズームイン（クリック位置を中心に）
  const handleZoomIn = useCallback(
    (event?: React.MouseEvent) => {
      if (scale >= maxZoom) return

      const newScale = Math.min(scale + zoomStep, maxZoom)

      if (event && imageRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const clickX = event.clientX - rect.left
        const clickY = event.clientY - rect.top

        // クリック位置を基準にズーム位置を調整
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const newX = position.x - (clickX - centerX) * (newScale / scale - 1)
        const newY = position.y - (clickY - centerY) * (newScale / scale - 1)

        setPosition({ x: newX, y: newY })
      }

      setScale(newScale)
    },
    [scale, maxZoom, zoomStep, position]
  )

  // ズームアウト
  const handleZoomOut = useCallback(() => {
    const newScale = Math.max(scale - zoomStep, minZoom)
    setScale(newScale)

    // 最小ズームに戻った時は位置もリセット
    if (newScale === minZoom) {
      setPosition({ x: 0, y: 0 })
    }
  }, [scale, minZoom, zoomStep])

  // リセット
  const handleReset = useCallback(() => {
    setScale(minZoom)
    setPosition({ x: 0, y: 0 })
  }, [minZoom])

  // ドラッグ開始
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (scale <= minZoom) return

      setIsDragging(true)
      setLastMousePosition({ x: event.clientX, y: event.clientY })
      event.preventDefault()
    },
    [scale, minZoom]
  )

  // ドラッグ中
  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isDragging) return

      const deltaX = event.clientX - lastMousePosition.x
      const deltaY = event.clientY - lastMousePosition.y

      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }))

      setLastMousePosition({ x: event.clientX, y: event.clientY })
    },
    [isDragging, lastMousePosition]
  )

  // ドラッグ終了
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // ホイールズーム
  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault()

      const delta = event.deltaY > 0 ? -zoomStep : zoomStep
      const newScale = Math.max(minZoom, Math.min(maxZoom, scale + delta))

      if (newScale !== scale) {
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) {
          const mouseX = event.clientX - rect.left
          const mouseY = event.clientY - rect.top
          const centerX = rect.width / 2
          const centerY = rect.height / 2

          const newX = position.x - (mouseX - centerX) * (newScale / scale - 1)
          const newY = position.y - (mouseY - centerY) * (newScale / scale - 1)

          setPosition({ x: newX, y: newY })
        }

        setScale(newScale)
      }
    },
    [scale, minZoom, maxZoom, zoomStep, position]
  )

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '60vh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 1,
        cursor: isDragging ? 'grabbing' : scale > minZoom ? 'grab' : 'zoom-in',
      }}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onClick={scale === minZoom ? handleZoomIn : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* コントロールボタン */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: 1,
          padding: 0.5,
        }}
      >
        <IconButton
          onClick={handleZoomIn}
          disabled={scale >= maxZoom}
          size="small"
          sx={{ color: 'white' }}
          title="ズームイン"
        >
          <ZoomInIcon />
        </IconButton>
        <IconButton
          onClick={handleZoomOut}
          disabled={scale <= minZoom}
          size="small"
          sx={{ color: 'white' }}
          title="ズームアウト"
        >
          <ZoomOutIcon />
        </IconButton>
        <IconButton
          onClick={handleReset}
          disabled={scale <= minZoom && position.x === 0 && position.y === 0}
          size="small"
          sx={{ color: 'white' }}
          title="リセット"
        >
          <ResetIcon />
        </IconButton>
      </Box>

      {/* ズーム倍率表示 */}
      {scale > minZoom && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: 1,
            fontSize: '0.75rem',
          }}
        >
          {scale.toFixed(1)}x
        </Box>
      )}
    </Box>
  )
}

export default ImageZoom
