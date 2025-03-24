import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SupaSched - Therapist Scheduling Platform',
  description: 'Modern appointment scheduling for therapists and mental health professionals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
} 