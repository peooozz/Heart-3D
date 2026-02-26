import React, { useState, useEffect, useRef, useCallback } from 'react';
import HeartScene from './HeartScene';
import LoadingScreen from './LoadingScreen';
import { HEART_REGIONS, HeartRegion } from './heartData';
import { X, Lightbulb, Activity, Eye, EyeOff } from 'lucide-react';

interface LabelPos { id: string; name: string; x: number; y: number }

const HeartExplorer: React.FC = () => {
    const [loaded, setLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
    const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
    const [labelPositions, setLabelPositions] = useState<LabelPos[]>([]);
    const [xrayMode, setXrayMode] = useState(false);

    useEffect(() => {
        let v = 0;
        const iv = setInterval(() => {
            v += Math.random() * 18 + 5;
            if (v >= 100) { v = 100; clearInterval(iv); }
            setLoadProgress(v);
        }, 80);
        return () => clearInterval(iv);
    }, []);

    const handleSelectRegion = (id: string | null) => setSelectedRegion(id);
    const handleHover = (id: string | null, x: number, y: number) => {
        setHoveredRegion(id);
        setHoverPos({ x, y });
    };

    const selectedData = selectedRegion ? HEART_REGIONS.find(r => r.id === selectedRegion) : null;
    const hoveredData = hoveredRegion ? HEART_REGIONS.find(r => r.id === hoveredRegion) : null;

    return (
        <div className="relative w-screen h-screen overflow-hidden text-foreground">
            {!loaded && <LoadingScreen progress={loadProgress} />}

            <div className="absolute inset-0">
                <HeartScene
                    selectedRegion={selectedRegion}
                    onSelectRegion={handleSelectRegion}
                    onHoverRegion={handleHover}
                    onLoaded={() => setLoaded(true)}
                    onLabelPositions={setLabelPositions}
                    xrayMode={xrayMode}
                />

                {loaded && labelPositions.map(lp => {
                    const region = HEART_REGIONS.find(d => d.id === lp.id);
                    const isSelected = selectedRegion === lp.id;
                    const isHovered = hoveredRegion === lp.id;
                    return (
                        <div
                            key={lp.id}
                            className="absolute pointer-events-auto select-none transition-all duration-300 cursor-pointer"
                            style={{
                                left: lp.x,
                                top: lp.y,
                                transform: 'translate(-50%, -50%)',
                                opacity: isSelected ? 1 : isHovered ? 0.95 : 0.55,
                            }}
                            onClick={(e) => { e.stopPropagation(); handleSelectRegion(isSelected ? null : lp.id); }}
                            onMouseEnter={() => handleHover(lp.id, lp.x, lp.y)}
                            onMouseLeave={() => handleHover(null, 0, 0)}
                        >
                            <div className="flex flex-col items-center hover:scale-110 transition-transform">
                                <div
                                    className="w-3 h-3 rounded-full flex-shrink-0 mb-1"
                                    style={{
                                        background: region?.color ?? '#ccc',
                                        boxShadow: isSelected ? `0 0 12px ${region?.color}` : '0 2px 4px rgba(0,0,0,0.2)',
                                        border: '2px solid white'
                                    }}
                                />
                                <span
                                    className="text-xs font-bold whitespace-nowrap px-2 py-0.5 rounded-full"
                                    style={{
                                        color: isSelected ? '#fff' : '#334155',
                                        background: isSelected ? region?.color : 'rgba(255,255,255,0.9)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        fontSize: '11px',
                                        letterSpacing: '0.02em',
                                    }}
                                >
                                    {lp.name}
                                </span>

                                {isSelected && selectedData && (
                                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 pointer-events-auto" style={{ zIndex: 50 }}>
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 shadow-lg" />
                                        <div className="relative bg-white rounded-2xl p-5 shadow-2xl border border-slate-100/50 flex flex-col items-start text-left">
                                            <div className="flex justify-between items-center w-full mb-3">
                                                <h2 className="text-lg flexitems-center gap-2 font-bold text-slate-800">
                                                    <div className="w-3 h-3 rounded-full" style={{ background: selectedData.color }} />
                                                    {selectedData.name}
                                                </h2>
                                                <button onClick={(e) => { e.stopPropagation(); setSelectedRegion(null); }} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 rounded-full p-1"><X size={14} /></button>
                                            </div>
                                            <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">{selectedData.description}</p>

                                            <div className="w-full mb-4">
                                                <div className="text-[10px] font-bold tracking-wider text-slate-400 mb-2 uppercase">Primary Functions</div>
                                                <ul className="space-y-1">
                                                    {selectedData.functions.slice(0, 3).map((fn, i) => (
                                                        <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                                                            <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ background: selectedData.color }} />
                                                            <span>{fn}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="bg-slate-50 rounded-xl p-3 w-full border border-slate-200/50">
                                                <div className="flex items-center gap-1.5 mb-1 text-slate-600">
                                                    <Lightbulb size={12} />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Interesting Fact</span>
                                                </div>
                                                <p className="text-xs text-slate-700/80 leading-relaxed font-medium">{selectedData.facts[0]}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {hoveredRegion && hoveredData && hoveredRegion !== selectedRegion && (
                    <div
                        className="fixed z-20 pointer-events-none px-3 py-2 rounded-xl shadow-lg"
                        style={{
                            left: hoverPos.x + 16,
                            top: hoverPos.y - 12,
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(12px)',
                            border: `1px solid ${hoveredData.color}44`,
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ background: hoveredData.color }}
                            />
                            <span className="text-xs font-semibold text-slate-800">{hoveredData.name}</span>
                        </div>
                        <div className="text-[10px] mt-0.5 text-slate-500 font-medium tracking-wide">Click to explore</div>
                    </div>
                )}
            </div>

            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 flex flex-col sm:flex-row items-end sm:items-center gap-2 md:gap-3">

                <div className="flex items-center gap-1.5 md:gap-2 px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-200/60" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: '#64748b' }} />
                    <span className="text-xs md:text-sm font-bold text-slate-600">60 BPM</span>
                </div>
            </div>

            {loaded && (
                <div
                    className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-10 p-3 md:p-4 rounded-2xl max-h-[35vh] md:max-h-[40vh] overflow-y-auto shadow-[0_4px_20px_rgba(0,0,0,0.08)] max-w-[calc(100vw-32px)] md:max-w-xs"
                    style={{
                        background: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(226,232,240,0.8)',
                    }}
                >
                    <div className="text-[10px] md:text-xs font-bold mb-2 md:mb-3 text-slate-400 uppercase tracking-widest">REGIONS</div>
                    <div className="space-y-0.5 md:space-y-1">
                        {HEART_REGIONS.map(def => (
                            <button
                                key={def.id}
                                onClick={() => setSelectedRegion(selectedRegion === def.id ? null : def.id)}
                                className="flex items-center gap-2 md:gap-2.5 w-full text-left transition-all duration-200 rounded-lg px-2 py-1.5 hover:bg-slate-100/80"
                                style={{
                                    background: selectedRegion === def.id ? `${def.color}25` : 'transparent',
                                }}
                            >
                                <div
                                    className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0"
                                    style={{ background: def.color, boxShadow: selectedRegion === def.id ? `0 0 8px ${def.color}88` : 'none' }}
                                />
                                <span
                                    className="text-xs md:text-sm font-semibold truncate"
                                    style={{ color: selectedRegion === def.id ? '#0f172a' : '#64748b' }}
                                >
                                    {def.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {!selectedRegion && loaded && (
                <div className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none animate-bounce">
                    <div
                        className="px-5 py-3 rounded-full text-sm flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.06)] font-bold tracking-wide"
                        style={{
                            background: 'rgba(255,255,255,0.92)',
                            color: '#334155',
                            border: '1px solid rgba(226,232,240,0.8)'
                        }}
                    >
                        <Activity size={16} className="text-slate-500" />
                        Drag to rotate · Scroll to zoom · Click a region to explore
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeartExplorer;
