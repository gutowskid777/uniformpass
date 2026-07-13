import { Suspense } from 'react'
import BrowseExperience from '@/components/BrowseExperience'

// BrowseExperience reads useSearchParams() (URL-persisted filters). A statically
// prerendered route requires a Suspense boundary around that, or the '/' build fails.
export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <BrowseExperience />
    </Suspense>
  )
}
