
import React, { useState } from 'react';
import { researchTopic } from '../services/geminiService';

const WebResearch: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [report, setReport] = useState<string | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResearch = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic to research.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setReport(null);
    setSources([]);

    try {
      const result = await researchTopic(topic);
      setReport(result.text);
      setSources(result.sources);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during research.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatReport = (text: string) => {
    return text.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('##')) {
        return <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-sky-300">{paragraph.replace(/##/g, '')}</h3>;
      }
      if (paragraph.startsWith('#')) {
        return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-sky-200">{paragraph.replace(/#/g, '')}</h2>;
      }
      if (paragraph.startsWith('* ')) {
        return <li key={index} className="ml-5 list-disc">{paragraph.substring(2)}</li>
      }
      return <p key={index} className="mb-4 text-slate-300">{paragraph}</p>;
    });
  };

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-slate-100">🔍 Web Research</h2>
        <p className="text-slate-400">Get comprehensive, AI-powered summaries and reports on any topic, backed by web search.</p>
      </header>

      <div className="space-y-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The future of renewable energy"
            className="flex-grow bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isLoading}
            onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
          />
          <button
            onClick={handleResearch}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Start Research'
            )}
          </button>
        </div>

        {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg text-sm">{error}</div>}

        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 min-h-[400px]">
          {isLoading && <div className="text-center text-slate-400">Researching topic...</div>}
          {report && !isLoading && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-slate-100">Research Report: {topic}</h2>
              <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-li:text-slate-300">
                {formatReport(report)}
              </div>
              {sources.length > 0 && (
                <div className="mt-8 border-t border-slate-700 pt-4">
                  <h4 className="font-semibold text-lg text-slate-200 mb-2">Sources:</h4>
                  <ul className="space-y-1">
                    {sources.map((source, index) => (
                      <li key={index} className="text-sm">
                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                          {source.title || source.uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {!report && !isLoading && <div className="text-center text-slate-500">Your research report will appear here.</div>}
        </div>
      </div>
    </div>
  );
};

export default WebResearch;
