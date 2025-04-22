// components/Hero.js
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Hook para verificar se o dispositivo é móvel
import useMediaQuery from '../hooks/useMediaQuery';

export default function Hero({ title, subtitle, videoUrl, onCtaClick }) {
  // Estado para controlar o carregamento do vídeo
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Verifica se é dispositivo móvel para otimização de recursos
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Monitora interseção com o viewport para carregamento preguiçoso avançado
  useEffect(() => {
    // Usa Intersection Observer para detectar quando o elemento está visível
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // Se o elemento estiver visível e o vídeo ainda não foi carregado
          if (entry.isIntersecting && !videoLoaded) {
            // Carrega o vídeo apenas quando necessário
            setTimeout(() => setVideoLoaded(true), 100);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Elemento a ser observado
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      observer.observe(heroSection);
    }
    
    return () => {
      if (heroSection) {
        observer.unobserve(heroSection);
      }
    };
  }, [videoLoaded]);

  return (
    <section 
      className="hero-section relative overflow-hidden bg-gradient-to-r from-orange-600 to-amber-500 text-white py-16 md:py-24"
      // Atributo para otimização de LCP (Largest Contentful Paint)
      fetchpriority="high"
    >
      {/* Efeito de gradiente em fundo */}
      <div className="absolute inset-0 bg-gradient-radial from-yellow-400/20 to-transparent opacity-70"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Título com otimização para LCP */}
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6 max-w-4xl"
            // Atributo para Core Web Vitals
            data-lcp-element="true"
          >
            {title}
          </h1>
          
          {/* Subtítulo */}
          <p className="text-lg md:text-xl font-medium mb-8 max-w-3xl">
            {subtitle}
          </p>
          
          {/* CTA Principal com tratamento de clique e tracking */}
          <Link
            href="#offer"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-orange-600 bg-white rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            onClick={onCtaClick}
            // Atributos de acessibilidade
            role="button"
            aria-label="Ver oferta especial"
            // Tracking de conversão
            data-conversion-element="hero-cta"
          >
            <span>QUERO CRIAR PÁGINAS QUE CONVERTEM AGORA</span>
            <svg 
              className="w-5 h-5 ml-2 transition-transform duration-300 ease-in-out transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
          
          {/* Área de vídeo com carregamento otimizado */}
          <div className="mt-10 w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl">
            {videoLoaded ? (
              // Se o vídeo estiver carregado, mostra o player
              <div className="aspect-w-16 aspect-h-9 bg-gray-900">
                {/* Para o exemplo, usamos uma imagem como placeholder. Em produção seria um vídeo real */}
                <Image
                  src="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80"
                  alt="Vídeo de apresentação do Manus.ai"
                  width={1200}
                  height={675}
                  // Prioriza qualidade ou velocidade dependendo da rede
                  quality={isMobile ? 80 : 90}
                  // Carregamento prioritário para a imagem do vídeo
                  priority={true}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              // Enquanto o vídeo não carrega, mostra um placeholder otimizado
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-r from-gray-900 to-gray-800 animate-pulse flex items-center justify-center">
                <div className="text-gray-400">
                  <svg 
                    className="w-12 h-12 mx-auto" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="mt-2">Carregando vídeo...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Indicadores de confiança - Badges visíveis imediatamente para aumentar credibilidade */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
            {['Satisfação Garantida', 'Acesso Imediato', 'Suporte Premium', 'Atualizado 2025'].map((badge, index) => (
              <div 
                key={index}
                className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-flex items-center"
              >
                <svg 
                  className="w-4 h-4 mr-2 text-yellow-300" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="text-sm font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Waves SVG para transição suave para a próxima seção */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-16 md:h-24"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            fill="#ffffff"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            fill="#ffffff"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="#ffffff"
          ></path>
        </svg>
      </div>
    </section>
  );
}