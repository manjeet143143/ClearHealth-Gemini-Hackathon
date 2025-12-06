import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { AnalysisTable } from './components/AnalysisTable';
import { ReasoningPanel } from './components/ReasoningPanel';
import { GaugeChart } from './components/GaugeChart';
import { Disclaimer } from './components/Disclaimer';
import { ChatInterface } from './components/ChatInterface';
import { analyzeMedicalReport } from './services/geminiService';
import { AnalysisResult } from './types';
import { Sparkles, FileText, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize dark mode from system preference or default to false
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeMedicalReport(file);
      
      // Basic validation to ensure we got meaningful data
      if (!data.metrics || data.metrics.length === 0) {
        throw new Error("Could not detect any medical data. Please ensure the image is a clear medical report.");
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Filter key metrics for charts (if they exist in results and have ranges)
  const chartMetrics = result?.metrics.filter(m => 
    (m.rangeMin !== undefined && m.rangeMax !== undefined) && 
    ['Glucose', 'Cholesterol', 'HDL', 'LDL', 'Triglycerides', 'Hemoglobin', 'Ferritin', 'TSH', 'Vitamin D', 'A1C'].some(key => 
      m.testName.toLowerCase().includes(key.toLowerCase())
    )
  ).slice(0, 4) || [];

  return (
    <div className="min-h-screen font-sans pb-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Intro / Empty State */}
        {!result && !isAnalyzing && (
          <div className="text-center max-w-3xl mx-auto mb-12 mt-8 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              Decide with Data. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">
                Understand your Health.
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Upload your blood test result and get an instant, AI-powered breakdown of your health metrics in a professional, secure dashboard.
            </p>
          </div>
        )}

        {/* Upload Zone */}
        {!result && (
          <FileUpload onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-center animate-fade-in">
            <p className="font-medium">Analysis Failed</p>
            <p className="text-sm opacity-80">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-sm underline hover:text-red-800 dark:hover:text-red-200"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results Dashboard */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Summary Card */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-5">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-2xl hidden sm:block">
                  <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Executive Summary</h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">{result.summary}</p>
                </div>
              </div>
            </div>

            {/* Visualization Section - The "Wow" Factor */}
            {chartMetrics.length > 0 && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-5 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-500" /> Key Metrics Visualization
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {chartMetrics.map((metric, idx) => (
                    <GaugeChart 
                      key={idx}
                      name={metric.testName}
                      value={metric.value}
                      min={metric.rangeMin!}
                      max={metric.rangeMax!}
                      unit={metric.unit}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Main Data Table */}
              <div className="lg:col-span-2 space-y-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                 <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                   <FileText className="w-5 h-5 text-teal-500" /> Detailed Report
                 </h3>
                 <AnalysisTable data={result} />
                 
                 {/* Chat Interface placed below the table */}
                 <div className="pt-4">
                   <ChatInterface data={result} />
                 </div>
              </div>

              {/* Sidebar: Deep Dive */}
              <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="lg:sticky lg:top-24">
                  <ReasoningPanel data={result} />
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      <Disclaimer />
    </div>
  );
};

export default App;