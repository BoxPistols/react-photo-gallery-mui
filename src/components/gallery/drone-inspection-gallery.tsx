'use client'

import React, { useState } from 'react'
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
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material'
import type { GalleryItem } from '@/types/gallery'
import { ImageZoom } from './image-zoom'

// サンプルデータ
const sampleItems: GalleryItem[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1570298995084-9c18ffa7b2c3?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1570298995084-9c18ffa7b2c3?w=300&h=200&fit=crop&q=80',
    title: '太陽光パネル点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-15T10:30:00',
      location: {
        name: '東京発電所A地区',
        lat: 35.6895,
        lng: 139.6917,
      },
      resolution: '3840x2160',
      droneModel: 'DJI Mavic 3',
      tags: [
        { id: 'solar', label: '太陽光パネル', color: '#ff9800' },
        { id: 'anomaly', label: '異常箇所', color: '#f44336' },
        { id: 'repair', label: '要修理', color: '#d32f2f' },
      ],
      status: 'repair_needed',
    },
  },
  {
    id: '2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=200&fit=crop&q=80',
    title: '橋梁点検_05',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-18T14:22:00',
      location: {
        name: '〇〇橋梁',
        lat: 35.6581,
        lng: 139.7514,
      },
      resolution: '4000x3000',
      droneModel: 'DJI Air 2S',
      tags: [
        { id: 'concrete', label: 'コンクリート', color: '#607d8b' },
        { id: 'crack', label: 'ひび割れ', color: '#ff5722' },
        { id: 'aging', label: '経年劣化', color: '#795548' },
      ],
      status: 'attention',
    },
  },
  {
    id: '3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&h=200&fit=crop&q=80',
    title: '鉄塔点検_12',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-06-22T11:45:00',
      location: {
        name: '××送電線',
        lat: 35.6812,
        lng: 139.7671,
      },
      resolution: '6000x4000',
      droneModel: 'DJI Phantom 4 Pro',
      tags: [
        { id: 'tower', label: '鉄塔', color: '#424242' },
        { id: 'corrosion', label: '腐食', color: '#8d6e63' },
        { id: 'paint', label: '塗装剥離', color: '#ffc107' },
      ],
      status: 'repaired',
    },
  },
]

export function DroneInspectionGallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleOpen = (item: GalleryItem, index: number) => {
    setSelectedItem(item)
    setCurrentIndex(index)
  }

  const handleClose = () => {
    setSelectedItem(null)
  }

  const navigateTo = (direction: 'prev' | 'next') => {
    let newIndex: number
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? sampleItems.length - 1 : currentIndex - 1
    } else {
      newIndex = currentIndex === sampleItems.length - 1 ? 0 : currentIndex + 1
    }
    setCurrentIndex(newIndex)
    setSelectedItem(sampleItems[newIndex])
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
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        ドローン点検 撮影ログギャラリー
      </Typography>

      {/* サムネイル一覧 */}
      <ImageList
        variant="masonry"
        cols={isMobile ? 2 : 3}
        gap={12}
      >
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
            <img
              src={item.thumbnail}
              alt={item.title}
              loading="lazy"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
            <ImageListItemBar
              title={item.title}
              subtitle={item.metadata ? new Date(item.metadata.captureDate).toLocaleDateString() : ''}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
              <Typography variant="h6">{selectedItem.title}</Typography>
              <Box>
                <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

            {/* メディア表示部分 */}
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
              {/* 前へナビゲーション */}
              <IconButton
                onClick={() => navigateTo('prev')}
                sx={{
                  position: 'absolute',
                  left: 16,
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>

              {/* メディアコンテンツ - 高機能ズーム対応 */}
              <ImageZoom
                src={selectedItem.url}
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
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
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
                    label={new Date(selectedItem.metadata.captureDate).toLocaleString()}
                    size="small"
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
                  />
                  <Chip
                    icon={<LocationIcon />}
                    label={selectedItem.metadata.location.name}
                    size="small"
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
                  />
                  <Chip
                    label={selectedItem.metadata.resolution}
                    size="small"
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}
                  />
                  <Chip
                    label={getStatusLabel(selectedItem.metadata.status)}
                    size="small"
                    sx={{ 
                      backgroundColor: getStatusColor(selectedItem.metadata.status),
                      color: 'white' 
                    }}
                  />
                </Box>

                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  位置情報
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {selectedItem.metadata.location.name} (緯度: {selectedItem.metadata.location.lat}, 経度: {selectedItem.metadata.location.lng})
                </Typography>

                <Box sx={{ height: 200, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <LocationIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.5)' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      地図表示エリア
                    </Typography>
                  </Box>
                </Box>

                {selectedItem.metadata.tags && selectedItem.metadata.tags.length > 0 && (
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