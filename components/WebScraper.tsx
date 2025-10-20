
import React, { useState } from 'react';

const WebScraper: React.FC = () => {
  const [url, setUrl] = useState('');
  const [numPages, setNumPages] = useState(1);
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
      const isValidUrl = url.includes('.') && !url.includes(' ');
      if (!isValidUrl || url.includes('blocked-site.com')) {
        setResult('❌ Cannot access this URL. Please check the URL and try again.');
        setStatus('error');
      } else {
        const message = numPages === 1
          ? `✅ Successfully scraped and saved!\n\n💡 Go to 'Data Management' tab to process this for training!`
          : `✅ Scraped ${numPages}/${numPages} pages successfully!\n\n💡 Go to 'Data Management' tab to process this for training!`;
        setResult(message);
        setStatus('success');
      }
      setIsLoading(false);
    }, 2500);
  };

  const resultBoxClasses = status === 'success' 
    ? 'bg-green-900/50 border-green-700 text-green-300' 
    : status === 'error' 
    ? 'bg-red-900/50 border-red-700 text-red-300'
    : 'bg-slate-800/50 border-slate-700 text-slate-400';

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-slate-100">🌐 Web Scraper</h2>
        <p className="text-slate-400">Collect training data from websites. (This is a simulation)</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="url" className="font-medium text-slate-300 block mb-2">Website URL</label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="numPages" className="font-medium text-slate-300 block mb-2">Number of Pages: {numPages}</label>
            <input
              id="numPages"
              type="range"
              min="1"
              max="10"
              step="1"
              value={numPages}
              onChange={(e) => setNumPages(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleScrape}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scraping...
              </>
            ) : 'Scrape Website'}
          </button>
        </div>
        
        <div className="flex flex-col">
           <label className="font-medium text-slate-300 block mb-2">Scraping Results</label>
           <div className={`p-4 rounded-lg border flex-grow ${resultBoxClasses}`}>
            <pre className="whitespace-pre-wrap text-sm font-mono h-full">
              {result || 'Results will appear here...'}
            </pre>
           </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
        <h3 className="font-semibold text-lg mb-2 text-slate-200">📝 Instructions</h3>
        <ol className="list-decimal list-inside text-slate-400 space-y-1 text-sm">
            <li>Enter a website URL.</li>
            <li>Choose how many pages to scrape.</li>
            <li>Click "Scrape Website".</li>
            <li>Scraped data will be simulated as saved.</li>
            <li>Go to "Data Management" tab to simulate processing.</li>
        </ol>
        <h3 className="font-semibold text-lg mt-4 mb-2 text-slate-200">⚠️ Important Notes</h3>
        <ul className="list-disc list-inside text-slate-400 space-y-1 text-sm">
            <li>Only scrape websites you have permission to scrape.</li>
            <li>Some websites may block automated scraping.</li>
            <li>This feature is a simulation for demonstration purposes.</li>
        </ul>
      </div>

    </div>
  );
};

export default WebScraper;
