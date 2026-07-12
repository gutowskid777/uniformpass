import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import BrowseExperience from '@/components/BrowseExperience'
import { getTheme, scopedUrl } from '@/lib/schoolTheme'

// The canonical school link: uniformpass.shop/s/sjr. Short enough for a QR,
// human enough for a group chat, and the preview card carries school colors.

type Props = { params: { code: string } }

export function generateMetadata({ params }: Props): Metadata {
  const theme = getTheme(params.code)
  if (!theme) return {}
  const title = `${theme.fullName} Uniform Exchange · UniformPass`
  const description = `Skip the $80 uniform. Buy and sell used ${theme.shortName} uniforms with local families. No fees, no shipping, meet up local.`
  const image = `/api/og?school=${theme.code}`
  return {
    title,
    description,
    openGraph: { title, description, images: [image], url: scopedUrl(theme.code) },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export default function SchoolPage({ params }: Props) {
  if (!getTheme(params.code)) redirect('/')
  return <BrowseExperience schoolCode={params.code} />
}
