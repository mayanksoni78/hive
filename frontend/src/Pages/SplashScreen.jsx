import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
    const navigate = useNavigate();
    const [phase, setPhase] = useState(0);
    const [audioBlocked, setAudioBlocked] = useState(false);
    const audioRef = useRef(null);
    const timersRef = useRef([]);

    // ── Start the animation + audio sequence ──
    const startSequence = () => {
        setAudioBlocked(false);

        if (audioRef.current) {
            audioRef.current.volume = 0.7;
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});

            // Fade out audio after 3.5s so it doesn't cut abruptly
            const fadeStart = 3500;
            const fadeDuration = 800;
            const fadeTimer = setTimeout(() => {
                const steps = 20;
                const interval = fadeDuration / steps;
                let step = 0;
                const fade = setInterval(() => {
                    step++;
                    if (audioRef.current) {
                        audioRef.current.volume = Math.max(0, 0.7 * (1 - step / steps));
                    }
                    if (step >= steps) clearInterval(fade);
                }, interval);
            }, fadeStart);
            timersRef.current.push(fadeTimer);
        }

        const t1 = setTimeout(() => setPhase(1), 300);
        const t2 = setTimeout(() => setPhase(2), 900);
        const t3 = setTimeout(() => setPhase(3), 1800);
        const t4 = setTimeout(() => setPhase(4), 3800);
        const t5 = setTimeout(() => navigate('/landing'), 4500);
        timersRef.current.push(t1, t2, t3, t4, t5);
    };

    useEffect(() => {
        // Pre-load audio
        const audio = new Audio('/sounds/splash.mp3');
        audio.preload = 'auto';
        audioRef.current = audio;

        // Try autoplay immediately
        audio.play()
            .then(() => {
                // Autoplay worked — start phases
                audio.pause();
                audio.currentTime = 0;
                startSequence();
            })
            .catch(() => {
                // Autoplay blocked — show tap-to-continue overlay
                setAudioBlocked(true);
                setPhase(0);
            });

        return () => {
            timersRef.current.forEach(clearTimeout);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    // ── If autoplay blocked, user taps to start ──
    if (audioBlocked) {
        return (
            <div
                className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer"
                style={{ background: '#0a0f17' }}
                onClick={startSequence}
            >
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;600&display=swap');
                    @keyframes tap-pulse {
                        0%, 100% { opacity: 0.4; transform: scale(1); }
                        50%       { opacity: 1;   transform: scale(1.08); }
                    }
                    .tap-pulse { animation: tap-pulse 1.8s ease-in-out infinite; }
                `}</style>

                <div className="inline-block p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>

                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3.5rem', color: '#fff', letterSpacing: '0.3em', lineHeight: 1 }}>
                    HIVE
                </p>
                <div style={{ width: 40, height: 3, background: '#4f73b3', borderRadius: 2, margin: '8px auto 32px' }} />

                <div className="tap-pulse flex flex-col items-center gap-3">
                    <svg className="w-8 h-8 text-[#4f73b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                    </svg>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.3em', color: 'rgba(148,163,184,0.7)', textTransform: 'uppercase' }}>
                        Tap anywhere to continue
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center overflow-hidden"
            style={{
                background: '#0a0f17',
                transition: phase === 4 ? 'background 0.6s ease' : 'none',
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;600&display=swap');

                /* Grid lines */
                .splash-grid {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(79,115,179,0.07) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(79,115,179,0.07) 1px, transparent 1px);
                    background-size: 60px 60px;
                    opacity: 0;
                    transition: opacity 0.8s ease;
                }
                .splash-grid.visible { opacity: 1; }

                /* Radial glow behind logo */
                .splash-glow {
                    position: absolute;
                    width: 500px;
                    height: 500px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(79,115,179,0.18) 0%, transparent 70%);
                    opacity: 0;
                    transform: scale(0.6);
                    transition: opacity 0.8s ease, transform 1s ease;
                }
                .splash-glow.visible { opacity: 1; transform: scale(1); }

                /* Hexagon SVG */
                .splash-hex {
                    opacity: 0;
                    transform: scale(0.7) rotate(-15deg);
                    transition: opacity 0.6s ease, transform 0.8s cubic-bezier(0.34,1.56,0.64,1);
                }
                .splash-hex.visible { opacity: 1; transform: scale(1) rotate(0deg); }

                /* Letter-by-letter H I V E */
                .hive-letter {
                    display: inline-block;
                    opacity: 0;
                    transform: translateY(24px);
                    font-family: 'Bebas Neue', sans-serif;
                    font-size: 5rem;
                    letter-spacing: 0.3em;
                    color: #ffffff;
                    transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
                }
                .hive-letter.visible { opacity: 1; transform: translateY(0); }
                .hive-letter:nth-child(1) { transition-delay: 0.05s; }
                .hive-letter:nth-child(2) { transition-delay: 0.15s; }
                .hive-letter:nth-child(3) { transition-delay: 0.25s; }
                .hive-letter:nth-child(4) { transition-delay: 0.35s; }

                /* Accent bar under HIVE */
                .splash-bar {
                    width: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #4f73b3, #7fa8e0);
                    border-radius: 2px;
                    transition: width 0.7s cubic-bezier(0.4,0,0.2,1) 0.5s;
                }
                .splash-bar.visible { width: 60px; }

                /* Tagline */
                .splash-tagline {
                    font-family: 'Barlow', sans-serif;
                    font-size: 0.65rem;
                    font-weight: 600;
                    letter-spacing: 0.35em;
                    text-transform: uppercase;
                    color: rgba(148,163,184,0.8);
                    opacity: 0;
                    transform: translateY(8px);
                    transition: opacity 0.6s ease, transform 0.6s ease;
                }
                .splash-tagline.visible { opacity: 1; transform: translateY(0); }

                /* Corner brackets */
                .bracket {
                    position: absolute;
                    width: 28px;
                    height: 28px;
                    opacity: 0;
                    transition: opacity 0.5s ease 0.4s;
                }
                .bracket.visible { opacity: 1; }
                .bracket-tl { top: -20px; left: -20px; border-top: 2px solid rgba(79,115,179,0.6); border-left: 2px solid rgba(79,115,179,0.6); }
                .bracket-tr { top: -20px; right: -20px; border-top: 2px solid rgba(79,115,179,0.6); border-right: 2px solid rgba(79,115,179,0.6); }
                .bracket-bl { bottom: -20px; left: -20px; border-bottom: 2px solid rgba(79,115,179,0.6); border-left: 2px solid rgba(79,115,179,0.6); }
                .bracket-br { bottom: -20px; right: -20px; border-bottom: 2px solid rgba(79,115,179,0.6); border-right: 2px solid rgba(79,115,179,0.6); }

                /* Orbiting dots */
                @keyframes orbit {
                    from { transform: rotate(0deg) translateX(90px) rotate(0deg); }
                    to   { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
                }
                @keyframes orbit-rev {
                    from { transform: rotate(0deg) translateX(70px) rotate(0deg); }
                    to   { transform: rotate(-360deg) translateX(70px) rotate(360deg); }
                }
                .orbit-dot {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: #4f73b3;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }
                .orbit-dot.visible { opacity: 0.7; }
                .orbit-dot-1 { animation: orbit 4s linear infinite; }
                .orbit-dot-2 { animation: orbit 4s linear infinite 1.33s; }
                .orbit-dot-3 { animation: orbit 4s linear infinite 2.66s; }
                .orbit-dot-inner { animation: orbit-rev 3s linear infinite; background: rgba(127,168,224,0.5); }

                /* White wipe overlay */
                .splash-wipe {
                    position: absolute;
                    inset: 0;
                    background: white;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.6s ease;
                }
                .splash-wipe.visible { opacity: 1; }

                /* Scanning line */
                @keyframes scan {
                    0%   { top: -2px; opacity: 0; }
                    5%   { opacity: 1; }
                    95%  { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .scan-line {
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(79,115,179,0.4), transparent);
                    animation: scan 3s linear infinite;
                    pointer-events: none;
                }
            `}</style>

            {/* Grid background */}
            <div className={`splash-grid ${phase >= 1 ? 'visible' : ''}`} />

            {/* Scanning line */}
            {phase >= 1 && <div className="scan-line" />}

            {/* Radial glow */}
            <div className={`splash-glow ${phase >= 2 ? 'visible' : ''}`} />

            {/* Orbiting dots */}
            <div className="absolute" style={{ width: 0, height: 0 }}>
                <div className={`orbit-dot orbit-dot-1 ${phase >= 2 ? 'visible' : ''}`} />
                <div className={`orbit-dot orbit-dot-2 ${phase >= 2 ? 'visible' : ''}`} />
                <div className={`orbit-dot orbit-dot-3 ${phase >= 2 ? 'visible' : ''}`} />
                <div className={`orbit-dot orbit-dot-inner ${phase >= 2 ? 'visible' : ''}`} />
            </div>

            {/* Central logo block */}
            <div className="relative flex flex-col items-center gap-4" style={{ zIndex: 10 }}>

                {/* Corner brackets around the whole logo area */}
                <div className="relative px-10 py-8">
                    <div className={`bracket bracket-tl ${phase >= 2 ? 'visible' : ''}`} />
                    <div className={`bracket bracket-tr ${phase >= 2 ? 'visible' : ''}`} />
                    <div className={`bracket bracket-bl ${phase >= 2 ? 'visible' : ''}`} />
                    <div className={`bracket bracket-br ${phase >= 2 ? 'visible' : ''}`} />

                    {/* Hexagon icon */}
                    <div className={`splash-hex flex justify-center mb-2 ${phase >= 2 ? 'visible' : ''}`}>
                        <svg width="56" height="64" viewBox="0 0 56 64" fill="none">
                            <polygon
                                points="28,2 54,17 54,47 28,62 2,47 2,17"
                                stroke="rgba(79,115,179,0.9)"
                                strokeWidth="2"
                                fill="rgba(79,115,179,0.08)"
                            />
                            <polygon
                                points="28,12 44,21 44,43 28,52 12,43 12,21"
                                stroke="rgba(79,115,179,0.4)"
                                strokeWidth="1"
                                fill="rgba(79,115,179,0.04)"
                            />
                            {/* Building icon inside hex */}
                            <path
                                d="M22 44V28a2 2 0 012-2h8a2 2 0 012 2v16M19 44h18M25 32h1M25 36h1M30 32h1M30 36h1M26 44v-4a1 1 0 011-1h2a1 1 0 011 1v4"
                                stroke="rgba(255,255,255,0.85)"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* H I V E letters */}
                    <div className="flex items-end justify-center" style={{ lineHeight: 1 }}>
                        {['H', 'I', 'V', 'E'].map((char, i) => (
                            <span
                                key={i}
                                className={`hive-letter ${phase >= 2 ? 'visible' : ''}`}
                            >
                                {char}
                            </span>
                        ))}
                    </div>

                    {/* Blue accent bar */}
                    <div className="flex justify-center mt-1">
                        <div className={`splash-bar ${phase >= 2 ? 'visible' : ''}`} />
                    </div>
                </div>

                {/* Tagline */}
                <p className={`splash-tagline ${phase >= 3 ? 'visible' : ''}`}>
                    Hostel Management System
                </p>

                {/* Tiny dots row */}
                <div className={`flex gap-2 mt-1 transition-opacity duration-500 ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                    {[0, 1, 2].map(i => (
                        <div
                            key={i}
                            className="w-1 h-1 rounded-full bg-[#4f73b3]"
                            style={{
                                opacity: phase >= 3 ? 1 : 0,
                                transition: `opacity 0.4s ease ${0.1 + i * 0.15}s`,
                                animation: phase >= 3 ? `pulse 1.5s ease-in-out ${i * 0.3}s infinite` : 'none',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* White wipe-out overlay */}
            <div className={`splash-wipe ${phase >= 4 ? 'visible' : ''}`} />
        </div>
    );
}