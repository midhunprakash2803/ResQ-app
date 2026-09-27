import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Vector Emblem: Road + Location Pin + Rescue Cross */}
      <div className={`relative ${iconSizes[size]} shrink-0`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Location Pin Outer Shield */}
          <path
            d="M24 3C14.0589 3 6 11.0589 6 21C6 31.5 20.5 44 24 46C27.5 44 42 31.5 42 21C42 11.0589 33.9411 3 24 3Z"
            fill="#0B192C"
            className="dark:fill-[#1E293B]"
          />

          {/* Perspective Road Geometry inside Pin */}
          <path
            d="M17 32L21.5 13H26.5L31 32H17Z"
            fill="#1E3E62"
            className="dark:fill-[#0F172A]"
          />

          {/* Dashed Center Road Lane Divider */}
          <line
            x1="24"
            y1="16"
            x2="24"
            y2="20"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="24"
            y1="23"
            x2="24"
            y2="28"
            stroke="#FF6500"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Rescue Cross / First-Aid Aid Badge atop pin */}
          <circle cx="24" cy="10" r="5" fill="#FF6500" />
          <path
            d="M24 7.5V12.5M21.5 10H26.5"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-black tracking-tight flex items-center ${textSizes[size]}`}>
          <span className="text-slate-900 dark:text-slate-50">Road</span>
          <span className="text-[#FF6500]">ResQ</span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-normal mt-0.5">
            Help when your vehicle stops.
          </span>
        )}
      </div>
    </div>
  );
};
