/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ILLUSTRATIVE_CLAUSES, ClauseAnalysis } from './data/contractClauses';
import { Header, ActiveNavTab } from './components/Header';
import { ClauseCard } from './components/ClauseCard';
import { DiffViewer } from './components/DiffViewer';
import { RiskScorecard } from './components/RiskScorecard';
import { FullAgreementView } from './components/FullAgreementView';
import { CustomClauseAnalyzer } from './components/CustomClauseAnalyzer';
import { ModelEvaluationDashboard } from './components/ModelEvaluation/ModelEvaluationDashboard';
import { ExportModal } from './components/ExportModal';
import { 
  FileText, 
  AlertTriangle, 
  Scale, 
  ShieldAlert, 
  CheckCircle2, 
  Filter, 
  Download, 
  ArrowRight,
  BookOpen,
  Info,
  LineChart
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('clauses');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>('all');
  const [selectedClauseId, setSelectedClauseId] = useState<string>(ILLUSTRATIVE_CLAUSES[0].id);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Filter clauses based on severity filter
  const filteredClauses = ILLUSTRATIVE_CLAUSES.filter(c => {
    if (selectedSeverityFilter === 'all') return true;
    return c.riskSeverity.toLowerCase() === selectedSeverityFilter.toLowerCase();
  });

  const activeWorkbenchClause = ILLUSTRATIVE_CLAUSES.find(c => c.id === selectedClauseId) || ILLUSTRATIVE_CLAUSES[0];

  const handleSelectClauseFromScorecard = (clauseId: string) => {
    setSelectedClauseId(clauseId);
    setActiveTab('clauses');
    const el = document.getElementById(clauseId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 3-Zone Top Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Hero / Document Context Banner */}
      <section className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-sans">
            <span className="font-semibold text-slate-900">Legal Audit Dossier</span>
            <span aria-hidden="true">·</span>
            <span>Document: Illustrative Service Agreement</span>
            <span aria-hidden="true">·</span>
            <span className="text-rose-700 font-medium">Verdict: Critical Revision Required Prior to Execution</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tracking-tight text-balance">
                Clause-by-Clause Contract Risk Analysis & Balanced Redlines
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                A rigorous legal assessment of the 5 core clauses in the Illustrative Service Agreement. 
                Identifies unilateral traps, structural ambiguities, and uninsurable indemnities, providing market-tested, bilateral redline language, tactical negotiation positions, and statistical model performance evaluation.
              </p>
            </div>

            {/* Quick stats strip */}
            <div className="flex items-center gap-6 shrink-0 bg-slate-50 border border-slate-200/80 p-3 rounded-lg text-xs">
              <div>
                <span className="text-slate-500 block">Analyzed</span>
                <span className="text-base font-bold font-mono text-slate-900 tabular-nums">5 Clauses</span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div>
                <span className="text-slate-500 block">Critical Gaps</span>
                <span className="text-base font-bold font-mono text-rose-700 tabular-nums">2 Traps</span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div>
                <span className="text-slate-500 block">Redline Standard</span>
                <span className="text-base font-bold font-serif text-slate-900">Net 30 / Bilateral</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: CLAUSE ANALYSIS */}
        {activeTab === 'clauses' && (
          <div className="space-y-6">
            {/* Filter controls bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white border border-slate-200 rounded-lg shadow-xs">
              <div className="flex items-center gap-2 text-xs font-sans">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium text-slate-600">Filter by Severity:</span>
                <div className="flex items-center p-0.5 bg-slate-100 rounded border border-slate-200">
                  <button
                    onClick={() => setSelectedSeverityFilter('all')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedSeverityFilter === 'all'
                        ? 'bg-white text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All (5)
                  </button>
                  <button
                    onClick={() => setSelectedSeverityFilter('critical')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedSeverityFilter === 'critical'
                        ? 'bg-white text-rose-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Critical (2)
                  </button>
                  <button
                    onClick={() => setSelectedSeverityFilter('high')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedSeverityFilter === 'high'
                        ? 'bg-white text-amber-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    High (1)
                  </button>
                  <button
                    onClick={() => setSelectedSeverityFilter('medium')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedSeverityFilter === 'medium'
                        ? 'bg-white text-blue-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Medium (2)
                  </button>
                </div>
              </div>

              {/* Fast Jump Select */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>Jump to clause:</span>
                <div className="flex items-center gap-1">
                  {ILLUSTRATIVE_CLAUSES.map(c => (
                    <a
                      key={c.id}
                      href={`#${c.id}`}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono transition-colors"
                    >
                      §{c.number}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* List of Clause Cards */}
            <div className="space-y-6">
              {filteredClauses.map(clause => (
                <div key={clause.id} id={clause.id}>
                  <ClauseCard clause={clause} initialExpanded={true} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: REDLINE WORKBENCH */}
        {activeTab === 'redlines' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-2">
              <h2 className="text-lg font-bold font-serif text-slate-900">
                Interactive Redline Workbench
              </h2>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Compare original contract provisions side-by-side with recommended market redlines. 
                Select a clause below to examine strikethroughs, inserted protections, and alternate negotiating positions.
              </p>

              {/* Clause selector buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-3">
                {ILLUSTRATIVE_CLAUSES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClauseId(c.id)}
                    className={`px-3 py-1.5 text-xs rounded transition-colors flex items-center gap-1.5 ${
                      selectedClauseId === c.id
                        ? 'bg-slate-900 text-white font-medium shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="font-mono">§{c.number}</span>
                    <span>{c.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Clause Redline Breakdown */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="text-xs text-slate-500 font-sans">
                    Clause {activeWorkbenchClause.number} of 5 · {activeWorkbenchClause.category}
                  </div>
                  <h3 className="text-lg font-bold font-serif text-slate-900 mt-0.5">
                    {activeWorkbenchClause.number}. {activeWorkbenchClause.title} Provision
                  </h3>
                </div>
                <div className="text-xs font-semibold text-rose-700">
                  {activeWorkbenchClause.riskSeverity} Risk
                </div>
              </div>

              {/* Primary Diff View */}
              <DiffViewer
                originalText={activeWorkbenchClause.originalText}
                proposedText={activeWorkbenchClause.balancedRedline}
                deletions={activeWorkbenchClause.redlinePresets.balanced.deletions}
                insertions={activeWorkbenchClause.redlinePresets.balanced.insertions}
                title="Full Comparative Redline"
                defaultMode="side-by-side"
              />

              {/* Preset Alternative Stances */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-3">
                  Alternative Negotiating Stances
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                    <span className="text-xs font-semibold text-slate-900 block">
                      Client-Favorable Preset
                    </span>
                    <p className="text-xs text-slate-500">
                      {activeWorkbenchClause.redlinePresets.clientProtective.description}
                    </p>
                    <pre className="font-serif text-xs text-slate-800 bg-white p-3 rounded border border-slate-200 whitespace-pre-wrap leading-relaxed">
                      {activeWorkbenchClause.redlinePresets.clientProtective.text}
                    </pre>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                    <span className="text-xs font-semibold text-slate-900 block">
                      Provider-Favorable Preset
                    </span>
                    <p className="text-xs text-slate-500">
                      {activeWorkbenchClause.redlinePresets.providerProtective.description}
                    </p>
                    <pre className="font-serif text-xs text-slate-800 bg-white p-3 rounded border border-slate-200 whitespace-pre-wrap leading-relaxed">
                      {activeWorkbenchClause.redlinePresets.providerProtective.text}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RISK SCORECARD */}
        {activeTab === 'scorecard' && (
          <RiskScorecard onSelectClause={handleSelectClauseFromScorecard} />
        )}

        {/* TAB 4: FULL AGREEMENT SYNTHESIS */}
        {activeTab === 'full-agreement' && (
          <FullAgreementView />
        )}

        {/* TAB 5: CUSTOM CLAUSE LAB */}
        {activeTab === 'custom-analyzer' && (
          <CustomClauseAnalyzer />
        )}

        {/* TAB 6: MODEL PERFORMANCE EVALUATION */}
        {activeTab === 'model-evaluation' && (
          <ModelEvaluationDashboard />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-900 text-sm">ClauseCraft</span>
            <span aria-hidden="true">·</span>
            <span>Commercial Contract Risk Analysis & Model Performance Evaluation Suite</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Prepared for illustrative review and educational purposes</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsExportOpen(true)}
              className="text-slate-900 hover:underline font-medium"
            >
              Export Full Report
            </button>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
