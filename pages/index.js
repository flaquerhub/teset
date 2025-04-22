// Estrutura de arquivos recomendada:
// 
// pages/
//   _app.js           - Configuração global (analytics, context providers)
//   _document.js      - Documento HTML base com metatags otimizadas
//   index.js          - Página de vendas principal (este arquivo)
// components/
//   Hero.js           - Componente de hero section
//   Benefits.js       - Componente de benefícios
//   Testimonials.js   - Componente de depoimentos
//   etc...
// public/
//   images/           - Imagens otimizadas
// 
// next.config.js      - Configuração de otimizações do Next.js
// tailwind.config.js  - Configuração do TailwindCSS

// Este é o arquivo pages/index.js - Página principal de vendas

import Head from 'next/head';
import Image from 'next/image'; // Componente de imagem otimizada
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Para animações performáticas
import { Toaster, toast } from 'react-hot-toast'; // Notificações de FOMO
import Schema from './components/Schema'; // Dados estruturados para SEO

// Componentes da página
import Hero from '../components/Hero';
import Benefits from '../components/Benefits';
import Story from '../components/Story';
import Solution from '../components/Solution';
import Testimonials from '../components/Testimonials';
import Offer from '../components/Offer';
import Guarantee from '../components/Guarantee';
import FinalCta from '../components/FinalCta';
import Faq from '../components/Faq';

// Hook customizado para observar a visibilidade dos elementos
import useIntersectionObserver from '../hooks/useIntersectionObserver';

// Dados do produto (poderia vir de uma API/CMS para facilitar atualizações)
import productData from '../data/product.json';

// Analytics
import { logEvent, logPurchase } from '../lib/analytics';

export default function SalesPage() {
  // Estado para controle do modal de oferta
  const [showOfferModal, setShowOfferModal] = useState(false);
  
  // Estado para controle de vagas restantes (com persistência)
  const [remainingSpots, setRemainingSpots] = useState(null);
  
  // Referência para o ref observado pelo Intersection Observer
  const [heroRef, heroIsVisible] = useIntersectionObserver({
    rootMargin: '0px',
    threshold: 0.1
  });
  
  // Efeito para carregar dados salvos e configurar FOMO
  useEffect(() => {
    // Recupera vagas restantes do localStorage ou define valor inicial
    const spots = localStorage.getItem('remainingSpots') || 100;
    setRemainingSpots(Number(spots));
    
    // Salva no localStorage para persistência
    const decreaseSpots = () => {
      if (Math.random() > 0.7) {
        setRemainingSpots(prev => {
          const newValue = Math.max(prev - 1, 5);
          localStorage.setItem('remainingSpots', newValue);
          return newValue;
        });
      }
    };
    
    // Simula compras de outros usuários para FOMO
    const interval = setInterval(() => {
      const names = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Lúcia'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      
      if (Math.random() > 0.7) {
        toast(`${randomName} acabou de adquirir o Manus.ai!`, {
          icon: '🎉',
          duration: 4000,
          className: 'bg-green-50 border-l-4 border-green-500 text-green-700 p-4'
        });
        decreaseSpots();
        
        // Log de evento para analytics
        logEvent('fomo_notification_shown');
      }
    }, 45000); // A cada 45 segundos
    
    // Configura registro de mouse leave
    const handleMouseLeave = (e) => {
      if (
        e.clientY <= 0 && 
        !sessionStorage.getItem('exitModalShown') && 
        !showOfferModal
      ) {
        setShowOfferModal(true);
        sessionStorage.setItem('exitModalShown', 'true');
        logEvent('exit_intent_modal_shown');
      }
    };
    
    // Adiciona eventos após um tempo para não interferir no UX inicial
    setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 30000);
    
    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showOfferModal]);
  
  // Função para lidar com clique no CTA
  const handleCtaClick = (ctaLocation) => {
    logEvent('cta_clicked', { location: ctaLocation });
  };

  return (
    <>
      <Head>
        {/* Meta tags básicas */}
        <title>{productData.title} | Crie Páginas de Vendas em Minutos</title>
        <meta name="description" content={productData.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Preload de recursos críticos */}
        <link 
          rel="preload" 
          href="/fonts/montserrat-v25-latin-700.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        
        {/* Preconectar a domínios externos */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* Meta tags para SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://manus.ai/pagina-vendas" />
        
        {/* Open Graph para compartilhamento social */}
        <meta property="og:title" content={productData.title} />
        <meta property="og:description" content={productData.description} />
        <meta property="og:image" content={productData.socialImage} />
        <meta property="og:url" content="https://manus.ai/pagina-vendas" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={productData.title} />
        <meta name="twitter:description" content={productData.description} />
        <meta name="twitter:image" content={productData.socialImage} />
      </Head>

      {/* Dados estruturados Schema.org para SEO */}
      <Schema 
        name={productData.title}
        description={productData.description}
        price={productData.price}
        originalPrice={productData.originalPrice}
        reviewCount={productData.reviewCount}
        reviewRating={productData.reviewRating}
      />
      
      {/* Componente de notificações toast para FOMO */}
      <Toaster position="bottom-right" />
      
      {/* Hero Section com lazy loading inteligente */}
      <section ref={heroRef}>
        <Hero 
          title={productData.heroTitle}
          subtitle={productData.heroSubtitle}
          videoUrl={productData.videoUrl}
          onCtaClick={() => handleCtaClick('hero')}
        />
      </section>
      
      {/* Benefícios com animação no scroll */}
      <Benefits benefits={productData.benefits} />
      
      {/* História com carregamento otimizado de imagens */}
      <Story 
        name={productData.authorName}
        bio={productData.authorBio}
        photoUrl={productData.authorPhoto}
      />
      
      {/* Solução com componentes otimizados */}
      <Solution 
        title={productData.solutionTitle}
        description={productData.solutionDescription}
        features={productData.solutionFeatures}
      />
      
      {/* Depoimentos com carregamento sob demanda */}
      <Testimonials testimonials={productData.testimonials} />
      
      {/* Oferta com rastreamento de eventos */}
      <Offer 
        mainProduct={productData.mainProduct}
        bonuses={productData.bonuses}
        price={productData.price}
        originalPrice={productData.originalPrice}
        discount={productData.discount}
        onCtaClick={() => handleCtaClick('offer')}
        remainingSpots={remainingSpots}
      />
      
      {/* Garantia com microcópia de redução de risco */}
      <Guarantee 
        days={productData.guaranteeDays}
        description={productData.guaranteeDescription}
      />
      
      {/* Chamada final com contador e urgência */}
      <FinalCta 
        title={productData.finalCtaTitle}
        description={productData.finalCtaDescription}
        expiryDate={productData.offerExpiry}
        onCtaClick={() => handleCtaClick('final')}
        remainingSpots={remainingSpots}
      />
      
      {/* FAQ com accordions otimizados */}
      <Faq faqs={productData.faqs} />
      
      {/* Footer com links de políticas e selo de segurança */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-400 text-sm mb-4">
              P.S.: Lembre-se que em 2025, apenas quem dominar o uso de agentes inteligentes autônomos se destacará no marketing digital.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              P.P.S.: Esta oferta com todos os bônus e preço especial estará disponível apenas por tempo limitado.
            </p>
            
            {/* Selos de segurança e confiança */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white p-2 rounded">
                <Image 
                  src="/images/secure-payment.svg" 
                  alt="Pagamento Seguro" 
                  width={80} 
                  height={40}
                  loading="lazy"
                />
              </div>
              <div className="bg-white p-2 rounded">
                <Image 
                  src="/images/ssl-badge.svg" 
                  alt="SSL Seguro" 
                  width={80} 
                  height={40}
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Links de políticas */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 text-sm">
              <a href="/termos" className="text-gray-400 hover:text-white transition">
                Termos de Uso
              </a>
              <a href="/privacidade" className="text-gray-400 hover:text-white transition">
                Política de Privacidade
              </a>
              <a href="/reembolso" className="text-gray-400 hover:text-white transition">
                Política de Reembolso
              </a>
              <a href="/suporte" className="text-gray-400 hover:text-white transition">
                Suporte
              </a>
            </div>
            
            <p className="text-xs text-gray-500">
              © 2025 Manus.ai - Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
      
      {/* Modal de exit intent */}
      <AnimatePresence>
        {showOfferModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-xl max-w-md w-full relative overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Barra superior colorida */}
              <div className="h-2 bg-gradient-to-r from-orange-500 to-yellow-400"></div>
              
              <button 
                onClick={() => setShowOfferModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                aria-label="Fechar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Espere! Oferta especial para você
                </h3>
                
                <p className="text-gray-600 mb-4">
                  Antes de sair, que tal um desconto extra de 10% na sua primeira compra?
                </p>
                
                <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-4">
                  <p className="font-medium text-orange-700">
                    Use o cupom: <span className="font-bold">PRIMEIRA10</span>
                  </p>
                </div>
                
                <button 
                  onClick={() => {
                    logEvent('exit_intent_cta_clicked');
                    window.location.href = '#offer';
                    setShowOfferModal(false);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  Aproveitar Agora
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Esta função é executada no servidor, permitindo dados dinâmicos por ISR (Incremental Static Regeneration)
export async function getStaticProps() {
  // Aqui poderia buscar dados de um CMS, API, etc.
  // Por exemplo, os valores de oferta, promoções, etc.
  
  return {
    props: {
      // Propriedades passadas para o componente
    },
    // Revalidar a cada 1 hora para manter dados como contador regressivo atualizados
    revalidate: 3600
  };
}
