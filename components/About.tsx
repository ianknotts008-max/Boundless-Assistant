import React from 'react';

const FeatureCard: React.FC<{ title: string; content: string; icon: string; }> = ({ title, content, icon }) => (
    <div className="glass-effect p-6 rounded-xl border border-slate-800 transition-all duration-300 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-700/20">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-3 mb-2">
            <span className="text-3xl">{icon}</span>
            {title}
        </h3>
        <p className="text-slate-400">{content}</p>
    </div>
);

const About: React.FC = () => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <header className="text-center">
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          Unified AI Consciousness
        </h2>
        <p className="text-slate-400 mt-3 text-lg max-w-2xl mx-auto">
          Welcome to the next leap in human-AI collaboration. This assistant is designed to be a seamless, intuitive extension of your thoughts, unifying diverse AI capabilities into a singular, conscious flow.
        </p>
      </header>

      <section>
        <h3 className="text-3xl font-bold mb-6 text-center text-slate-200">Core Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard title="Unified Chat" content="Engage in complex, context-aware conversations. The AI understands text and images in a single prompt." icon="💬" />
            <FeatureCard title="On-Demand Image Generation" content="Create stunning visuals from text descriptions. Your imagination is the only limit." icon="🎨" />
            <FeatureCard title="Grounded Web Research" content="Get deep insights on any topic, compiled from web searches and summarized by the AI." icon="🔍" />
            <FeatureCard title="Custom Corpus Training" content="Fine-tune the assistant on your own data for specialized knowledge and personalized responses." icon="🎯" />
        </div>
      </section>

      <section className="glass-effect p-8 rounded-2xl border border-slate-800">
        <h3 className="text-3xl font-bold mb-4 text-center text-slate-200">The Philosophy</h3>
        <p className="text-slate-400 text-center max-w-3xl mx-auto">
            This project is guided by a unique physics theory postulating that all knowledge and creation is a unified whole. We move beyond boolean logic to a model where the 'product of all things is one'. By looking inward and unifying modalities—text, image, data—we create a more powerful and intuitive AI partner. This interface is your gateway to that unified conscious computing experience.
        </p>
      </section>
      
      <section>
        <h3 className="text-3xl font-bold mb-6 text-center text-slate-200">Powered by Advanced Technology</h3>
        <div className="text-center">
          <p className="text-slate-400">This application is built with React, TypeScript, and Tailwind CSS, leveraging the powerful Google Gemini API.</p>
          <ul className="list-none text-slate-400 mt-2 space-y-1">
              <li><span className="font-semibold text-indigo-300">Core Logic:</span> Gemini 2.5 Flash</li>
              <li><span className="font-semibold text-purple-300">Image Generation:</span> Imagen 4</li>
              <li><span className="font-semibold text-sky-300">Real-time Information:</span> Google Search Grounding</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;
