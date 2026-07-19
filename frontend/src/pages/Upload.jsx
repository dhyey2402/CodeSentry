import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, FileCode2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { api } from '../api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success, error
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    if (!selectedFile.name.endsWith('.py')) {
      setError('Currently only Python (.py) files are supported.');
      setUploadState('error');
      return false;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      setUploadState('error');
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const runPipeline = async () => {
    if (!file) return;
    
    setUploadState('uploading');
    setProgress(10);
    setStatusText('Uploading file...');

    try {
      // 1. Upload
      const project = await api.uploadFile(file);
      setProgress(20);
      setStatusText('Running Static Analysis...');

      // 1.5 Pylint
      await api.analyzePylint(project.id);
      setProgress(40);
      setStatusText('Running Security Scan...');

      // 3. Security
      await api.analyzeSecurity(project.id);
      setProgress(50);
      setStatusText('Calculating Complexity Analysis...');

      // 4. Complexity
      await api.analyzeComplexity(project.id);
      setProgress(60);
      setStatusText('AI Understanding Code...');

      // Optimistic UI progress while AI runs
      const aiInterval = setInterval(() => {
        setProgress(p => {
          if (p < 75) return p + 1;
          if (p === 75) setStatusText('Generating Suggestions...');
          if (p < 90) return p + 1;
          if (p === 90) setStatusText('Writing Documentation...');
          if (p < 95) return p + 1;
          return p;
        });
      }, 800);

      // 2. AI Review
      const review = await api.analyzeAI(project.id);
      
      clearInterval(aiInterval);
      setProgress(100);
      setStatusText('Analysis Complete!');
      setUploadState('success');

      setTimeout(() => {
        navigate(`/reviews/${review.id}`);
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Analysis pipeline failed.');
      setUploadState('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Upload Codebase</h1>
        <p className="text-text-muted mt-2">
          Upload your Python file to start a comprehensive automated review.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {uploadState === 'idle' || uploadState === 'error' ? (
              <motion.div
                key="upload-box"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {error && (
                  <Alert variant="destructive">
                    <span className="font-medium">{error}</span>
                  </Alert>
                )}
                
                <div 
                  className={`relative border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all ${
                    isDragging 
                      ? 'border-accent bg-accent/5' 
                      : file 
                        ? 'border-success bg-success/5'
                        : 'border-border hover:border-text-muted bg-surface/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !file && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".py"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {file ? (
                    <div className="text-center">
                      <div className="h-16 w-16 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileCode2 className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-semibold">{file.name}</h3>
                      <p className="text-sm text-text-muted mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                      <div className="mt-6 flex gap-3 justify-center">
                        <Button variant="outline" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                          Change File
                        </Button>
                        <Button onClick={(e) => { e.stopPropagation(); runPipeline(); }}>
                          Start Analysis
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center pointer-events-none">
                      <div className="h-16 w-16 bg-surface border border-border text-text-muted rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <UploadIcon className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">Click or drag file to this area to upload</h3>
                      <p className="text-sm text-text-muted max-w-xs mx-auto">
                        Support for a single .py file up to 5MB. 
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-text-muted">Supported Languages:</span>
                  <Badge variant="outline" className="bg-surface">Python</Badge>
                  <Badge variant="outline" className="bg-surface opacity-50 cursor-not-allowed" title="Coming soon">JavaScript</Badge>
                  <Badge variant="outline" className="bg-surface opacity-50 cursor-not-allowed" title="Coming soon">TypeScript</Badge>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="progress-box"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-6"
              >
                {uploadState === 'success' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="h-20 w-20 bg-success/20 text-success rounded-full flex items-center justify-center mb-2"
                  >
                    <CheckCircle2 className="h-10 w-10" />
                  </motion.div>
                ) : (
                  <div className="relative h-20 w-20 mb-2">
                    <svg className="animate-spin h-full w-full text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">{uploadState === 'success' ? 'Analysis Complete!' : 'Analyzing your code...'}</h3>
                  <p className="text-text-muted mb-6">{statusText}</p>
                </div>

                <div className="w-full max-w-md space-y-2">
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <ProgressBar value={progress} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
