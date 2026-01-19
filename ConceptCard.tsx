import React, { useState } from 'react';
import { UGCConcept, Scene, GenerationOptions } from '../types';

interface ConceptCardProps {
  concept: UGCConcept;
  index: number;
  defaultOpen?: boolean;
  options: GenerationOptions;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

const CopyButton: React.FC<{ text: string; label: string; iconPath: string; variant?: 'default' | 'creative' }> = ({ 
  text, 
  label, 
  iconPath, 
  variant = 'default' 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseClasses = "flex items-center gap-3 px-4 py-3 text-xs font-medium rounded-xl transition-all duration-200 border w-full text-left group relative overflow-hidden";
  
  const defaultClasses = copied 
    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
    : 'bg-black/20 border-white/5 text-slate-400 hover:bg-black/40 hover:text-indigo-300 hover:border-indigo-500/30';
  
  const creativeClasses = copied
    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
    : 'bg-indigo-500/5 border-indigo-500/10 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-500/30';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); 
        handleCopy();
      }}
      title="Salin Konten"
      className={`${baseClasses} ${variant === 'creative' ? creativeClasses : defaultClasses}`}
    >
      <div className={`p-1.5 rounded-md ${copied ? 'bg-emerald-500/20' : 'bg-white/5 group-hover:bg-white/10'} transition-colors`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
            <path d={iconPath} />
        </svg>
      </div>
      <div className="flex flex-col flex-1 min-w-0">
         <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold mb-0.5">{label}</span>
         <span className={`truncate ${variant === 'creative' ? 'font-normal text-white/90' : 'font-mono text-xs opacity-70'}`}>{text}</span>
      </div>
      {copied ? <span className="text-emerald-500 font-bold text-xs">DISALIN</span> : <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-white/10 px-1.5 py-0.5 rounded">SALIN</span>}
    </button>
  );
};

const SceneItem: React.FC<{ scene: Scene; index: number; options: GenerationOptions }> = ({ scene, index, options }) => {
    const showTextCopy = scene.textOverlay && options.textOverlayMode === 'manual';
    const showVOCopy = scene.narration && options.narrationMode === 'manual';
    const hasCreativeContent = showTextCopy || showVOCopy;

    return (
        <div className="relative pl-8 pb-10 last:pb-0 border-l border-white/10 ml-3 animate-fade-in group/scene">
            {/* Timeline dot */}
            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-600 group-hover/scene:bg-indigo-500 group-hover/scene:border-indigo-400 group-hover/scene:shadow-[0_0_10px_rgba(99,102,241,0.8)] transition-all duration-300"></div>
            
            <div className="flex flex-col gap-2 mb-5">
                <div className="flex items-center gap-3">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Scene {index + 1}</span>
                     <h4 className="text-sm font-bold text-white tracking-wide">
                    {scene.title}
                    </h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5 italic">
                    "{scene.description}"
                </p>
            </div>

            <div className="space-y-3">
                {/* Creative Content Section */}
                {hasCreativeContent && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {showTextCopy && (
                            <CopyButton 
                                variant="creative"
                                label="Teks Overlay" 
                                text={scene.textOverlay} 
                                iconPath="M12 2.25a.75.75 0 0 1 .75.75v2.25H18a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-2.25v.75a6 6 0 0 1-6 6v2.25H12a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5h2.25V18a6 6 0 0 1-6-6v-.75H3a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 .75-.75h5.25V3a.75.75 0 0 1 .75-.75h3ZM6.75 8.25H4.5v3h2.25v-3Zm12.75 0H17.25v3h2.25v-3Z"
                            />
                        )}
                        {showVOCopy && (
                            <CopyButton 
                                variant="creative"
                                label="Naskah Voiceover" 
                                text={scene.narration} 
                                iconPath="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5ZM12 4.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
                            />
                        )}
                    </div>
                )}

                {/* Technical Prompts Section */}
                <div className="grid grid-cols-1 gap-2 pt-2">
                    <CopyButton 
                        label="Prompt Generasi Gambar" 
                        text={scene.imageEditPrompt} 
                        iconPath="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                    <CopyButton 
                        label="Prompt Generasi Video" 
                        text={scene.videoGenPrompt} 
                        iconPath="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z"
                    />
                </div>
            </div>
        </div>
    )
}

const ConceptCard: React.FC<ConceptCardProps> = ({ concept, index, defaultOpen = false, options, onRegenerate, isRegenerating }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Dynamic gradients for glassmorphism
  const cardStyles = [
    'from-fuchsia-500/10 to-indigo-600/10 hover:border-fuchsia-500/30',
    'from-cyan-500/10 to-blue-600/10 hover:border-cyan-500/30',
    'from-amber-500/10 to-orange-600/10 hover:border-amber-500/30'
  ];

  const currentStyle = cardStyles[index % cardStyles.length];

  return (
    <div 
      className={`relative rounded-3xl border border-white/10 bg-gradient-to-br ${currentStyle} backdrop-blur-xl transition-all duration-500 overflow-hidden group hover:shadow-2xl hover:-translate-y-1 ${isRegenerating ? 'opacity-80' : ''}`}
    >
      {/* Clickable Header */}
      <div 
        onClick={() => !isRegenerating && setIsOpen(!isOpen)}
        className="p-6 cursor-pointer flex flex-col gap-4 select-none relative z-10"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/5 text-white font-display font-bold text-lg border border-white/10 shadow-inner shrink-0 group-hover:scale-110 transition-transform">
              {index + 1}
            </div>
            <div>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Konsep {index + 1}</span>
                <h3 className="text-xl font-display font-bold text-white leading-tight">
                {isRegenerating ? "MIUXBOT sedang berpikir..." : concept.title}
                </h3>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Regenerate Single Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isRegenerating) onRegenerate();
                }}
                disabled={isRegenerating}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/20 hover:text-white transition-all duration-300 group/btn"
                title="Buat ulang konsep ini"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className={`w-5 h-5 ${isRegenerating ? 'animate-spin' : 'group-hover/btn:rotate-180 transition-transform duration-500'}`}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>

            {/* Expand/Collapse Button */}
            <button 
                className={`p-2.5 rounded-full bg-white/5 border border-white/10 text-white/50 transition-transform duration-300 group-hover:bg-white/10 group-hover:text-white ${isOpen ? 'rotate-180 bg-white/10' : ''}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
          </div>
        </div>

        <p className={`text-slate-300 text-sm leading-relaxed border-l-2 border-white/10 pl-4 ml-1 ${isOpen ? 'opacity-100' : 'line-clamp-2 opacity-70'}`}>
          {concept.strategy}
        </p>
      </div>

      {/* Collapsible Content */}
      {isOpen && !isRegenerating && (
        <div className="px-6 pb-8 pt-4 border-t border-white/5 bg-black/10 animate-fade-in">
          <div className="space-y-1">
              {concept.scenes.map((scene, idx) => (
                  <SceneItem key={idx} scene={scene} index={idx} options={options} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConceptCard;