import React from 'react';
import { ShieldAlert, FileText, Download, Sparkles, LineChart } from 'lucide-react';

export type ActiveNavTab = 'clauses' | 'redlines' | 'scorecard' | 'full-agreement' | 'custom-analyzer' | 'model-evaluation';

interface HeaderProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab, onOpenExport }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => onSelectTab('clauses')}
            className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
          >
            <div className="w-8 h-8 rounded bg-slate-900 text-amber-400 flex items-center justify-center font-serif font-bold text-lg shadow-xs group-hover:bg-slate-800 transition-colors">
              §
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap font-serif">
                ClauseCraft
              </span>
              <span className="text-[11px] text-slate-500 font-sans tracking-wide">
                Agreement Risk & Redline
              </span>
            </div>
          </button>

          {/* Zone 2: 5-6 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 overflow-x-auto">
            <button
              onClick={() => onSelectTab('clauses')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 text-left ${
                activeTab === 'clauses'
                  ? 'text-slate-900 border-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Clause Analysis
            </button>
            <button
              onClick={() => onSelectTab('redlines')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 text-left ${
                activeTab === 'redlines'
                  ? 'text-slate-900 border-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Redline Workbench
            </button>
            <button
              onClick={() => onSelectTab('scorecard')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 text-left ${
                activeTab === 'scorecard'
                  ? 'text-slate-900 border-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Risk Scorecard
            </button>
            <button
              onClick={() => onSelectTab('full-agreement')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 text-left ${
                activeTab === 'full-agreement'
                  ? 'text-slate-900 border-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Full Agreement
            </button>
            <button
              onClick={() => onSelectTab('custom-analyzer')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 text-left ${
                activeTab === 'custom-analyzer'
                  ? 'text-slate-900 border-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Clause Lab
            </button>
            <button
              onClick={() => onSelectTab('model-evaluation')}
              className={`whitespace-nowrap transition-colors py-1 border-b-2 text-left flex items-center gap-1.5 ${
                activeTab === 'model-evaluation'
                  ? 'text-slate-900 border-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <LineChart className="w-3.5 h-3.5 text-slate-500" />
              <span>Model Evaluation</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors whitespace-nowrap shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Redlines</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="flex lg:hidden items-center gap-4 py-2 border-t border-slate-100 overflow-x-auto text-xs font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('clauses')}
            className={`whitespace-nowrap ${activeTab === 'clauses' ? 'text-slate-900 font-semibold' : ''}`}
          >
            Clauses
          </button>
          <button
            onClick={() => onSelectTab('redlines')}
            className={`whitespace-nowrap ${activeTab === 'redlines' ? 'text-slate-900 font-semibold' : ''}`}
          >
            Redlines
          </button>
          <button
            onClick={() => onSelectTab('scorecard')}
            className={`whitespace-nowrap ${activeTab === 'scorecard' ? 'text-slate-900 font-semibold' : ''}`}
          >
            Scorecard
          </button>
          <button
            onClick={() => onSelectTab('full-agreement')}
            className={`whitespace-nowrap ${activeTab === 'full-agreement' ? 'text-slate-900 font-semibold' : ''}`}
          >
            Agreement
          </button>
          <button
            onClick={() => onSelectTab('custom-analyzer')}
            className={`whitespace-nowrap ${activeTab === 'custom-analyzer' ? 'text-slate-900 font-semibold' : ''}`}
          >
            Clause Lab
          </button>
          <button
            onClick={() => onSelectTab('model-evaluation')}
            className={`whitespace-nowrap ${activeTab === 'model-evaluation' ? 'text-slate-900 font-semibold' : ''}`}
          >
            Model Evaluation
          </button>
        </div>
      </div>
    </header>
  );
};
