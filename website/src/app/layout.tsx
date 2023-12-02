import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Right Pay Now',
  description: 'Get Right Pay Now with Apple\'s Testflight',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let title = "Right Pay Now";
  let description = "Get Right Pay Now with Apple's Testflight!";
  return (
    <html lang="en">
      <Head>
        <meta key="og-title" property="og:title" content={title} />
        <meta key="og-description" property="og:description" content={description} />
        <meta key="og-url" property="og:url" content={`https://rightpaynow.com`} />
        <meta key="og-image" property="og:image" content={`https://rightpaynow.com/images/BetaLogo.png`} />
        <meta key="twitter-title" name="twitter:title" content={title} />
        <meta key="twitter-description" name="twitter:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        {/* <meta name="twitter:site" content="@lighter_app" /> */}
        <meta name="twitter:image" content={`https://rightpaynow.com/images/BetaLogo.png`} />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
