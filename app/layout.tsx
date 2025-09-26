import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: 'Novothon - Redefining Economic Opportunities for Builders',
  description: 'Join the largest community of developers, designers, and innovators building the future through hackathons.',
  keywords: 'hackathons, developers, innovation, coding, programming',
  authors: [{ name: 'Novothon' }],
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon/favicon.ico',
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'icon',
        url: '/favicon/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        rel: 'icon',
        url: '/favicon/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  },
  openGraph: {
    title: 'Novothon - Redefining Economic Opportunities for Builders',
    description: 'Join the largest community of developers, designers, and innovators building the future through hackathons.',
    type: 'website',
    url: 'https://your-domain.com',
    images: ['https://your-domain.com/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Novothon - Redefining Economic Opportunities for Builders',
    description: 'Join the largest community of developers, designers, and innovators building the future through hackathons.',
    images: ['https://your-domain.com/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}
