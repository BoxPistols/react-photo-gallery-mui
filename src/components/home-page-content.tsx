'use client'

import { Container, Typography, Box } from '@mui/material'
import dynamic from 'next/dynamic'

const DroneInspectionGallery = dynamic(
  () => import('@/components/gallery/drone-inspection-gallery'),
  { ssr: false }
)

export default function HomePageContent() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          React PhotoSwipe Gallery MUI
        </Typography>
        <Typography variant="h6" color="text.secondary">
          MUI ImageList + PhotoSwipe v5 Integration
        </Typography>
      </Box>

      <DroneInspectionGallery />
    </Container>
  )
}
