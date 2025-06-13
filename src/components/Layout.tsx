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
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-white to-gray-700">
        <header className=" border-gray-100 bg-white/60 backdrop-blur-md sticky top-0 z-50 rounded-xl">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-start gap-4">
              <h1 className="text-2xl font-stretch-105% text-gray-00 tracking-wider">
                TO DO
              </h1>
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