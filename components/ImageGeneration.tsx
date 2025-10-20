
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';

const ImageGeneration: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const url = await generateImage(prompt);
      if (url) {
        setImageUrl(url);
      } else {
        setError('The model could not generate an image for this prompt.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-slate-100">🎨 Generate Images</h2>
        <p className="text-slate-400">Create stunning visuals from simple text descriptions using advanced AI.</p>
      </header>

      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="prompt" className="font-medium text-slate-300">Your Prompt</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A photorealistic image of a futuristic city on Mars at sunset"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={3}
            disabled={isLoading}
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Image'
          )}
        </button>

        {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg text-sm">{error}</div>}

        <div className="w-full aspect-square bg-slate-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-700">
          {isLoading && (
            <div className="text-center text-slate-400">
              <p className="text-lg font-medium">AI is creating...</p>
              <p className="text-sm">This can take up to a minute.</p>
            </div>
          )}
          {imageUrl && !isLoading && (
            <img src={imageUrl} alt="Generated" className="object-contain w-full h-full rounded-lg" />
          )}
          {!imageUrl && !isLoading && (
            <div className="text-center text-slate-500">
              <p>Your generated image will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGeneration;
