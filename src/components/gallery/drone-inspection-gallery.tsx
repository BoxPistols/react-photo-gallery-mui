'use client'

import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material'
import {
  Typography,
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Dialog,
  IconButton,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import React, { useState, useEffect, useCallback } from 'react'

import type { GalleryItem } from '@/types/gallery'

import { ImageZoom } from './image-zoom'

// ドローン点検用サンプルデータ（産業・インフラ画像）
const sampleItems: GalleryItem[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=200&fit=crop&q=80',
    title: '太陽光パネル点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-15T10:30:00',
      location: { name: '東京発電所A地区', lat: 35.6895, lng: 139.6917 },
      resolution: '3840x2160',
      droneModel: 'DJI Mavic 3',
      tags: [
        { id: 'solar', label: '太陽光パネル', color: '#ff9800' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300&h=200&fit=crop&q=80',
    title: '送電塔点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-16T09:15:00',
      location: { name: '千葉送電線B区間', lat: 35.6581, lng: 139.7514 },
      resolution: '4000x3000',
      droneModel: 'DJI Air 2S',
      tags: [
        { id: 'tower', label: '送電塔', color: '#607d8b' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=300&h=200&fit=crop&q=80',
    title: '風力発電所点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-17T14:22:00',
      location: { name: '青森風力発電所', lat: 35.6812, lng: 139.7671 },
      resolution: '6000x4000',
      droneModel: 'DJI Phantom 4 Pro',
      tags: [
        { id: 'wind', label: '風力発電', color: '#2196f3' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=300&h=200&fit=crop&q=80',
    title: '工場屋根点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-18T11:30:00',
      location: { name: '埼玉製造工場', lat: 35.8617, lng: 139.6455 },
      resolution: '3840x2160',
      droneModel: 'DJI Mini 3 Pro',
      tags: [
        { id: 'roof', label: '屋根', color: '#795548' },
        { id: 'attention', label: '要注意', color: '#ff9800' },
      ],
      status: 'attention',
    },
  },
  {
    id: '5',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop&q=80',
    title: '橋梁点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-19T13:45:00',
      location: { name: '横浜港大橋', lat: 35.4437, lng: 139.638 },
      resolution: '4000x3000',
      droneModel: 'DJI Mavic 3',
      tags: [
        { id: 'bridge', label: '橋梁', color: '#607d8b' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '6',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop&q=80',
    title: '太陽光パネル点検_02',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-20T10:00:00',
      location: { name: '群馬発電所C地区', lat: 36.3911, lng: 139.0608 },
      resolution: '3840x2160',
      droneModel: 'DJI Air 2S',
      tags: [
        { id: 'solar', label: '太陽光パネル', color: '#ff9800' },
        { id: 'repair', label: '要修理', color: '#f44336' },
      ],
      status: 'repair_needed',
    },
  },
  {
    id: '7',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1444664597500-035db93db32f?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1444664597500-035db93db32f?w=300&h=200&fit=crop&q=80',
    title: 'ダム施設点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-21T08:30:00',
      location: { name: '奥多摩湖ダム', lat: 35.7853, lng: 139.0947 },
      resolution: '6000x4000',
      droneModel: 'DJI Phantom 4 Pro',
      tags: [
        { id: 'dam', label: 'ダム', color: '#2196f3' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '8',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=300&h=200&fit=crop&q=80',
    title: '港湾施設点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-22T15:20:00',
      location: { name: '東京港第三埠頭', lat: 35.6208, lng: 139.7848 },
      resolution: '4000x3000',
      droneModel: 'DJI Mavic 3',
      tags: [
        { id: 'port', label: '港湾', color: '#009688' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '9',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop&q=80',
    title: '石油タンク点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-23T12:10:00',
      location: { name: '千葉石油基地', lat: 35.5431, lng: 140.0661 },
      resolution: '3840x2160',
      droneModel: 'DJI Mini 3 Pro',
      tags: [
        { id: 'tank', label: 'タンク', color: '#795548' },
        { id: 'attention', label: '要注意', color: '#ff9800' },
      ],
      status: 'attention',
    },
  },
  {
    id: '10',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1574087335633-040aee27ee1c?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1574087335633-040aee27ee1c?w=300&h=200&fit=crop&q=80',
    title: '工業団地点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-24T09:45:00',
      location: { name: '茨城工業団地', lat: 36.0417, lng: 140.0792 },
      resolution: '4000x3000',
      droneModel: 'DJI Air 2S',
      tags: [
        { id: 'industrial', label: '工業団地', color: '#607d8b' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '11',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1486312338219-ce68e2c86884?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1486312338219-ce68e2c86884?w=300&h=200&fit=crop&q=80',
    title: '通信鉄塔点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-25T16:00:00',
      location: { name: '東京スカイツリー周辺', lat: 35.7101, lng: 139.8107 },
      resolution: '6000x4000',
      droneModel: 'DJI Phantom 4 Pro',
      tags: [
        { id: 'communication', label: '通信設備', color: '#9c27b0' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '12',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1545529468-42764ef8c85f?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1545529468-42764ef8c85f?w=300&h=200&fit=crop&q=80',
    title: '太陽光パネル点検_03',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-26T11:15:00',
      location: { name: '静岡発電所D地区', lat: 35.0722, lng: 138.3 },
      resolution: '3840x2160',
      droneModel: 'DJI Mavic 3',
      tags: [
        { id: 'solar', label: '太陽光パネル', color: '#ff9800' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '13',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop&q=80',
    title: '建築現場点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-27T13:30:00',
      location: { name: '新宿建設現場', lat: 35.6938, lng: 139.7036 },
      resolution: '4000x3000',
      droneModel: 'DJI Mini 3 Pro',
      tags: [
        { id: 'construction', label: '建設現場', color: '#ff5722' },
        { id: 'attention', label: '要注意', color: '#ff9800' },
      ],
      status: 'attention',
    },
  },
  {
    id: '14',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop&q=80',
    title: '橋梁点検_02',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-28T10:45:00',
      location: { name: 'レインボーブリッジ', lat: 35.6338, lng: 139.7632 },
      resolution: '6000x4000',
      droneModel: 'DJI Air 2S',
      tags: [
        { id: 'bridge', label: '橋梁', color: '#607d8b' },
        { id: 'repair', label: '要修理', color: '#f44336' },
      ],
      status: 'repair_needed',
    },
  },
  {
    id: '15',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1516834474-48c0abc2a902?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1516834474-48c0abc2a902?w=300&h=200&fit=crop&q=80',
    title: '高速道路点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-29T14:20:00',
      location: { name: '首都高速中央環状線', lat: 35.6285, lng: 139.7887 },
      resolution: '3840x2160',
      droneModel: 'DJI Phantom 4 Pro',
      tags: [
        { id: 'highway', label: '高速道路', color: '#607d8b' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '16',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop&q=80',
    title: '風力発電所点検_02',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-30T08:50:00',
      location: { name: '秋田風力発電所', lat: 39.7186, lng: 140.1024 },
      resolution: '4000x3000',
      droneModel: 'DJI Mavic 3',
      tags: [
        { id: 'wind', label: '風力発電', color: '#2196f3' },
        { id: 'attention', label: '要注意', color: '#ff9800' },
      ],
      status: 'attention',
    },
  },
  {
    id: '17',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=200&fit=crop&q=80',
    title: 'ビル外壁点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-07-01T12:30:00',
      location: { name: '丸の内オフィスビル', lat: 35.6813, lng: 139.767 },
      resolution: '6000x4000',
      droneModel: 'DJI Mini 3 Pro',
      tags: [
        { id: 'building', label: 'ビル', color: '#795548' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '18',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=300&h=200&fit=crop&q=80',
    title: '化学工場点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-07-02T15:15:00',
      location: { name: '川崎工業地帯', lat: 35.5308, lng: 139.7029 },
      resolution: '3840x2160',
      droneModel: 'DJI Air 2S',
      tags: [
        { id: 'chemical', label: '化学工場', color: '#9c27b0' },
        { id: 'repair', label: '要修理', color: '#f44336' },
      ],
      status: 'repair_needed',
    },
  },
  {
    id: '19',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop&q=80',
    title: '太陽光パネル点検_04',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-07-03T09:00:00',
      location: { name: '山梨発電所E地区', lat: 35.6638, lng: 138.5681 },
      resolution: '4000x3000',
      droneModel: 'DJI Phantom 4 Pro',
      tags: [
        { id: 'solar', label: '太陽光パネル', color: '#ff9800' },
        { id: 'repaired', label: '修理完了', color: '#4caf50' },
      ],
      status: 'repaired',
    },
  },
  {
    id: '20',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1586953983027-d7508edcf4c1?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1586953983027-d7508edcf4c1?w=300&h=200&fit=crop&q=80',
    title: '送電線点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-07-04T16:40:00',
      location: { name: '富士山麓送電線', lat: 35.3606, lng: 138.7274 },
      resolution: '6000x4000',
      droneModel: 'DJI Mavic 3',
      tags: [
        { id: 'powerline', label: '送電線', color: '#ff5722' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
]

export function DroneInspectionGallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // フォールバック画像URL
  const fallbackImageUrl =
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
  const fallbackThumbnailUrl =
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop&q=80'

  const handleOpen = (item: GalleryItem, index: number) => {
    setSelectedItem(item)
    setCurrentIndex(index)
  }

  const handleClose = () => {
    setSelectedItem(null)
  }

  const handleImageError = useCallback((imageId: string) => {
    setImageErrors((prev) => new Set([...prev, imageId]))
  }, [])

  const getImageUrl = useCallback(
    (item: GalleryItem, isThumb = false) => {
      if (imageErrors.has(item.id)) {
        return isThumb ? fallbackThumbnailUrl : fallbackImageUrl
      }
      return isThumb ? item.thumbnail : item.url
    },
    [imageErrors, fallbackImageUrl, fallbackThumbnailUrl]
  )

  const navigateTo = useCallback(
    (direction: 'prev' | 'next') => {
      let newIndex: number
      if (direction === 'prev') {
        newIndex =
          currentIndex === 0 ? sampleItems.length - 1 : currentIndex - 1
      } else {
        newIndex =
          currentIndex === sampleItems.length - 1 ? 0 : currentIndex + 1
      }
      setCurrentIndex(newIndex)
      setSelectedItem(sampleItems[newIndex])
    },
    [currentIndex]
  )

  // キーボードナビゲーション
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!selectedItem) return

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          navigateTo('prev')
          break
        case 'ArrowRight':
          event.preventDefault()
          navigateTo('next')
          break
        case 'Escape':
          event.preventDefault()
          handleClose()
          break
      }
    }

    if (selectedItem) {
      document.addEventListener('keydown', handleKeyPress)
      return () => document.removeEventListener('keydown', handleKeyPress)
    }
  }, [selectedItem, navigateTo])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'repair_needed':
        return '#d32f2f'
      case 'attention':
        return '#ff9800'
      case 'repaired':
        return '#4caf50'
      default:
        return '#2196f3'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'repair_needed':
        return '要修理'
      case 'attention':
        return '要注意'
      case 'repaired':
        return '修理済み'
      default:
        return '正常'
    }
  }

  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        ドローン点検 撮影ログギャラリー
      </Typography>

      {/* サムネイル一覧 */}
      <ImageList variant="masonry" cols={isMobile ? 2 : 3} gap={12}>
        {sampleItems.map((item, index) => (
          <ImageListItem
            key={item.id}
            onClick={() => handleOpen(item, index)}
            sx={{
              cursor: 'pointer',
              overflow: 'hidden',
              borderRadius: 2,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 4,
              },
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(item, true)}
              alt={item.title}
              loading="lazy"
              onError={() => handleImageError(item.id)}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
            <ImageListItemBar
              title={item.title}
              subtitle={
                item.metadata
                  ? new Date(item.metadata.captureDate).toLocaleDateString()
                  : ''
              }
              sx={{
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                '& .MuiImageListItemBar-title': {
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                },
                '& .MuiImageListItemBar-subtitle': {
                  fontSize: '0.8rem',
                },
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* 詳細表示ダイアログ */}
      <Dialog
        open={!!selectedItem}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            color: 'white',
          },
        }}
      >
        {selectedItem && (
          <>
            {/* ヘッダー部分 */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
              }}
            >
              <Typography variant="h6">{selectedItem.title}</Typography>
              <Box>
                <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

            {/* メディア表示部分 */}
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
              }}
            >
              {/* 前へナビゲーション */}
              <IconButton
                onClick={() => navigateTo('prev')}
                sx={{
                  position: 'absolute',
                  left: 16,
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  zIndex: 10,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>

              {/* メディアコンテンツ - 高機能ズーム対応 */}
              <ImageZoom
                src={getImageUrl(selectedItem, false)}
                alt={selectedItem.title}
                maxZoom={4}
                minZoom={1}
                zoomStep={0.5}
              />

              {/* 次へナビゲーション */}
              <IconButton
                onClick={() => navigateTo('next')}
                sx={{
                  position: 'absolute',
                  right: 16,
                  color: 'white',
                  zIndex: 10,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                <NavigateNextIcon />
              </IconButton>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

            {/* メタ情報表示部分 */}
            {selectedItem.metadata && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip
                    icon={<CalendarIcon />}
                    label={new Date(
                      selectedItem.metadata.captureDate
                    ).toLocaleString()}
                    size="small"
                    variant="outlined"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    }}
                  />
                  <Chip
                    icon={<LocationIcon />}
                    label={selectedItem.metadata.location.name}
                    size="small"
                    variant="outlined"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    }}
                  />
                  <Chip
                    label={selectedItem.metadata.resolution}
                    size="small"
                    variant="outlined"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    }}
                  />
                  <Chip
                    label={getStatusLabel(selectedItem.metadata.status)}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(
                        selectedItem.metadata.status
                      ),
                      color: 'white',
                    }}
                  />
                </Box>

                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  位置情報
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {selectedItem.metadata.location.name} (緯度:{' '}
                  {selectedItem.metadata.location.lat}, 経度:{' '}
                  {selectedItem.metadata.location.lng})
                </Typography>

                <Box
                  sx={{
                    height: 200,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <LocationIcon
                      sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.5)' }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      地図表示エリア
                    </Typography>
                  </Box>
                </Box>

                {selectedItem.metadata.tags &&
                  selectedItem.metadata.tags.length > 0 && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>
                        タグ
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedItem.metadata.tags.map((tag) => (
                          <Chip
                            key={tag.id}
                            label={tag.label}
                            size="small"
                            sx={{ backgroundColor: tag.color, color: 'white' }}
                          />
                        ))}
                      </Box>
                    </>
                  )}
              </Box>
            )}
          </>
        )}
      </Dialog>
    </>
  )
}
export default { DroneInspectionGallery }
