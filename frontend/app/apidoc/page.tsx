'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function ApiDoc() {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (containerRef.current) {
      // @ts-ignore
      window.Redoc.init(
        `${apiUrl}/api/openapi.json`,
        {
          scrollYOffset: 0,
          hideHostname: true,
          theme: {
            colors: {
              primary: {
                main: '#2563eb',
              },
            },
            typography: {
              fontFamily: 'Inter, system-ui, sans-serif',
              headings: {
                fontFamily: 'Inter, system-ui, sans-serif',
              },
            },
          },
        },
        containerRef.current
      );
    }
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-white">
      <Script
        src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"
        strategy="beforeInteractive"
      />
      <div ref={containerRef} className="h-screen" />
    </div>
  );
} 