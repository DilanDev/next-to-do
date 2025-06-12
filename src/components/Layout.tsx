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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Header minimalista */}
        <header className="border-b border-gray-200/50 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <h1 className="text-2xl font-light text-gray-900 tracking-tight">
              TODO
            </h1>
          </div>
        </header>
        
        {/* Main content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </>
  );
}