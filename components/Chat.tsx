

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !image) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: input }],
      // FIX: Corrected property name from 'image' to 'uiImagePreview' to match the ChatMessage type.
      uiImagePreview: imagePreview || undefined
    };

    setMessages((prev) => [...prev, userMessage]);

    const history = messages;
    const response = await getChatResponse(history, { text: input, image: image || undefined });

    const modelMessage: ChatMessage = {
      role: 'model',
      parts: [{ text: response }],
    };

    setMessages((prev) => [...prev, modelMessage]);
    setInput('');
    removeImage();
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-slate-100">💬 Chat</h2>
        <p className="text-slate-400">Ask complex questions, analyze images, and get web-enhanced answers.</p>
      </header>

      <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"></div>}
            <div className={`max-w-xl p-4 rounded-xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
              {/* FIX: Corrected property name from 'msg.image' to 'msg.uiImagePreview' to match the ChatMessage type. */}
              {msg.uiImagePreview && <img src={msg.uiImagePreview} alt="user upload" className="rounded-lg mb-2 max-h-60" />}
              <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"></div>
              <div className="max-w-xl p-4 rounded-xl bg-slate-800 text-slate-200 rounded-bl-none">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-6 border-t border-slate-800 pt-6">
        <form onSubmit={handleSubmit} className="relative">
          {imagePreview && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-slate-800 rounded-lg">
                <img src={imagePreview} alt="preview" className="h-20 w-20 object-cover rounded"/>
                <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">&times;</button>
            </div>
          )}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSubmit(e);
              }
            }}
            placeholder="Type your message or upload an image..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 pr-32 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={2}
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
             <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             </button>
             <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
             <button type="submit" disabled={isLoading || (!input.trim() && !image)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                Send
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;