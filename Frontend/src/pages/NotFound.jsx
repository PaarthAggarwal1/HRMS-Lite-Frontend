import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    useEffect(() => {
        document.title = "Page Not Found | Docksboard";

        // Optional: Add some parallax effect on mouse movement
        const handleMouseMove = (e) => {
            const elements = document.querySelectorAll('.parallax');
            elements.forEach(elem => {
                const speed = elem.getAttribute('data-speed');
                const x = (window.innerWidth - e.pageX * speed) / 100;
                const y = (window.innerHeight - e.pageY * speed) / 100;
                elem.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob top-0 right-0 parallax" data-speed="2"></div>
            <div className="absolute w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 bottom-0 left-0 parallax" data-speed="4"></div>
            <div className="absolute w-60 h-60 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 top-1/2 left-1/3 parallax" data-speed="6"></div>

            <div className="flex flex-col items-center text-center z-10 max-w-3xl">
                {/* Combined 404 and Magnifying Glass SVG */}
                <div className="w-full max-w-md mx-auto mb-8 transform transition-all duration-500 hover:scale-105">
                    <svg
                        viewBox="0 0 600 240"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-auto"
                    >

                        {/* Right Side - Magnifying Glass */}
                        <g className="animate-bounce" style={{ animationDuration: '2.5s' }}>
                            {/* Glass */}
                            <circle
                                cx="330"
                                cy="100"
                                r="45"
                                stroke="#3B82F6"
                                strokeWidth="12"
                                fill="white"
                                fillOpacity="0.6"
                            />

                            {/* Handle */}
                            <line
                                x1="370"
                                y1="130"
                                x2="410"
                                y2="170"
                                stroke="#3B82F6"
                                strokeWidth="14"
                                strokeLinecap="round"
                            />

                            {/* Question mark inside glass */}
                            <text
                                x="330"
                                y="115"
                                fill="#3B82F6"
                                fontSize="40"
                                fontWeight="bold"
                                textAnchor="middle"
                            >?</text>
                        </g>

                    </svg>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                    <span className="text-blue-600">404</span> | Page Not Found
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                    Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="flex flex-col md:flex-row gap-4">
                    <Link
                        to="/"
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        Go to Homepage
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all hover:-translate-y-1"
                    >
                        Go Back
                    </button>
                </div>
            </div>

            {/* Add subtle, animated elements in background */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute rounded-full opacity-20 ${i % 3 === 0 ? 'animate-bounce' :
                                i % 3 === 1 ? 'animate-pulse' :
                                    'animate-ping opacity-10'
                            }`}
                        style={{
                            width: `${Math.random() * 200 + 50}px`,
                            height: `${Math.random() * 200 + 50}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            backgroundColor: i % 2 === 0 ? '#3b82f6' : '#10b981',
                            animationDuration: `${Math.random() * 5 + 10}s`
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default NotFound;
