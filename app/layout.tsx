import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CompanyName - Redefining Economic Opportunities for Builders',
  description: 'Join the largest community of developers, designers, and innovators building the future through hackathons.',
  keywords: 'hackathons, developers, innovation, coding, programming',
  authors: [{ name: 'CompanyName' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'CompanyName - Redefining Economic Opportunities for Builders',
    description: 'Join the largest community of developers, designers, and innovators building the future through hackathons.',
    type: 'website',
    url: 'https://your-domain.com',
    images: ['https://your-domain.com/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CompanyName - Redefining Economic Opportunities for Builders',
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
