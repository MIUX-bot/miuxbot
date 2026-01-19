import React, { useRef, useState } from 'react';
import { UploadedImage } from '../types';

interface FileUploadProps {
  onImageSelected: (image: UploadedImage) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onImageSelected, isLoading }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Mohon upload file gambar.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      
      onImageSelected({
        base64,
        mimeType: file.type,
        previewUrl: result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`relative rounded-3xl p-10 text-center transition-all duration-500 cursor-pointer group overflow-hidden backdrop-blur-md bg-white/5
        ${isDragging 
          ? 'border-2 border-indigo-400 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.3)]' 
          : 'border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 shadow-xl'
        }
        ${isLoading ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-indigo-500/50 rounded-tl-xl transition-all group-hover:w-16 group-hover:h-16 group-hover:border-indigo-400"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-indigo-500/50 rounded-tr-xl transition-all group-hover:w-16 group-hover:h-16 group-hover:border-indigo-400"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-indigo-500/50 rounded-bl-xl transition-all group-hover:w-16 group-hover:h-16 group-hover:border-indigo-400"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-indigo-500/50 rounded-br-xl transition-all group-hover:w-16 group-hover:h-16 group-hover:border-indigo-400"></div>

      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        <div className={`p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 text-indigo-400 shadow-2xl group-hover:scale-110 group-hover:text-white group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-500`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
            Upload Foto Produk
          </h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            Geser file ke sini atau klik untuk menjelajah. Mendukung JPG & PNG.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;