import { CountdownTimer } from './CountdownTimer';
import type { CountdownResponse } from '../../../server/src/schema';

interface HeroSectionProps {
  countdown: CountdownResponse;
  onScrollToSection: (section: string) => void;
}

export function HeroSection({ countdown, onScrollToSection }: HeroSectionProps) {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center relative pt-20">
      {/* Parallax background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/20 to-black/40"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Main Title */}
        <div className="mb-8 fade-in">
          <h1 className="text-8xl md:text-9xl font-black font-orbitron bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text mb-4">
            SEE CONF 2025
          </h1>
          <p className="text-3xl md:text-4xl font-light font-rajdhani text-cyan-300 mb-2">
            预见未来前端
          </p>
          <p className="text-2xl font-rajdhani text-gray-300">
            2025.11.22
          </p>
        </div>

        {/* Countdown */}
        <div className="fade-in" style={{ animationDelay: '0.3s' }}>
          <CountdownTimer countdown={countdown} />
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center fade-in" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={() => onScrollToSection('registration')}
            className="floating-btn px-8 py-4 rounded-full text-xl font-bold font-rajdhani text-white hover:scale-105 transform transition-all duration-300 relative z-10"
          >
            立即报名
          </button>
          <button
            onClick={() => onScrollToSection('about')}
            className="px-8 py-4 rounded-full text-xl font-rajdhani border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 hover-particles"
          >
            了解更多
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 fade-in" style={{ animationDelay: '0.9s' }}>
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 mt-2">向下滚动探索</p>
        </div>
      </div>

      {/* Holographic overlay */}
      <div className="absolute inset-0 holographic pointer-events-none"></div>
    </section>
  );
}