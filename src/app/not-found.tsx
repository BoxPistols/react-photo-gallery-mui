'use client'

import { Container, Typography, Box, Button } from '@mui/material'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          ページが見つかりません
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          お探しのページは存在しないか、移動された可能性があります。
        </Typography>
        <Button component={Link} href="/" variant="contained" size="large">
          ホームに戻る
        </Button>
      </Box>
    </Container>
  )
}
