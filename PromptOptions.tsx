import React, { useState } from 'react';
import { GenerationOptions, GenerationMode } from '../types';

interface PromptOptionsProps {
  options: GenerationOptions;
  onChange: (options: GenerationOptions) => void;
  disabled: boolean;
}

const PromptOptions: React.FC<PromptOptionsProps> = ({ options, onChange, disabled }) => {
  
  const InfoTooltip = ({ type }: { type: 'text' | 'vo' }) => {
    const [show, setShow] = useState(false);
    
    const explanations = {
      text: {
        title: "Tentang Opsi Teks Overlay",
        manual: "AI akan membuatkan teks pendek terpisah. Anda bisa copy teks ini lalu paste manual di aplikasi editing (CapCut/Premiere).",
        merged: "AI akan memasukkan instruksi teks langsung ke dalam Prompt Video. Gunakan ini jika AI Video Generator Anda (seperti Runway/Pika) sudah support generate text di dalam video.",
        none: "Tidak akan ada ide teks overlay yang dibuat."
      },
      vo: {
        title: "Tentang Opsi Narasi / VO",
        manual: "AI membuatkan naskah script terpisah. Anda bisa merekam suara sendiri atau menggunakan Text-to-Speech terpisah.",
        merged: "Instruksi audio/naskah dimasukkan ke Prompt Video. Gunakan ini untuk tools generasi video yang support audio generation sekaligus (misal: Sora/Kling).",
        none: "Tidak akan ada naskah narasi yang dibuat."
      }
    };

    const content = type === 'text' ? explanations.text : explanations.vo;

    return (
      <div className="relative inline-block ml-2">
        <button 
          onClick={(e) => { e.stopPropagation(); setShow(!show); }}
          className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 text-[10px] flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-colors border border-slate-600"
          title="Klik untuk info detail"
        >
          ?
        </button>
        {show && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShow(false)} 
            />
            <div className="absolute left-0 top-6 z-20 w-64 p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-xl text-xs text-slate-300 space-y-2 animate-fade-in">
              <h5 className="font-bold text-slate-100 border-b border-slate-700 pb-1 mb-1">{content.title}</h5>
              <p><span className="text-indigo-400 font-semibold">Manual:</span> {content.manual}</p>
              <p><span className="text-emerald-400 font-semibold">Gabung:</span> {content.merged}</p>
              <p><span className="text-slate-500 font-semibold">Tidak Ada:</span> {content.none}</p>
            </div>
          </>
        )}
      </div>
    );
  };

  const ModeSelector = ({ 
    label, 
    value, 
    onChangeMode, 
    colorClass,
    type
  }: { 
    label: string, 
    value: GenerationMode, 
    onChangeMode: (m: GenerationMode) => void,
    colorClass: string,
    type: 'text' | 'vo'
  }) => {
    return (
      <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800 relative h-full">
        <div className="flex items-center">
          <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{label}</span>
          <InfoTooltip type={type} />
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-auto">
          <button
            onClick={() => onChangeMode('none')}
            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200
              ${value === 'none' 
                ? 'bg-slate-700 text-white border-slate-600' 
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'
              }`}
          >
            Tidak Ada
          </button>

          <button
            onClick={() => onChangeMode('manual')}
            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200
              ${value === 'manual' 
                ? `${colorClass} bg-opacity-20 border-opacity-50 text-white shadow-sm` 
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'
              }`}
          >
            Manual (Copy)
          </button>

          <button
            onClick={() => onChangeMode('merged')}
            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200
              ${value === 'merged' 
                ? `${colorClass} bg-opacity-20 border-opacity-50 text-white shadow-sm` 
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'
              }`}
          >
            Gabung Prompt
          </button>
        </div>
        
        <div className="text-[10px] text-slate-500 min-h-[15px] mt-2">
          {value === 'none' && "Fitur ini tidak akan dibuat oleh AI."}
          {value === 'manual' && "AI membuatkan teks/script terpisah untuk Anda copy."}
          {value === 'merged' && "AI menggabungkan instruksi langsung ke dalam Prompt Video."}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-4 mb-8 transition-opacity duration-300 ${disabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ModeSelector 
          label="Teks Overlay" 
          value={options.textOverlayMode} 
          onChangeMode={(m) => onChange({ ...options, textOverlayMode: m })}
          colorClass="bg-indigo-500 border-indigo-500"
          type="text"
        />

        <ModeSelector 
          label="Narasi / VO" 
          value={options.narrationMode} 
          onChangeMode={(m) => onChange({ ...options, narrationMode: m })}
          colorClass="bg-emerald-500 border-emerald-500"
          type="vo"
        />
      </div>

      {/* Scene Count Slider */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
           <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Jumlah Scene</span>
           <span className="px-3 py-1 bg-indigo-500 text-white font-bold rounded-lg text-sm min-w-[3rem] text-center shadow-lg shadow-indigo-500/20 border border-indigo-400/50">
             {options.sceneCount}
           </span>
        </div>
        
        <div className="relative h-6 flex items-center">
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              value={options.sceneCount} 
              onChange={(e) => onChange({ ...options, sceneCount: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 px-1">
            <span>1 (Simple)</span>
            <span>3 (Standard)</span>
            <span>10 (Complex)</span>
        </div>
      </div>

    </div>
  );
};

export default PromptOptions;