
import React, { useState, useCallback } from 'react';
import { UploadedFile, FileStatus } from '../types';

const FileTypeIcon = ({ fileType }: { fileType: string }) => {
  if (fileType.startsWith('image/')) return <span className="text-purple-400">🖼️</span>;
  if (fileType.startsWith('audio/')) return <span className="text-sky-400">🎵</span>;
  if (fileType.startsWith('video/')) return <span className="text-rose-400">🎬</span>;
  if (fileType.startsWith('text/')) return <span className="text-emerald-400">📄</span>;
  return <span className="text-slate-400">📁</span>;
};

const StatusBadge = ({ status }: { status: FileStatus }) => {
  const baseClasses = 'px-2 py-0.5 text-xs font-medium rounded-full';
  const statusClasses: Record<FileStatus, string> = {
    'Uploaded': 'bg-slate-700 text-slate-300',
    'Processing': 'bg-blue-800 text-blue-300 animate-pulse',
    'Processed': 'bg-green-800 text-green-300',
    'Training': 'bg-purple-800 text-purple-300 animate-pulse',
    'Completed': 'bg-emerald-800 text-emerald-200',
    'Error': 'bg-red-800 text-red-300',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const DataManagement: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: `${file.name}-${file.lastModified}`,
        file,
        status: 'Uploaded' as FileStatus,
        progress: 0,
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const simulateProgress = (id: string, newStatus: FileStatus, duration: number) => {
    return new Promise<void>(resolve => {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: newStatus, progress: 0 } : f));
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === id && f.progress < 100) {
            return { ...f, progress: f.progress + 5 };
          }
          return f;
        }));
      }, duration / 20);

      setTimeout(() => {
        clearInterval(interval);
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: 100 } : f));
        resolve();
      }, duration);
    });
  };

  const handleProcessData = async () => {
    setIsProcessing(true);
    for (const file of files) {
      if (file.status === 'Uploaded') {
        await simulateProgress(file.id, 'Processing', 2000);
        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'Processed' } : f));
      }
    }
    setIsProcessing(false);
  };

  const handleTrain = async () => {
    setIsTraining(true);
    const filesToTrain = files.filter(f => f.status === 'Processed');
    for (const file of filesToTrain) {
      await simulateProgress(file.id, 'Training', 5000);
      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'Completed' } : f));
    }
    setIsTraining(false);
  };
  
  const processedCount = files.filter(f => f.status === 'Processed' || f.status === 'Completed').length;

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-slate-100">📁 Data Management</h2>
        <p className="text-slate-400">Upload your data, process it for training, and fine-tune your personal AI model.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h3 className="font-semibold mb-2">Uploaded Files</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {files.length === 0 && <p className="text-slate-500 text-sm">No files uploaded yet.</p>}
              {files.map(f => (
                <div key={f.id} className="bg-slate-800 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileTypeIcon fileType={f.file.type} />
                      <span className="text-sm font-medium text-slate-300 truncate w-40">{f.file.name}</span>
                    </div>
                    <StatusBadge status={f.status} />
                  </div>
                  {(f.status === 'Processing' || f.status === 'Training') && f.progress < 100 && (
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${f.progress}%` }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <label htmlFor="file-upload" className="cursor-pointer bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg p-6 text-center block hover:border-blue-500 hover:bg-slate-700/50 transition-colors">
            <p className="font-semibold text-blue-400">Click to upload files</p>
            <p className="text-xs text-slate-500 mt-1">Text, Images, Audio, or Video</p>
          </label>
          <input id="file-upload" type="file" multiple onChange={handleFileChange} className="hidden" />

          <div className="space-y-2">
            <button onClick={handleProcessData} disabled={isProcessing || isTraining || files.filter(f => f.status === 'Uploaded').length === 0} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
              {isProcessing ? 'Processing...' : 'Process Data'}
            </button>
            <button onClick={handleTrain} disabled={isProcessing || isTraining || !processedCount} className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
              {isTraining ? 'Training...' : `Start Training (${processedCount} files)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
