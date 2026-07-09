import React, { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (selectedFile) => {
    const validExtensions = ['.py', '.js'];
    const fileExt = selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExt)) {
      setStatus('error');
      setMessage('Unsupported file type. Please upload .py or .js');
      setFile(null);
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setStatus('error');
      setMessage('File exceeds 5MB limit.');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setStatus('idle');
    setMessage('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;
    setStatus('uploading');
    setMessage('Processing file through AI Engine...');
    setTimeout(() => {
      setStatus('success');
      setMessage('Analysis complete. 3 issues found.');
    }, 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-10 animate-[slide-up_0.4s_ease-out]">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Upload Code</h1>
        <p className="text-[15px] text-white/60">Run static analysis on your Python or JavaScript files.</p>
      </div>

      <div className="apple-glass p-8 relative overflow-hidden animate-[slide-up_0.5s_ease-out_0.1s_both]">
        
        {/* Animated blurred blob behind the dropzone */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0A84FF] rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>

        {status === 'error' && (
          <div className="mb-6 p-4 rounded-[16px] bg-[#FF375F]/10 border border-[#FF375F]/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#FF375F]" />
            <p className="text-[15px] font-medium text-[#FF375F]">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="mb-6 p-4 rounded-[16px] bg-[#32D74B]/10 border border-[#32D74B]/20 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#32D74B]" />
            <p className="text-[15px] font-medium text-[#32D74B]">{message}</p>
          </div>
        )}

        <div
          className={`relative z-10 border-2 border-dashed rounded-[24px] p-12 text-center transition-all duration-300 ${
            dragActive ? 'border-[#0A84FF] bg-[#0A84FF]/10 scale-[1.02]' : 'border-white/20 bg-white/5 hover:bg-white/10'
          }`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        >
          {!file ? (
            <div className="flex flex-col items-center">
              <UploadCloud className={`w-14 h-14 mb-4 ${dragActive ? 'text-[#0A84FF]' : 'text-white/40'} transition-colors`} />
              <h3 className="text-[19px] font-semibold text-white mb-2">Select a file or drag and drop here</h3>
              <p className="text-[14px] text-white/50 mb-8">Python (.py) or JavaScript (.js) up to 5MB</p>
              <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => processFile(e.target.files[0])} accept=".py,.js" />
              <button onClick={() => fileInputRef.current?.click()} className="apple-btn-glass">
                Browse Files
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-[20px] bg-white/10 border border-white/20 flex items-center justify-center mb-4 relative shadow-lg">
                <File className="w-10 h-10 text-white" />
                {status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/40 rounded-[20px] backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <p className="text-[17px] font-semibold text-white">{file.name}</p>
              <p className="text-[14px] text-white/50 mt-1">{(file.size / 1024).toFixed(1)} KB</p>

              {status === 'uploading' ? (
                <div className="mt-8 w-full max-w-xs">
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full w-full animate-[slide-in-left_2s_ease-out]" />
                  </div>
                  <p className="text-[14px] text-white/60 mt-4 animate-pulse">{message}</p>
                </div>
              ) : (
                <div className="mt-10 flex gap-4">
                  <button onClick={() => { setFile(null); setStatus('idle'); }} className="apple-btn-glass">Cancel</button>
                  <button onClick={handleUpload} className="apple-btn-primary">Start Analysis</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
