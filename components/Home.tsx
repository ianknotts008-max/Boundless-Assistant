import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse, generateImage, researchTopic } from '../services/geminiService';
import { ChatMessage } from '../types';
import { GeminiIcon, SparkleIcon, GlobeIcon, ChatBubbleIcon, AttachIcon, MicIcon } from './icons/Icons';

type OutputMode = 'chat' | 'image' | 'research';

const ResearchReportCard = ({ report, sources, topic }: { report: string, sources: any[], topic: string }) => {
  const formatReport = (text: string) => {
    return text.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('##')) {
        return <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-indigo-300">{paragraph.replace(/##/g, '')}</h3>;
      }
      if (paragraph.startsWith('#')) {
        return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-purple-200">{paragraph.replace(/#/g, '')}</h2>;
      }
      if (paragraph.startsWith('* ')) {
        return <li key={index} className="ml-5 list-disc">{paragraph.substring(2)}</li>
      }
      return <p key={index} className="mb-4">{paragraph}</p>;
    });
  };

  return (
    <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-li:text-slate-300">
      <h2 className="text-2xl font-bold mb-4 text-slate-100">Research Report: {topic}</h2>
      <div>{formatReport(report)}</div>
      {sources.length > 0 && (
        <div className="mt-8 border-t border-slate-700 pt-4">
          <h4 className="font-semibold text-lg text-slate-200 mb-2">Sources:</h4>
          <ul className="space-y-1">
            {sources.map((source, index) => (
              <li key={index} className="text-sm">
                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline break-all">
                  {source.title || source.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
};

const Home: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [outputMode, setOutputMode] = useState<OutputMode>('chat');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setOutputMode('chat'); // Force to chat mode when image is uploaded
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !image) return;

    setIsLoading(true);
    const userMessageText = input;
    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: userMessageText }],
      uiImagePreview: imagePreview || undefined,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    removeImage();

    const history = messages;
    let modelMessage: ChatMessage;

    try {
        if (outputMode === 'image') {
            const url = await generateImage(userMessageText);
            modelMessage = { role: 'model', parts: [{ text: `Generated image for: "${userMessageText}"`}], type: 'image-generation', generatedImageUrl: url };
        } else if (outputMode === 'research') {
            const { text, sources } = await researchTopic(userMessageText);
            modelMessage = { role: 'model', parts: [{ text }], type: 'research-report', sources };
        } else {
            const responseText = await getChatResponse(history, { text: userMessageText, image: image || undefined });
            modelMessage = { role: 'model', parts: [{ text: responseText }], type: 'message' };
        }
    } catch(error: any) {
        modelMessage = { role: 'model', parts: [{ text: error.message || "An unexpected error occurred." }], type: 'message' };
    }

    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };
  
  const ModeButton = ({ mode, label, icon }: { mode: OutputMode, label: string, icon: React.ReactNode }) => (
    <button
      type="button"
      onClick={() => {
        if(mode !== 'chat') removeImage();
        setOutputMode(mode);
      }}
      disabled={isLoading}
      title={label}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${outputMode === mode ? 'bg-indigo-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'}`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-8 pb-8">
        {messages.length === 0 && !isLoading && (
            <div className="text-center pt-24">
                <div className="inline-block p-4 bg-slate-900/50 rounded-full mb-4 border border-slate-800">
                    <GeminiIcon />
                </div>
                <h1 className="text-3xl font-bold text-slate-200">How can I help you today?</h1>
            </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 items-start ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 mt-1"></div>}
            <div className={`max-w-2xl ${msg.role === 'user' ? 'order-2' : ''}`}>
                <div className={`p-4 rounded-xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'glass-effect border border-slate-800 text-slate-200 rounded-bl-none'}`}>
                  {msg.uiImagePreview && <img src={msg.uiImagePreview} alt="user upload" className="rounded-lg mb-2 max-h-60" />}
                  
                  {msg.type === 'image-generation' && msg.generatedImageUrl && <img src={msg.generatedImageUrl} alt="generated" className="rounded-lg max-h-96" />}
                  
                  {msg.type === 'research-report' ? <ResearchReportCard report={msg.parts[0].text} sources={msg.sources || []} topic={messages[index-1].parts[0].text} /> : <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>}
                </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 mt-1"></div>
              <div className="max-w-xl p-4 rounded-xl glass-effect border border-slate-800 text-slate-200 rounded-bl-none">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                </div>
              </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-6 border-t border-slate-800 pt-6">
        <form onSubmit={handleSubmit} className="relative">
          <div className="p-2 rounded-t-lg glass-effect border border-b-0 border-slate-700">
            {imagePreview && (
                <div className="p-2">
                    <div className="relative inline-block">
                        <img src={imagePreview} alt="preview" className="h-20 w-20 object-cover rounded"/>
                        <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">&times;</button>
                    </div>
                </div>
            )}
             <div className="flex items-center gap-2 px-2 pb-2">
                <ModeButton mode="chat" label="Chat" icon={<ChatBubbleIcon />} />
                <ModeButton mode="image" label="Generate" icon={<SparkleIcon />} />
                <ModeButton mode="research" label="Research" icon={<GlobeIcon />} />
             </div>
          </div>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e); }}
              placeholder={
                outputMode === 'image' ? "A photorealistic image of..." : 
                outputMode === 'research' ? "Research the future of..." : 
                "Ask me anything..."
              }
              className="w-full bg-slate-800/80 border border-slate-700 rounded-b-lg p-4 pr-32 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows={2}
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
               <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors" title="Attach Image">
                  <AttachIcon />
               </button>
               <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
               <button type="button" disabled={true} className="p-2 rounded-full text-slate-600 cursor-not-allowed" title="Voice Input (Coming Soon)">
                  <MicIcon />
               </button>
               <button type="submit" disabled={isLoading || (!input.trim() && !image)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                  Send
               </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
