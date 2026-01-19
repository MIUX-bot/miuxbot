import React from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#0f0f12] border border-white/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col ring-1 ring-white/5">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-xl">
          <div>
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <span className="text-indigo-500">⚡</span> Selamat Datang di MIUXBOT
            </h2>
            <p className="text-slate-400 text-sm mt-1 font-light">AI Creative Director untuk Konten Viral</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors border border-transparent hover:border-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-10 text-slate-300 leading-relaxed bg-gradient-to-b from-transparent to-black/20">
          
          {/* Section 1: Fungsi */}
          <section className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-transparent opacity-50 rounded-full"></div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              Apa itu MIUXBOT?
            </h3>
            <p className="text-sm text-slate-400">
              MIUXBOT adalah asisten AI futuristik yang menganalisa produk fisik dan merancang <strong>Storyline Video Iklan (UGC)</strong> lengkap. Bot ini tidak mengedit video, tapi memberikan <strong>"Prompt Engineering"</strong> tingkat lanjut yang bisa Anda salin dan tempel ke tools AI Generative lainnya.
            </p>
          </section>

          {/* Section 2: Workflow */}
          <section className="grid md:grid-cols-3 gap-4">
             <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                <div className="text-2xl mb-2">📸</div>
                <h4 className="font-bold text-white text-sm mb-1">1. Upload</h4>
                <p className="text-xs text-slate-400">Upload foto produk. MIUXBOT akan memindai visualnya.</p>
             </div>
             <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                <div className="text-2xl mb-2">🧠</div>
                <h4 className="font-bold text-white text-sm mb-1">2. Strategi</h4>
                <p className="text-xs text-slate-400">Bot membuat 3 konsep marketing unik dengan scene detail.</p>
             </div>
             <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                <div className="text-2xl mb-2">🚀</div>
                <h4 className="font-bold text-white text-sm mb-1">3. Eksekusi</h4>
                <p className="text-xs text-slate-400">Salin prompt yang dihasilkan ke tool AI pilihan Anda.</p>
             </div>
          </section>

          {/* Section 3: Cara Eksekusi (The Core Guide) */}
          <section className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">Panduan Teknis Prompt</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
                {/* Image Gen Guide */}
                <div className="space-y-3 group">
                  <h4 className="font-bold text-indigo-400 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Image Gen
                  </h4>
                  <div className="text-xs space-y-2 text-slate-400 bg-white/5 p-4 rounded-lg border border-white/5 group-hover:border-indigo-500/20 transition-colors">
                    <p className="font-semibold text-slate-200">Tools: Gemini (Nano), Midjourney, Photoshop.</p>
                    <ol className="list-decimal list-inside space-y-1 ml-1 text-slate-500">
                      <li>Masukkan foto produk asli.</li>
                      <li>Masking area background.</li>
                      <li>Tempel <strong>Prompt Generasi Gambar</strong> dari MIUXBOT.</li>
                    </ol>
                  </div>
                </div>

                {/* Video Gen Guide */}
                <div className="space-y-3 group">
                  <h4 className="font-bold text-pink-400 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span> Video Gen
                  </h4>
                  <div className="text-xs space-y-2 text-slate-400 bg-white/5 p-4 rounded-lg border border-white/5 group-hover:border-pink-500/20 transition-colors">
                    <p className="font-semibold text-slate-200">Tools: Runway Gen-3, Kling AI, Luma.</p>
                    <ol className="list-decimal list-inside space-y-1 ml-1 text-slate-500">
                      <li>Gunakan hasil gambar dari tahap 1.</li>
                      <li>Tempel <strong>Prompt Generasi Video</strong>.</li>
                      <li>Generate motion!</li>
                    </ol>
                  </div>
                </div>
            </div>
          </section>

           {/* Creator Info */}
           <section className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 mt-6">
              <h3 className="text-lg font-bold text-white mb-2">Tentang Pembuat</h3>
              <p className="text-sm text-slate-400 mb-4">
                  Aplikasi ini dikembangkan oleh <span className="text-indigo-400 font-bold">MUIN</span>. Silakan hubungi untuk kerjasama atau pertanyaan.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-mono">
                  <a href="https://wa.me/6282263018457" target="_blank" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      WhatsApp: +62 822 6301 8457
                  </a>
                   <a href="https://tiktok.com/@langir.id" target="_blank" className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      TikTok: @langir.id
                  </a>
                  <a href="mailto:cepmuin9@gmail.com" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Email: cepmuin9@gmail.com
                  </a>
              </div>
           </section>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/5 bg-white/5 backdrop-blur-xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-1 text-sm"
          >
            Mulai Berkarya
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;