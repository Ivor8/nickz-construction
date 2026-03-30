import React, { useEffect, useState } from 'react';
import { BRAND } from '@/lib/constants';

const Preloader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setVisible(false), 400);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1F2F8F] transition-opacity duration-500 ${progress >= 100 ? 'opacity-0' : 'opacity-100'}`}>
      {/* Crane Animation */}
      <div className="relative w-48 h-48 mb-8">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Crane base */}
          <rect x="90" y="140" width="20" height="60" fill="#F5A623" rx="2" />
          <rect x="70" y="190" width="60" height="10" fill="#FF8C00" rx="2" />
          {/* Crane arm */}
          <rect x="30" y="130" width="140" height="8" fill="#F5A623" rx="2">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="-5 100 134"
              to="5 100 134"
              dur="2s"
              repeatCount="indefinite"
              type="rotate"
            />
          </rect>
          {/* Crane cable */}
          <line x1="50" y1="138" x2="50" y2="170" stroke="#FFFFFF" strokeWidth="2">
            <animate attributeName="y2" values="160;180;160" dur="1.5s" repeatCount="indefinite" />
          </line>
          {/* Hook */}
          <path d="M45 170 Q50 180 55 170" stroke="#F5A623" strokeWidth="3" fill="none">
            <animate attributeName="d" values="M45 160 Q50 170 55 160;M45 180 Q50 190 55 180;M45 160 Q50 170 55 160" dur="1.5s" repeatCount="indefinite" />
          </path>
          {/* Building blocks being built */}
          <rect x="120" y="180" width="30" height="15" fill="#FFFFFF" opacity="0.9" rx="1" />
          <rect x="120" y="163" width="30" height="15" fill="#FFFFFF" opacity="0.7" rx="1">
            <animate attributeName="opacity" values="0;0.7" dur="1s" fill="freeze" />
          </rect>
          <rect x="120" y="146" width="30" height="15" fill="#FFFFFF" opacity="0.5" rx="1">
            <animate attributeName="opacity" values="0;0.5" dur="2s" fill="freeze" />
          </rect>
          {/* Cabin */}
          <rect x="85" y="120" width="30" height="20" fill="#FF8C00" rx="3" />
          <rect x="90" y="125" width="8" height="8" fill="#1F2F8F" rx="1" />
        </svg>
      </div>

      {/* Logo */}
      <img src={BRAND.logo} alt={BRAND.name} className="w-24 h-auto mb-4 rounded-lg" />

      {/* Company Name */}
      <h2 className="text-white text-xl font-bold mb-2 tracking-wide">{BRAND.shortName}</h2>
      <p className="text-[#F5A623] text-sm italic mb-6">{BRAND.tagline}</p>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-100 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #F5A623, #FF8C00)',
          }}
        />
      </div>
      <p className="text-white/60 text-xs mt-2">Building your experience... {progress}%</p>
    </div>
  );
};

export default Preloader;
