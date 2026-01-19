import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ConceptCard from './components/ConceptCard';
import PromptOptions from './components/PromptOptions';
import WelcomeModal from './components/WelcomeModal';
import { UploadedImage, AnalysisResponse, GenerationOptions } from './types';
import { generateUGCPrompts, regenerateSingleConcept } from './services/geminiService';

const App: React.FC = () => {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true); 
  
  const [options, setOptions] = useState<GenerationOptions>({
    textOverlayMode: 'manual',
    narrationMode: 'manual',
    sceneCount: 3
  });

  const handleImageSelected = async (uploadedImage: UploadedImage) => {
    setImage(uploadedImage);
    setAnalysis(null);
    setError(null);
    setIsLoading(true);

    try {
      const result = await generateUGCPrompts(uploadedImage.base64, uploadedImage.mimeType, options);
      setAnalysis(result);
    } catch (err) {
      setError("Gagal menganalisa gambar. Pastikan API Key valid atau coba gambar lain.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateAll = async () => {
    if (!image) return;
    setAnalysis(null);
    setError(null);
    setIsLoading(true);
    
    try {
        const result = await generateUGCPrompts(image.base64, image.mimeType, options);
        setAnalysis(result);
    } catch (err) {
        setError("Gagal membuat ulang konsep. Silakan coba lagi.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleRegenerateSingle = async (index: number) => {
    if (!image || !analysis) return;
    setRegeneratingIndex(index);
    
    try {
        const newConcept = await regenerateSingleConcept(image.base64, image.mimeType, options);
        const updatedConcepts = [...analysis.concepts];
        updatedConcepts[index] = newConcept;
        setAnalysis({ ...analysis, concepts: updatedConcepts });
    } catch (err) {
        console.error("Failed to regenerate single concept", err);
    } finally {
        setRegeneratingIndex(null);
    }
  };

  const resetApp = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative text-slate-100 font-sans overflow-hidden selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 w-full h-full bg-[#050505] -z-20"></div>
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />

      {/* Header */}
      <header className="fixed top-4 left-0 right-0 z-40 px-4 md:px-6">
        <div className="max-w-5xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-indigo-500 blur-md opacity-50"></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white relative z-10">
                  <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436-3.702 2.88-9.01 4.314-14.916 4.314a.75.75 0 0 1-.75-.75V6.75a.75.75 0 0 1 .75-.75h14.25v2.25H2.27c2.194-2.84 5.06-5.04 8.045-6.666ZM9 12.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                </svg>
            </div>
            <div>
                <h1 className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1">
                  MIUX<span className="text-indigo-400">BOT</span>
                </h1>
            </div>
          </div>
          
          <button 
            onClick={() => setShowWelcome(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all duration-300 text-xs font-medium group backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:animate-ping"></span>
            Panduan
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-32 pb-10 flex-grow w-full">
        {!image && (
             <div className="text-center mb-16 space-y-6 animate-fade-in relative z-10">
                <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-widest uppercase mb-2">
                   AI Creative Studio V2.0
                </div>
                <h2 className="font-display text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 leading-tight tracking-tight drop-shadow-sm">
                    Buka Potensi Viral
                </h2>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                    Upload produk Anda. Biarkan <span className="text-indigo-400 font-semibold">MIUXBOT</span> merancang strategi video, naskah, dan visual prompt dalam hitungan detik.
                </p>
            </div>
        )}

        {/* Upload Section */}
        <div className="max-w-xl mx-auto mb-16 relative z-10">
          {!image ? (
            <div className="animate-fade-in space-y-8">
              <PromptOptions options={options} onChange={setOptions} disabled={isLoading} />
              <div className="relative">
                 <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                 <FileUpload onImageSelected={handleImageSelected} isLoading={isLoading} />
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden shadow-2xl animate-fade-in group">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full group-hover:opacity-30 transition-opacity"></div>
                <img 
                  src={image.previewUrl} 
                  alt="Product Preview" 
                  className="w-48 h-48 object-cover rounded-2xl border border-white/10 shadow-2xl relative z-10 rotate-1 hover:rotate-0 transition-transform duration-500"
                />
                <button 
                  onClick={resetApp}
                  className="absolute -top-3 -right-3 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md shadow-lg z-20 transition-all hover:scale-110"
                  title="Reset / Ganti Foto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 space-y-5 text-center md:text-left w-full relative z-10">
                 <div>
                    <h3 className="font-display font-bold text-white text-2xl tracking-tight flex items-center gap-2 justify-center md:justify-start">
                       {isLoading ? (
                           <>
                            <span className="animate-pulse w-3 h-3 bg-indigo-500 rounded-full"></span>
                            Menganalisa Produk...
                           </>
                       ) : (
                           <>
                            <span className="text-emerald-400">Analisa Selesai</span>
                           </>
                       )}
                    </h3>
                    <p className="text-sm text-slate-400 mt-2">MIUXBOT sedang membedah visual produk untuk menemukan angle marketing terbaik.</p>
                 </div>
                 
                 {isLoading && (
                   <div className="space-y-4 pt-2">
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-progress origin-left shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-indigo-300 font-mono tracking-widest uppercase opacity-70">
                        <span>Memindai_Fitur</span>
                        <span>Memproses_Neural</span>
                      </div>
                   </div>
                 )}

                 {!isLoading && analysis && (
                   <div className="flex flex-col gap-3">
                       <button 
                        onClick={resetApp}
                        className="text-xs text-indigo-300 hover:text-white transition-colors flex items-center gap-1 self-center md:self-start group/back"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 group-hover/back:-translate-x-1 transition-transform">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                         </svg>
                         Upload Produk Lain
                       </button>
                   </div>
                 )}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-500/10 backdrop-blur border border-red-500/20 text-red-200 rounded-xl text-center text-sm animate-fade-in">
            {error}
          </div>
        )}

        {/* Results Grid */}
        {analysis && (
          <div className="space-y-10 animate-fade-in max-w-4xl mx-auto relative z-10">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM1.5 3a.75.75 0 0 1 .75.75v16.5a.75.75 0 0 1-1.5 0V3.75A.75.75 0 0 1 1.5 3Zm21 0a.75.75 0 0 1 .75.75v16.5a.75.75 0 0 1-1.5 0V3.75A.75.75 0 0 1 22.5 3Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-bold text-white">Konsep Terpilih</h2>
                        <p className="text-sm text-slate-400">Pilih strategi yang paling sesuai dengan brand Anda.</p>
                    </div>
                </div>
                
                <button
                    onClick={handleRegenerateAll}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-indigo-300 hover:text-white rounded-xl transition-all duration-300 border border-white/10 hover:border-indigo-500/50 text-xs font-bold uppercase tracking-wider backdrop-blur-md group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Buat Ulang Semua
                </button>
             </div>
             
            <div className="flex flex-col gap-6">
              {analysis.concepts.map((concept, idx) => (
                <ConceptCard 
                  key={idx} 
                  concept={concept} 
                  index={idx} 
                  defaultOpen={idx === 0}
                  options={options}
                  onRegenerate={() => handleRegenerateSingle(idx)}
                  isRegenerating={regeneratingIndex === idx}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Creator Footer */}
      <footer className="w-full relative z-20 mt-10">
          <div className="max-w-5xl mx-auto px-6 py-8 border-t border-white/5">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/5 hover:border-indigo-500/30 transition-colors">
                 
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        M
                    </div>
                    <div>
                        <h4 className="font-display font-bold text-white">Dibuat oleh MUIN</h4>
                        <p className="text-xs text-slate-400">Hubungi saya untuk kolaborasi atau custom AI.</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-3">
                     <a href="https://wa.me/6282263018457" target="_blank" rel="noopener noreferrer" className="group p-2.5 bg-slate-800 rounded-xl hover:bg-[#25D366] transition-all hover:scale-110 shadow-lg border border-slate-700 hover:border-[#25D366]/50">
                        <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.595-.195-1.611-.587-2.933-1.752-.697-.616-1.194-1.374-1.339-1.634-.145-.26-.014-.401.116-.531.117-.116.273-.298.409-.45.138-.152.183-.26.273-.43.09-.17.045-.316-.023-.45-.068-.135-.611-1.468-.837-2.013-.22-.533-.443-.46-.611-.469-.16-.008-.342-.01-.525-.01-.182 0-.479.068-.729.34-.25.275-.959.938-.959 2.29s.982 2.66 1.118 2.845c.137.184 1.932 2.949 4.679 4.135.654.282 1.164.452 1.565.579.664.21 1.267.18 1.745.109.529-.079 1.628-.665 1.857-1.307.229-.642.229-1.194.161-1.307-.069-.115-.251-.184-.527-.321z"/></svg>
                     </a>
                     
                     <a href="https://tiktok.com/@langir.id" target="_blank" rel="noopener noreferrer" className="group p-2.5 bg-slate-800 rounded-xl hover:bg-black hover:text-white transition-all hover:scale-110 shadow-lg border border-slate-700 hover:border-slate-500">
                        <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                     </a>

                     <a href="mailto:cepmuin9@gmail.com" className="group p-2.5 bg-slate-800 rounded-xl hover:bg-red-500 transition-all hover:scale-110 shadow-lg border border-slate-700 hover:border-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                        </svg>
                     </a>
                 </div>
             </div>
             <div className="text-center mt-6 mb-2">
                 <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">© {new Date().getFullYear()} MIUXBOT by MUIN. All Rights Reserved.</p>
             </div>
          </div>
      </footer>

      {/* Tailwind Animation Config */}
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;