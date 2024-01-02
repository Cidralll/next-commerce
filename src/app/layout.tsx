import type { Metadata } from 'next'
import clsx from 'clsx'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from '@clerk/localizations';
import Hydrate from './components/Hydrate'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LC E-Commerce',
  description: 'LC E-Commerce',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-br">
        <body className={clsx(inter.className, 'bg-slate-700')}>
          <Hydrate>
            <Navbar />
            <main className='h-screen p-16'>
              {children}
            </main>
          </Hydrate>
        </body>
      </html>
    </ClerkProvider>
  )
}
