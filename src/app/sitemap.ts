import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://capychina.example.com'
  return [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/roadmap`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/dashboard`, changeFrequency: 'weekly', priority: 0.5 },
  ]
}


