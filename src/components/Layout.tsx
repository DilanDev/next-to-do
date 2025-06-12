import React from 'react';
import Head from 'next/head';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'TODO App' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Aplicación TODO con Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <header className="border-b border-gray-100 bg-white/60 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-extralight text-gray-900 tracking-wider">
                TODO
              </h1>
              <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-6 py-12">
          {children}
        </main>
      </div>
    </>
  );
}