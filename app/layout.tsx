import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Typefoundry - Distraction-Free Writing',
  description: 'A tactile minimalist writing environment for novels, screenplays, and poetry',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
