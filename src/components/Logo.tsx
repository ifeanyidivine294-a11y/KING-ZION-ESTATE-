import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  showMotto?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  className = '',
  showMotto = false,
}) => {
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <div className="relative shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          <path
            d="M6 22L24 7L42 22L39 25L24 12.5L9 25L6 22Z"
            fill={isDark ? '#D6B779' : '#102F2B'}
          />
          <path
            d="M32 10.5V6H36V13.8L32 10.5Z"
            fill={isDark ? '#F5F3ED' : '#1D5147'}
          />
          <path
            d="M12 24.5L24 14.5L36 24.5V39H12V24.5Z"
            stroke={isDark ? '#F5F3ED' : '#D6B779'}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M17 39V28H23V39H17Z"
            fill={isDark ? '#D6B779' : '#102F2B'}
          />
          <path
            d="M25 39V26H31V39H25Z"
            stroke="#D6B779"
            strokeWidth="1.5"
            fill={isDark ? '#102F2B' : '#F5F3ED'}
          />
          <rect
            x="4"
            y="39"
            width="40"
            height="3"
            rx="1.5"
            fill="#D6B779"
          />
        </svg>
      </div>

      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-serif-display font-bold tracking-wide text-sm sm:text-lg uppercase ${
            isDark ? 'text-white' : 'text-[#102F2B]'
          }`}
        >
          KING ZION'S ESTATE
        </span>
        {showMotto && (
          <span
            className={`text-[10px] sm:text-xs italic mt-1 font-serif-display ${
              isDark ? 'text-[#D6B779]' : 'text-[#69736D]'
            }`}
          >
            Our Customers' Satisfaction Is Our Overall Aim.
          </span>
        )}
      </div>
    </div>
  );
};
