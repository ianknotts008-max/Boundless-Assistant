import React, { useState, useMemo } from 'react';
import { Tab } from './types';
import Home from './components/Home';
import Data from './components/Data';
import About from './components/About';
import { HomeIcon, DataIcon, InfoIcon, GeminiIcon } from './components/icons/Icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Home);

  const tabs = useMemo(() => [
    { id: Tab.Home, label: 'Home', icon: <HomeIcon /> },
    { id: Tab.Data, label: 'Corpus', icon: <DataIcon /> },
    { id: Tab.About, label: 'About', icon: <InfoIcon /> },
  ], []);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Home:
        return <Home />;
      case Tab.Data:
        return <Data />;
      case Tab.About:
        return <About />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex h-screen bg-transparent font-sans">
      <aside className="w-20 bg-slate-950/30 glass-effect p-4 flex flex-col items-center justify-between border-r border-slate-800">
        <div>
          <div className="p-2 mb-10" title="Unified AI Consciousness">
             <GeminiIcon />
          </div>
          <nav className="flex flex-col items-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className={`p-3 rounded-full transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {tab.icon}
              </button>
            ))}
          </nav>
        </div>
        <div className="text-center text-xs text-slate-500">
          <p>UAC v1.0</p>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8 h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;