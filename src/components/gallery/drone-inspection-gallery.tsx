'use client'

import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  ViewModule as ViewModuleIcon,
  TableRows as TableRowsIcon,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import React, { useState, useEffect, useCallback, useRef } from 'react'

import type { GalleryItem } from '@/types/gallery'

import { ImageZoom } from './image-zoom'
import { LocationMap } from './location-map'
import { OverviewMap } from './overview-map'

interface DroneInspectionGalleryProps {
  forceColumns?: number | null
  showDebugInfo?: boolean
  themeMode?: 'light' | 'dark'
}

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
    url: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=300&h=200&fit=crop&q=80',
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
    url: 'https://images.unsplash.com/photo-1572201050000-0c2e9b5ad9be?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1572201050000-0c2e9b5ad9be?w=300&h=200&fit=crop&q=80',
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
    url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=300&h=200&fit=crop&q=80',
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
    url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=200&fit=crop&q=80',
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
  {
    id: '21',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c91a?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1520637836862-4d197d17c91a?w=300&h=200&fit=crop&q=80',
    title: '鉄道橋梁点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-07-05T11:20:00',
      location: { name: '東海道新幹線橋梁', lat: 35.1709, lng: 136.8816 },
      resolution: '4000x3000',
      droneModel: 'DJI Air 2S',
      tags: [
        { id: 'railway', label: '鉄道橋梁', color: '#607d8b' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '22',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&q=80',
    title: '風力発電所点検_03',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-07-06T14:15:00',
      location: { name: '北海道風力発電所', lat: 43.0644, lng: 141.3468 },
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
    id: '23',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop&q=80',
    title: 'トンネル入口点検_01',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-07-07T09:30:00',
      location: { name: '関越トンネル入口', lat: 36.7372, lng: 138.9854 },
      resolution: '3840x2160',
      droneModel: 'DJI Mini 3 Pro',
      tags: [
        { id: 'tunnel', label: 'トンネル', color: '#795548' },
        { id: 'attention', label: '要注意', color: '#ff9800' },
      ],
      status: 'attention',
    },
  },
  {
    id: '24',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&q=80',
    title: '橋梁点検_03',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-07-08T13:45:00',
      location: { name: '明石海峡大橋', lat: 34.6161, lng: 135.0215 },
      resolution: '6000x4000',
      droneModel: 'DJI Mavic 3',
      tags: [
        { id: 'bridge', label: '橋梁', color: '#607d8b' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '25',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=300&h=200&fit=crop&q=80',
    title: '化学工場点検_02',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-07-09T16:20:00',
      location: { name: '四日市工業地帯', lat: 34.9652, lng: 136.6169 },
      resolution: '4000x3000',
      droneModel: 'DJI Air 2S',
      tags: [
        { id: 'chemical', label: '化学工場', color: '#9c27b0' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '26',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1448630360428-65456885c650?w=300&h=200&fit=crop&q=80',
    title: 'ビル外壁点検_02',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-07-10T10:10:00',
      location: { name: '大阪梅田スカイビル', lat: 34.7024, lng: 135.4959 },
      resolution: '6000x4000',
      droneModel: 'DJI Phantom 4 Pro',
      tags: [
        { id: 'building', label: 'ビル', color: '#795548' },
        { id: 'repair', label: '要修理', color: '#f44336' },
      ],
      status: 'repair_needed',
    },
  },
  {
    id: '27',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=300&h=200&fit=crop&q=80',
    title: '太陽光パネル点検_05',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-07-11T12:00:00',
      location: { name: '福島発電所F地区', lat: 37.7504, lng: 140.4676 },
      resolution: '3840x2160',
      droneModel: 'DJI Mini 3 Pro',
      tags: [
        { id: 'solar', label: '太陽光パネル', color: '#ff9800' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '28',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1594736797933-d0802ba11ccd?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1594736797933-d0802ba11ccd?w=300&h=200&fit=crop&q=80',
    title: '送電線点検_02',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-07-12T15:30:00',
      location: { name: '九州送電線網', lat: 33.5902, lng: 130.4017 },
      resolution: '4000x3000',
      droneModel: 'DJI Air 2S',
      tags: [
        { id: 'powerline', label: '送電線', color: '#ff5722' },
        { id: 'attention', label: '要注意', color: '#ff9800' },
      ],
      status: 'attention',
    },
  },
  {
    id: '29',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop&q=80',
    title: '鉄道橋梁点検_02',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-07-13T08:45:00',
      location: { name: '山陽新幹線橋梁', lat: 34.6901, lng: 135.1955 },
      resolution: '6000x4000',
      droneModel: 'DJI Mavic 3',
      tags: [
        { id: 'railway', label: '鉄道橋梁', color: '#607d8b' },
        { id: 'normal', label: '正常', color: '#4caf50' },
      ],
      status: 'normal',
    },
  },
  {
    id: '30',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80',
    thumbnail:
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=300&h=200&fit=crop&q=80',
    title: '風力発電所点検_04',
    width: 800,
    height: 600,
    metadata: {
      captureDate: '2023-07-14T11:15:00',
      location: { name: '沖縄風力発電所', lat: 26.2124, lng: 127.6809 },
      resolution: '3840x2160',
      droneModel: 'DJI Phantom 4 Pro',
      tags: [
        { id: 'wind', label: '風力発電', color: '#2196f3' },
        { id: 'repaired', label: '修理完了', color: '#4caf50' },
      ],
      status: 'repaired',
    },
  },
]

function DroneInspectionGallery({
  forceColumns = null,
  showDebugInfo = false,
  themeMode = 'light',
}: DroneInspectionGalleryProps = {}) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(
    null
  )
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map())
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // 列数の決定ロジック
  const getColumns = () => {
    if (forceColumns !== null) return forceColumns
    return isMobile ? 2 : 3
  }

  // フォールバック画像URL
  const fallbackImageUrl =
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80'
  const fallbackThumbnailUrl =
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop&q=80'

  const handleOpen = (item: GalleryItem, index: number) => {
    setSelectedItem(item)
    setCurrentIndex(index)
  }

  const handleClose = () => {
    setSelectedItem(null)
  }

  // ピンクリック → ギャラリーアイテムをハイライト＆スクロール
  const handlePinSelect = useCallback((item: GalleryItem, index: number) => {
    setHighlightedItemId(item.id)
    const el = itemRefs.current.get(item.id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
    handleOpen(item, index)
  }, [])

  // ギャラリーアイテムホバー → マップピンをハイライト
  const handleItemHover = useCallback((itemId: string | null) => {
    setHighlightedItemId(itemId)
  }, [])

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
        sx={{ mb: 2 }}
      >
        ドローン点検 撮影ログギャラリー
        {showDebugInfo && (
          <Typography
            variant="caption"
            sx={{ display: 'block', mt: 1, color: 'text.secondary' }}
          >
            Theme: {themeMode} | Columns: {getColumns()} | Images:{' '}
            {sampleItems.length}
          </Typography>
        )}
      </Typography>

      {/* メイン: 撮影位置分布マップ */}
      <OverviewMap
        items={sampleItems}
        height={500}
        activeItemId={highlightedItemId}
        onPinClick={(item, index) => handlePinSelect(item, index)}
      />

      {/* サブ: 撮影一覧（グリッド/テーブル切替） */}
      <Box
        sx={{
          mt: 3,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          撮影一覧（{sampleItems.length}件）
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, v) => {
            if (v) setViewMode(v)
          }}
          size="small"
        >
          <ToggleButton value="grid" aria-label="グリッド表示">
            <ViewModuleIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="table" aria-label="テーブル表示">
            <TableRowsIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === 'grid' ? (
        <ImageList cols={isMobile ? 3 : 6} gap={6} sx={{ mt: 1 }}>
          {sampleItems.map((item, index) => (
            <ImageListItem
              key={item.id}
              ref={(el: HTMLLIElement | null) => {
                if (el) itemRefs.current.set(item.id, el)
              }}
              onClick={() => handleOpen(item, index)}
              onMouseEnter={() => handleItemHover(item.id)}
              onMouseLeave={() => handleItemHover(null)}
              sx={{
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 1,
                transition: 'box-shadow 0.2s, transform 0.2s',
                boxShadow:
                  highlightedItemId === item.id ? '0 0 0 3px #1976d2' : 'none',
                transform:
                  highlightedItemId === item.id ? 'scale(1.05)' : 'none',
                '&:hover': { opacity: 0.85 },
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
                  height: 80,
                  objectFit: 'cover',
                }}
              />
              <ImageListItemBar
                title={item.title}
                sx={{
                  '& .MuiImageListItemBar-title': {
                    fontSize: '0.65rem',
                    lineHeight: 1.2,
                  },
                  '& .MuiImageListItemBar-titleWrap': {
                    p: '4px 6px',
                  },
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ mt: 1, maxHeight: 360 }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: 60 }}>写真</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>タイトル</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>撮影日</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>場所</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>ステータス</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleItems.map((item, index) => (
                <TableRow
                  key={item.id}
                  ref={(el: HTMLTableRowElement | null) => {
                    if (el) itemRefs.current.set(item.id, el)
                  }}
                  hover
                  selected={highlightedItemId === item.id}
                  onClick={() => handleOpen(item, index)}
                  onMouseEnter={() => handleItemHover(item.id)}
                  onMouseLeave={() => handleItemHover(null)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell sx={{ p: 0.5 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(item, true)}
                      alt={item.title}
                      onError={() => handleImageError(item.id)}
                      style={{
                        width: 48,
                        height: 36,
                        objectFit: 'cover',
                        borderRadius: 4,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>
                    {item.title}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {item.metadata
                      ? new Date(item.metadata.captureDate).toLocaleDateString()
                      : ''}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>
                    {item.metadata?.location.name || ''}
                  </TableCell>
                  <TableCell>
                    {item.metadata && (
                      <Chip
                        label={getStatusLabel(item.metadata.status)}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(item.metadata.status),
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 22,
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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

                <LocationMap
                  lat={selectedItem.metadata.location.lat}
                  lng={selectedItem.metadata.location.lng}
                  name={selectedItem.metadata.location.name}
                  height={200}
                />

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
export default DroneInspectionGallery
