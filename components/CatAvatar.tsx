import React from 'react';
import { CatAccessory } from '../types';

interface CatAvatarProps {
  accessory: CatAccessory;
  mood?: 'happy' | 'neutral' | 'sleepy';
}

const CatAvatar: React.FC<CatAvatarProps> = ({ accessory, mood = 'neutral' }) => {
  return (
    <div className="relative w-48 h-48 mx-auto transition-transform hover:scale-105 duration-300">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
        {/* Body */}
        <ellipse cx="100" cy="140" rx="60" ry="50" fill="#A0A0A0" />
        <ellipse cx="100" cy="140" rx="40" ry="30" fill="#B0B0B0" /> 
        
        {/* Tail */}
        <path d="M150 160 Q 190 140 180 100" stroke="#A0A0A0" strokeWidth="20" fill="none" strokeLinecap="round" />

        {/* Head */}
        <circle cx="100" cy="80" r="50" fill="#A0A0A0" />
        
        {/* Stripes (Tabby marks) */}
        <path d="M100 40 L 95 50 L 105 50 Z" fill="#404040" />
        <path d="M80 45 L 75 55 L 85 55 Z" fill="#404040" />
        <path d="M120 45 L 115 55 L 125 55 Z" fill="#404040" />
        <path d="M60 80 Q 70 80 75 85" stroke="#404040" strokeWidth="3" fill="none" />
        <path d="M140 80 Q 130 80 125 85" stroke="#404040" strokeWidth="3" fill="none" />

        {/* Ears */}
        <path d="M60 50 L 50 20 L 80 40 Z" fill="#A0A0A0" stroke="#808080" strokeWidth="2"/>
        <path d="M140 50 L 150 20 L 120 40 Z" fill="#A0A0A0" stroke="#808080" strokeWidth="2"/>
        <path d="M62 48 L 56 30 L 75 42 Z" fill="#FEC8D8" /> {/* Inner ear pink */}
        <path d="M138 48 L 144 30 L 125 42 Z" fill="#FEC8D8" />

        {/* Eyes */}
        <circle cx="80" cy="75" r="6" fill="#000" />
        <circle cx="120" cy="75" r="6" fill="#000" />
        <circle cx="78" cy="73" r="2" fill="#FFF" />
        <circle cx="118" cy="73" r="2" fill="#FFF" />

        {/* Nose & Mouth */}
        <path d="M95 85 L 105 85 L 100 92 Z" fill="#FEC8D8" />
        <path d="M100 92 Q 90 100 85 95" stroke="#404040" strokeWidth="2" fill="none" />
        <path d="M100 92 Q 110 100 115 95" stroke="#404040" strokeWidth="2" fill="none" />

        {/* Whiskers */}
        <line x1="130" y1="85" x2="160" y2="80" stroke="#DDD" strokeWidth="1" />
        <line x1="130" y1="90" x2="160" y2="90" stroke="#DDD" strokeWidth="1" />
        <line x1="130" y1="95" x2="160" y2="100" stroke="#DDD" strokeWidth="1" />
        
        <line x1="70" y1="85" x2="40" y2="80" stroke="#DDD" strokeWidth="1" />
        <line x1="70" y1="90" x2="40" y2="90" stroke="#DDD" strokeWidth="1" />
        <line x1="70" y1="95" x2="40" y2="100" stroke="#DDD" strokeWidth="1" />

        {/* Accessories */}
        {accessory === CatAccessory.GLASSES && (
          <g>
            <circle cx="80" cy="75" r="12" stroke="#333" strokeWidth="3" fill="rgba(255,255,255,0.2)" />
            <circle cx="120" cy="75" r="12" stroke="#333" strokeWidth="3" fill="rgba(255,255,255,0.2)" />
            <line x1="92" y1="75" x2="108" y2="75" stroke="#333" strokeWidth="3" />
          </g>
        )}

        {accessory === CatAccessory.BOW_TIE && (
          <path d="M90 120 L 70 110 L 70 130 L 90 120 M110 120 L 130 110 L 130 130 L 110 120" fill="#FF6B6B" />
        )}
        {accessory === CatAccessory.BOW_TIE && (
             <circle cx="100" cy="120" r="5" fill="#FF6B6B" stroke="#CC5555" />
        )}

        {accessory === CatAccessory.HAT && (
           <g transform="translate(65, 5)">
             <rect x="10" y="30" width="50" height="10" fill="#333" rx="2" />
             <rect x="20" y="5" width="30" height="25" fill="#333" />
             <rect x="20" y="25" width="30" height="5" fill="#C0392B" />
           </g>
        )}
      </svg>
    </div>
  );
};

export default CatAvatar;
