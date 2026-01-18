import React from 'react';

const LoadingScreen = ({ message = "Loading experience..." }) => {
    return (
        <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center z-50">
            <div className="relative flex items-center justify-center mb-8">
                {/* Outer spinning ring */}
                <div className="absolute w-32 h-32 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin-slow opacity-75"></div>

                {/* Inner pulsing circle */}
                <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600/20 to-blue-600/20 animate-pulse"></div>

                {/* Core Icon/Element */}
                <div className="relative z-10 w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-8 h-8 text-white animate-bounce-subtle"
                    >
                        <path d="M12 2v4" />
                        <path d="m16.2 7.8 2.9-2.9" />
                        <path d="M18 12h4" />
                        <path d="m16.2 16.2 2.9 2.9" />
                        <path d="M12 18v4" />
                        <path d="m4.9 19.1 2.9-2.9" />
                        <path d="M2 12h4" />
                        <path d="m4.9 4.9 2.9 2.9" />
                    </svg>
                </div>
            </div>

            {/* Text Content */}
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse mb-2">
                RTRP
            </h2>
            <p className="text-gray-400 text-sm font-medium tracking-wide">
                {message}
            </p>
        </div>
    );
};

export default LoadingScreen;
