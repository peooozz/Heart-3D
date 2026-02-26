import React from 'react';
import { Heart } from 'lucide-react';

interface LoadingScreenProps {
  progress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'var(--gradient-bg)' }}
    >
      {/* Animated heart icon */}
      <div className="relative mb-8">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse-slow"
          style={{
            background: 'radial-gradient(circle, hsl(217 91% 60% / 0.15), transparent 70%)',
            border: '1px solid hsl(217 91% 60% / 0.3)',
          }}
        >
          <div className="animate-spin-slow">
            <Heart size={48} style={{ color: 'hsl(340 91% 60%)' }} />
          </div>
        </div>
        {/* Orbit rings */}
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border animate-spin-slow"
            style={{
              borderColor: `hsl(217 91% 60% / ${0.15 / i})`,
              transform: `scale(${1 + i * 0.35})`,
              animationDuration: `${4 + i * 2}s`,
              animationDirection: i % 2 === 0 ? 'reverse' : 'normal',
            }}
          />
        ))}
      </div>

      {/* Title */}
      <h1
        className="text-3xl font-bold mb-2 tracking-tight text-glow"
        style={{ color: 'hsl(var(--primary))', fontFamily: 'var(--font-sans)' }}
      >
        Heart Explorer
      </h1>
      <p className="text-sm mb-8" style={{ color: 'hsl(var(--muted-foreground))' }}>
        Loading 3D heart structures...
      </p>

      {/* Progress bar */}
      <div className="w-72">
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: 'hsl(var(--muted))' }}
        >
          <div
            className="h-full rounded-full loading-progress transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs font-mono" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Initializing cardiovascular model...
          </span>
          <span className="text-xs font-mono" style={{ color: 'hsl(var(--primary))' }}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Floating dots decoration */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-pulse-slow"
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            background: `hsl(217 91% ${50 + Math.random() * 30}% / 0.4)`,
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

export default LoadingScreen;
