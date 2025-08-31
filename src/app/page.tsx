import type { Metadata } from 'next'
import HomePageContent from '@/components/home-page-content'

export const metadata: Metadata = {
  title: 'React PhotoSwipe Gallery MUI',
  description:
    'Modern photo gallery with MUI ImageList and PhotoSwipe integration',
}

export default function Home() {
  return <HomePageContent />
}
