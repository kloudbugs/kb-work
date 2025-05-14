import React from 'react';

export default function CoffeeCup() {
  return (
    <div className="w-12 h-12 mr-3 relative">
      {/* Coffee Cup */}
      <div className="absolute w-10 h-8 bottom-0 left-1 bg-gradient-to-b from-gray-700 to-gray-900 rounded-b-lg rounded-t-sm border border-gray-600"></div>
      
      {/* Cup Handle */}
      <div className="absolute w-3 h-5 bg-gradient-to-r from-gray-700 to-gray-900 right-0 bottom-1 rounded-r-full border-t border-r border-b border-gray-600"></div>
      
      {/* Coffee Liquid */}
      <div className="absolute w-8 h-5 bottom-1 left-2 bg-gradient-to-b from-amber-600 to-amber-800 rounded-b-md overflow-hidden">
        {/* Coffee Surface with Bubbles */}
        <div className="w-full h-1.5 bg-gradient-to-r from-amber-500 to-amber-600 absolute top-0 rounded-full overflow-hidden">
          {/* Animated Bubbles */}
          <div className="absolute left-1 bottom-0 w-1.5 h-1.5 bg-white rounded-full opacity-80 animate-bubble"></div>
          <div className="absolute left-3 bottom-0 w-1 h-1 bg-white rounded-full opacity-80 animate-bubble" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute left-5 bottom-0 w-1.5 h-1.5 bg-white rounded-full opacity-80 animate-bubble" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>
      
      {/* Steam Animation - Now more visible */}
      <div className="absolute -top-4 left-2 w-1.5 h-4 bg-white opacity-80 rounded-full animate-steam"></div>
      <div className="absolute -top-6 left-5 w-1.5 h-5 bg-white opacity-80 rounded-full animate-steam" style={{ animationDelay: '0.3s' }}></div>
      <div className="absolute -top-5 left-8 w-1.5 h-4 bg-white opacity-80 rounded-full animate-steam" style={{ animationDelay: '0.7s' }}></div>
      
      {/* Bitcoin symbol on the cup */}
      <div className="absolute left-4 bottom-3 w-3 h-3 text-amber-300 flex items-center justify-center text-xs font-bold" style={{ transform: 'rotate(15deg)' }}>
        ₿
      </div>
    </div>
  );
}