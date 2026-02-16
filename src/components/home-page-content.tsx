'use client'

import { Container } from '@mui/material'
import dynamic from 'next/dynamic'

const DroneInspectionGallery = dynamic(
  () => import('@/components/gallery/drone-inspection-gallery'),
  { ssr: false }
)

export default function HomePageContent() {
  return (
    <Container maxWidth="xl" sx={{ py: 1 }}>
      <DroneInspectionGallery />
    </Container>
  )
}
