// next.config.js
// Configurações avançadas para otimização de performance

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Otimização avançada de imagens
    images: {
      domains: ['images.unsplash.com'], // Domínios externos permitidos
      formats: ['image/avif', 'image/webp'], // Formatos modernos prioritários
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // Tamanhos otimizados
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Tamanhos para ícones e imagens menores
      minimumCacheTTL: 60 * 60 * 24 * 7, // Cache de 7 dias
    },
    
    // Otimização de scripts
    compiler: {
      // Remove console.logs em produção
      removeConsole: process.env.NODE_ENV === 'production',
    },
    
    // Minificação e compressão avançada
    swcMinify: true,
    
    // Configuração de headers para segurança e performance
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            // Security headers
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
            // Content Security Policy
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; img-src 'self' data: https://images.unsplash.com; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://vitals.vercel-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;",
            },
            // Cache Control para recursos estáticos
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          // Headers específicos para recursos estáticos
          source: '/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          // Headers para fonts
          source: '/fonts/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    },
    
    // Configuração para Progressive Web App
    experimental: {
      nextScriptWorkers: true, // Isola scripts de terceiros em web workers
    },
    
    // Otimização de performance baseada na rota
    async rewrites() {
      return {
        beforeFiles: [
          // Redireciona versões não-www para www
          {
            source: '/:path*',
            has: [
              {
                type: 'host',
                value: 'manus.ai',
              },
            ],
            destination: 'https://www.manus.ai/:path*',
          },
        ],
        afterFiles: [
          // Mapeia URLs amigáveis
          {
            source: '/garantia',
            destination: '/termos-garantia',
          },
        ],
      };
    },
  };
  
  module.exports = nextConfig;
  
  // postcss.config.js 
  // Configuração para otimização de CSS
  module.exports = {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
      'postcss-preset-env': {
        features: { 'nesting-rules': false }
      },
      ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
    },
  };
  
  // tailwind.config.js
  // Configuração otimizada para Tailwind
  /** @type {import('tailwindcss').Config} */
  module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          'orange': {
            50: '#fff8eb',
            100: '#ffeac1',
            200: '#ffd88a',
            300: '#ffc554',
            400: '#ffb01e',
            500: '#ff9f1c', // Cor principal
            600: '#e08000',
            700: '#b76201',
            800: '#944e08',
            900: '#7a410d',
          },
        },
        fontFamily: {
          sans: ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        },
        animation: {
          'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        aspectRatio: {
          'video': '16 / 9',
        },
      },
    },
    plugins: [
      require('@tailwindcss/aspect-ratio'),
      require('@tailwindcss/forms'),
      // Plugin para reduzir tamanho do CSS
      function({ addBase, addUtilities, addComponents, e, config }) {
        // Adiciona apenas a fonte necessária
        addBase({
          '@font-face': {
            fontFamily: 'Montserrat',
            fontStyle: 'normal',
            fontWeight: '400 700',
            fontDisplay: 'swap',
            src: "url('/fonts/montserrat-var.woff2') format('woff2')",
          },
        });
      },
    ],
    // Purge de CSS não utilizado
    purge: {
      content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
      options: {
        safelist: ['html', 'body'],
      },
    },
  };
  
  // _document.js
  // Configuração base do documento HTML para otimização
  import Document, { Html, Head, Main, NextScript } from 'next/document';
  
  class MyDocument extends Document {
    render() {
      return (
        <Html lang="pt-BR">
          <Head>
            {/* Preload da fonte variable para carregamento otimizado */}
            <link
              rel="preload"
              href="/fonts/montserrat-var.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
            
            {/* Preconnect para domínios externos */}
            <link rel="preconnect" href="https://images.unsplash.com" />
            
            {/* Favicons otimizados */}
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/manifest.json" />
            
            {/* Injeção de script crítico para evitar FOUC (Flash of Unstyled Content) */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  // Estratégia para evitar Flash of Unstyled Content
                  (function() {
                    // Verifica tema escuro/claro
                    document.documentElement.classList.add('light');
                    
                    // Script de Performance Analytics
                    // Métricas Core Web Vitals
                    var script = document.createElement('script');
                    script.src = 'https://vitals.vercel-analytics.com/v1/vitals.js';
                    script.defer = true;
                    document.head.appendChild(script);
                    
                    // Função para reportar métricas CWV
                    window.reportWebVitals = function(metric) {
                      if (metric.name === 'LCP' || metric.name === 'FID' || metric.name === 'CLS') {
                        // Envia para analytics
                        console.log(metric);
                      }
                    };
                  })();
                `,
              }}
            />
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      );
    }
  }
  
  export default MyDocument;