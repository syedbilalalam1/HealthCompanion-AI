import type { Metadata } from 'next'
import './globals.css'
import { Inter } from "next/font/google"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Posture Fix',
  description: 'Your personal health companion',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen antialiased bg-white text-gray-900`}>
        {children}
        <Toaster 
          richColors 
          position="top-center"
          closeButton
        />
      </body>
    </html>
  )
}
