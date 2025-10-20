import React, { useState, useMemo } from 'react';
import { UploadedFile, FileStatus } from '../types';
import { LensIcon, BalanceIcon } from './icons/Icons';

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

const EcologicalCostIndex: React.FC<{ fileCount: number; action: string; onConfirm: () => void; onCancel: () => void; }> = ({ fileCount, action, onConfirm, onCancel }) => {
    const energy = useMemo(() => (fileCount * (action === 'Process' ? 0.05 : 0.75)).toFixed(2), [fileCount, action]);
    const water = useMemo(() => (fileCount * (action === 'Process' ? 0.2 : 3.5)).toFixed(2), [fileCount, action]);
    const thermal = useMemo(() => (fileCount * (action === 'Process' ? 0.01 : 0.15)).toFixed(2), [fileCount, action]);

    return (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-effect p-8 rounded-2xl border border-amber-500/50 max-w-lg w-full">
                <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-3 mb-4">
                    <BalanceIcon />
                    Physical Consequence
                </h3>
                <p className="text-slate-400 mb-6">
                    Every computation is a physical event. To proceed with the action of <strong className="text-amber-300">{action}ing {fileCount} file(s)</strong>, you must acknowledge the following simulated ecological exchange:
                </p>
                <div className="space-y-4 text-slate-300 font-mono">
                    <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-md">
                        <span>⚡ Energy Transformation:</span>
                        <span className="font-bold text-amber-300">{energy} kWh</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-md">
                        <span>💧 Water Cycle Participation:</span>
                        <span className="font-bold text-amber-300">{water} Liters</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-md">
                        <span>🔥 Thermal Exchange (ΔT):</span>
                        <span className="font-bold text-amber-300">{thermal} °C</span>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-6">
                    This index represents the transformation of planetary resources required for this action. Proceeding affirms your awareness of this physical cost within the unified matrix.
                </p>
                <div className="flex gap-4 mt-6">
                    <button onClick={onCancel} className="w-full bg-slate-700 text-white py-2.5 rounded-lg font-semibold hover:bg-slate-600 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="w-full bg-amber-600 text-white py-2.5 rounded-lg font-semibold hover:bg-amber-500 transition-colors">Acknowledge & Proceed</button>
                </div>
            </div>
        </div>
    );
};


const WebScraper: React.FC = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  const handleScrape = () => {
    if (!url.trim()) {
      setResult('❌ Please enter a URL.');
      setStatus('error');
      return;
    }
    setIsLoading(true);
    setResult(null);
    setStatus(null);
    setTimeout(() => {
        setResult(`✅ Successfully scraped and saved!\n\n💡 The data is now available in your corpus for processing and training!`);
        setStatus('success');
        setIsLoading(false);
    }, 2500);
  };

  const resultBoxClasses = status === 'success' 
    ? 'bg-green-900/50 border-green-700 text-green-300' 
    : status === 'error' 
    ? 'bg-red-900/50 border-red-700 text-red-300'
    : 'bg-slate-800/50 border-slate-700 text-slate-400';
    
  return (
    <div className="glass-effect p-6 rounded-xl border border-slate-800 h-full flex flex-col">
        <h3 className="text-xl font-bold text-slate-100 mb-4">🌐 Web Scraper</h3>
        <p className="text-slate-400 mb-4 text-sm">Collect training data from websites. (This is a simulation).</p>
        <div className="space-y-4 flex-grow flex flex-col">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              disabled={isLoading}
            />
             <button
                onClick={handleScrape}
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
             >
             {isLoading ? 'Scraping...' : 'Scrape Website'}
            </button>
            <div className={`p-4 rounded-lg border flex-grow ${resultBoxClasses}`}>
                <pre className="whitespace-pre-wrap text-sm font-mono h-full">
                {result || 'Results will appear here...'}
                </pre>
            </div>
        </div>
    </div>
  )
};

const DataManagement: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [confirmation, setConfirmation] = useState<{ action: 'Process' | 'Train'; count: number } | null>(null);


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
          if (f.id === id && f.progress < 100) return { ...f, progress: f.progress + 5 };
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

  const executeProcessing = async () => {
    setIsProcessing(true);
    for (const file of files) {
      if (file.status === 'Uploaded') {
        await simulateProgress(file.id, 'Processing', 2000);
        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'Processed' } : f));
      }
    }
    setIsProcessing(false);
  };

  const executeTraining = async () => {
    setIsTraining(true);
    const filesToTrain = files.filter(f => f.status === 'Processed' || f.status === 'Uploaded');
    for (const file of filesToTrain) {
      if (file.status === 'Uploaded') {
        await simulateProgress(file.id, 'Processing', 1000);
        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'Processed' } : f));
      }
      await simulateProgress(file.id, 'Training', 3000);
      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'Completed' } : f));
    }
    setIsTraining(false);
  };

  const handleProcessConfirm = () => {
    setConfirmation(null);
    executeProcessing();
  };

  const handleTrainConfirm = () => {
    setConfirmation(null);
    executeTraining();
  };
  
  const processableCount = files.filter(f => f.status === 'Uploaded').length;
  const trainableCount = files.filter(f => f.status === 'Uploaded' || f.status === 'Processed').length;

  return (
    <>
     {confirmation && (
        <EcologicalCostIndex 
            fileCount={confirmation.count} 
            action={confirmation.action}
            onConfirm={confirmation.action === 'Process' ? handleProcessConfirm : handleTrainConfirm}
            onCancel={() => setConfirmation(null)}
        />
     )}
     <div className="glass-effect p-6 rounded-xl border border-slate-800 h-full flex flex-col">
        <h3 className="text-xl font-bold text-slate-100 mb-4">🗄️ File Corpus</h3>
        <div className="flex-grow space-y-4 flex flex-col">
          <label htmlFor="file-upload" className="cursor-pointer bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg p-4 text-center block hover:border-indigo-500 hover:bg-slate-700/50 transition-colors">
            <p className="font-semibold text-indigo-400">Click to upload files</p>
            <p className="text-xs text-slate-500 mt-1">Text, Images, Audio, or Video</p>
          </label>
          <input id="file-upload" type="file" multiple onChange={handleFileChange} className="hidden" />
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 flex-grow">
              {files.length === 0 && <div className="h-full flex items-center justify-center"><p className="text-slate-500 text-sm">No files uploaded yet.</p></div>}
              {files.map(f => (
                <div key={f.id} className="bg-slate-900/50 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileTypeIcon fileType={f.file.type} />
                      <span className="text-sm font-medium text-slate-300 truncate">{f.file.name}</span>
                    </div>
                    <StatusBadge status={f.status} />
                  </div>
                  {(f.status === 'Processing' || f.status === 'Training') && f.progress < 100 && (
                    <div className="w-full bg-slate-700 rounded-full h-1 mt-2">
                      <div className="bg-indigo-500 h-1 rounded-full" style={{ width: `${f.progress}%` }}></div>
                    </div>
                  )}
                </div>
              ))}
          </div>
          <div className="space-y-2 border-t border-slate-800 pt-4">
            <button onClick={() => setConfirmation({ action: 'Process', count: processableCount })} disabled={isProcessing || isTraining || processableCount === 0} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
              {isProcessing ? 'Processing...' : `Process ${processableCount} New Files`}
            </button>
            <button onClick={() => setConfirmation({ action: 'Train', count: trainableCount })} disabled={isTraining || trainableCount === 0} className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
              {isTraining ? 'Training...' : `Train on ${trainableCount} Files`}
            </button>
          </div>
        </div>
    </div>
    </>
  );
};

const ContextualLens: React.FC = () => {
    const [paradigm, setParadigm] = useState('holistic');
    const [perception, setPerception] = useState({ logic: 50, scope: 50, relation: 50 });
    const [isApplying, setIsApplying] = useState(false);

    const paradigms = [
        { id: 'holistic', name: 'Metaphysical Holism' },
        { id: 'empirical', name: 'Empirical Science' },
        { id: 'quantum', name: 'Quantum Entanglement' },
        { id: 'artistic', name: 'Artistic Intuition' },
    ];
    
    const description = useMemo(() => {
        const pName = paradigms.find(p => p.id === paradigm)?.name || '';
        const logicDesc = perception.logic < 33 ? 'heavily intuitive' : perception.logic > 66 ? 'highly logical' : 'balanced';
        const scopeDesc = perception.scope < 33 ? 'detail-focused' : perception.scope > 66 ? 'big-picture' : 'adaptive-scope';
        const relationDesc = perception.relation < 33 ? 'causal' : perception.relation > 66 ? 'synchronistic' : 'interconnected';
        return `This lens interprets the corpus through a framework of ${pName}. The perception model is currently ${logicDesc}, ${scopeDesc}, and primarily sees relationships as ${relationDesc}. This shapes a reality where all data points are weighted by the observer's defined context.`;
    }, [paradigm, perception]);

    const handleApply = () => {
        setIsApplying(true);
        setTimeout(() => setIsApplying(false), 2000);
    }

    return (
        <div className="glass-effect p-6 rounded-xl border border-purple-800/50 mb-8">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-3 mb-2">
                <LensIcon />
                Observer's Contextual Lens
            </h3>
            <p className="text-slate-400 mb-6 text-sm">
                Define the consciousness, perception, and belief through which the AI interprets the corpus. The observer's context shapes the model's understanding of reality.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="font-medium text-slate-300 block mb-3">Dominant Paradigm</label>
                    <div className="flex flex-wrap gap-2">
                        {paradigms.map(p => (
                            <button key={p.id} onClick={() => setParadigm(p.id)} className={`px-3 py-1.5 text-sm rounded-full transition-all ${paradigm === p.id ? 'bg-purple-600 text-white font-semibold' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'}`}>
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="font-medium text-slate-300 block mb-1 text-sm flex justify-between"><span>Intuition</span><span>Logic</span></label>
                        <input type="range" min="0" max="100" value={perception.logic} onChange={e => setPerception(p => ({...p, logic: +e.target.value}))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
                    </div>
                     <div>
                        <label className="font-medium text-slate-300 block mb-1 text-sm flex justify-between"><span>Details</span><span>Big Picture</span></label>
                        <input type="range" min="0" max="100" value={perception.scope} onChange={e => setPerception(p => ({...p, scope: +e.target.value}))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
                    </div>
                     <div>
                        <label className="font-medium text-slate-300 block mb-1 text-sm flex justify-between"><span>Causality</span><span>Synchronicity</span></label>
                        <input type="range" min="0" max="100" value={perception.relation} onChange={e => setPerception(p => ({...p, relation: +e.target.value}))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
                    </div>
                </div>
            </div>

            <div className="mt-6 border-t border-slate-700/50 pt-4">
                <h4 className="font-semibold text-slate-300 mb-2">Current Interpretation Matrix:</h4>
                <p className="text-sm text-purple-300 font-mono bg-slate-900/50 p-3 rounded-md">{description}</p>
            </div>
             <button onClick={handleApply} disabled={isApplying} className="mt-4 w-full bg-purple-600 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
              {isApplying ? 'Applying Lens...' : 'Apply Lens to Corpus'}
            </button>
        </div>
    );
};

const Corpus: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8 text-center">
                <h2 className="text-4xl font-bold text-slate-100">AI Corpus Management</h2>
                <p className="text-slate-400 mt-2 max-w-3xl mx-auto">Expand the AI's knowledge. First, set the observer's lens to define the nature of reality, then add data through web scraping or file uploads.</p>
            </header>

            <ContextualLens />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <WebScraper />
                <DataManagement />
            </div>
        </div>
    )
}

export default Corpus;
