import React, { useState } from 'react';
import { ClauseAnalysis } from '../data/contractClauses';
import { DiffViewer } from './DiffViewer';
import { 
  AlertTriangle, 
  HelpCircle, 
  Scale, 
  Users, 
  FileEdit, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare,
  BookOpen
} from 'lucide-react';

interface ClauseCardProps {
  clause: ClauseAnalysis;
  initialExpanded?: boolean;
}

export const ClauseCard: React.FC<ClauseCardProps> = ({ clause, initialExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [activeTab, setActiveTab] = useState<'hazards' | 'ambiguities' | 'parties' | 'doctrines' | 'redline' | 'negotiation'>('redline');
  const [selectedPreset, setSelectedPreset] = useState<'balanced' | 'clientProtective' | 'providerProtective'>('balanced');
  
  // Tunable live parameters
  const [tunableSettings, setTunableSettings] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    clause.tunableOptions.forEach(opt => {
      initial[opt.id] = opt.defaultValue;
    });
    return initial;
  });
  const [isCustomTuned, setIsCustomTuned] = useState(false);

  const handleTuneChange = (id: string, value: any) => {
    setTunableSettings(prev => ({ ...prev, [id]: value }));
    setIsCustomTuned(true);
  };

  const resetToPreset = (preset: 'balanced' | 'clientProtective' | 'providerProtective') => {
    setSelectedPreset(preset);
    setIsCustomTuned(false);
  };

  const currentProposedText = isCustomTuned
    ? clause.generateTunableText(tunableSettings)
    : clause.redlinePresets[selectedPreset].text;

  // Severity styling (clean text & borders, anti-pill discipline)
  const getSeverityBadge = (severity: 'Critical' | 'High' | 'Medium' | 'Low') => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
            Critical Risk · Illusory / Unlimited Exposure
          </span>
        );
      case 'High':
        return (
          <span className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600 inline-block"></span>
            High Risk · Unilateral Discretion
          </span>
        );
      case 'Medium':
        return (
          <span className="text-xs font-semibold text-blue-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
            Moderate Risk · Ambiguous / Omission Gap
          </span>
        );
      default:
        return (
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-500 inline-block"></span>
            Standard
          </span>
        );
    }
  };

  return (
    <article className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden transition-all duration-200">
      {/* Header bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex items-start justify-between gap-4 select-none"
      >
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-sans">
            <span className="font-semibold text-slate-900">Clause {clause.number}</span>
            <span aria-hidden="true">·</span>
            <span>{clause.category}</span>
            <span aria-hidden="true">·</span>
            {getSeverityBadge(clause.riskSeverity)}
          </div>
          
          <h2 className="text-lg font-bold text-slate-900 tracking-tight font-serif">
            {clause.number}. {clause.title} Clause
          </h2>

          <p className="text-sm text-slate-600 font-sans line-clamp-2 max-w-4xl">
            {clause.riskSummary}
          </p>
        </div>

        <button 
          type="button"
          aria-label={isExpanded ? 'Collapse clause details' : 'Expand clause details'}
          className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition-colors shrink-0"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded body */}
      {isExpanded && (
        <div className="border-t border-slate-200 px-5 pt-4 pb-6 space-y-6">
          {/* Original Text Box */}
          <div className="bg-slate-50 border border-slate-200/90 rounded p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              <span>Original Draft Text (Illustrative Document)</span>
              <span className="text-slate-400 font-normal normal-case font-mono">50 words or less</span>
            </div>
            <p className="font-serif text-base text-slate-900 leading-relaxed italic">
              "{clause.originalText}"
            </p>
          </div>

          {/* Navigation tabs for analysis */}
          <div className="flex items-center gap-1 border-b border-slate-200 pb-px overflow-x-auto text-xs font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('redline')}
              className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'redline'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Balanced Redline & Diff</span>
            </button>
            <button
              onClick={() => setActiveTab('ambiguities')}
              className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'ambiguities'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Identified Ambiguities ({clause.ambiguities.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('hazards')}
              className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'hazards'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Key Risks & Exposure</span>
            </button>
            <button
              onClick={() => setActiveTab('parties')}
              className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'parties'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Client vs. Provider Impact</span>
            </button>
            <button
              onClick={() => setActiveTab('doctrines')}
              className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'doctrines'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Legal Doctrines & UCC</span>
            </button>
            <button
              onClick={() => setActiveTab('negotiation')}
              className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'negotiation'
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Negotiation Script</span>
            </button>
          </div>

          {/* TAB 1: REDLINE & TUNER */}
          {activeTab === 'redline' && (
            <div className="space-y-4">
              {/* Presets and Tuner controls */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">Preset Stance:</span>
                  <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-slate-200 text-xs">
                    <button
                      onClick={() => resetToPreset('balanced')}
                      className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                        selectedPreset === 'balanced' && !isCustomTuned
                          ? 'bg-slate-900 text-white font-medium'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Balanced Standard
                    </button>
                    <button
                      onClick={() => resetToPreset('clientProtective')}
                      className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                        selectedPreset === 'clientProtective' && !isCustomTuned
                          ? 'bg-slate-900 text-white font-medium'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Client-Favorable
                    </button>
                    <button
                      onClick={() => resetToPreset('providerProtective')}
                      className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                        selectedPreset === 'providerProtective' && !isCustomTuned
                          ? 'bg-slate-900 text-white font-medium'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Provider-Favorable
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-sans">
                  {isCustomTuned ? (
                    <span className="text-amber-700 font-medium flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5" /> Custom Parameters Active
                    </span>
                  ) : (
                    <span>{clause.redlinePresets[selectedPreset].description}</span>
                  )}
                </div>
              </div>

              {/* Live interactive tunable parameters */}
              {clause.tunableOptions.length > 0 && (
                <div className="p-3.5 bg-slate-50/50 border border-slate-200 rounded space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <Sliders className="w-3.5 h-3.5 text-slate-500" />
                    <span>Customize Drafting Parameters</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {clause.tunableOptions.map(option => (
                      <div key={option.id} className="space-y-1">
                        <label className="text-xs font-medium text-slate-700 block">
                          {option.label}
                        </label>
                        {option.type === 'select' && option.options && (
                          <select
                            value={tunableSettings[option.id]}
                            onChange={e => {
                              const val = !isNaN(Number(e.target.value)) ? Number(e.target.value) : e.target.value;
                              handleTuneChange(option.id, val);
                            }}
                            className="w-full text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                          >
                            {option.options.map(opt => (
                              <option key={String(opt.value)} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}
                        {option.type === 'boolean' && (
                          <label className="flex items-center gap-2 cursor-pointer mt-1">
                            <input
                              type="checkbox"
                              checked={Boolean(tunableSettings[option.id])}
                              onChange={e => handleTuneChange(option.id, e.target.checked)}
                              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
                            />
                            <span className="text-xs text-slate-600">{option.description}</span>
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diff Viewer Component */}
              <DiffViewer
                originalText={clause.originalText}
                proposedText={currentProposedText}
                deletions={clause.redlinePresets[selectedPreset].deletions}
                insertions={clause.redlinePresets[selectedPreset].insertions}
                title={`Clause ${clause.number} Redline`}
                defaultMode="side-by-side"
              />
            </div>
          )}

          {/* TAB 2: AMBIGUITIES */}
          {activeTab === 'ambiguities' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Deficiencies & Unstated Parameters
              </div>
              <ul className="space-y-2.5">
                {clause.ambiguities.map((item, idx) => {
                  const [boldPart, ...rest] = item.split(':');
                  return (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                      <div>
                        {rest.length > 0 ? (
                          <>
                            <strong className="font-semibold text-slate-900">{boldPart}:</strong>
                            <span>{rest.join(':')}</span>
                          </>
                        ) : (
                          <span>{item}</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* TAB 3: HAZARDS & RISKS */}
          {activeTab === 'hazards' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Operational & Financial Hazards
              </div>
              <div className="p-4 bg-rose-50/50 border border-rose-200 rounded space-y-2">
                <div className="font-semibold text-sm text-rose-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Primary Structural Threat</span>
                </div>
                <p className="text-sm text-rose-900 leading-relaxed">
                  {clause.riskSummary}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-xs font-semibold text-slate-700 block mb-1">Commercial Impact</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Leaves fundamental obligations completely open to unilateral re-interpretation, leading to cash flow interruptions or uninsurable balance sheet losses.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-xs font-semibold text-slate-700 block mb-1">Legal Enforceability</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Courts frequently struggle with clauses lacking mutuality or reasonable notice, creating either unpredictable statutory interpretations or complete judicial invalidation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PARTIES COMPARISON */}
          {activeTab === 'parties' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Client Vulnerabilities
                  </span>
                  <span className="text-xs text-rose-600 font-medium">Higher Burden</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  {clause.partyRisks.client.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Service Provider Exposure
                  </span>
                  <span className="text-xs text-amber-600 font-medium">Legal / Enforceability</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  {clause.partyRisks.provider.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: DOCTRINES */}
          {activeTab === 'doctrines' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Applicable Contract Doctrines & Standards</span>
              </div>
              <div className="space-y-2.5">
                {clause.legalDoctrines.map((doctrine, idx) => {
                  const [title, ...body] = doctrine.split(':');
                  return (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs leading-relaxed">
                      <strong className="font-semibold text-slate-900 block mb-0.5">{title}</strong>
                      <span className="text-slate-600">{body.join(':')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: NEGOTIATION PLAYBOOK */}
          {activeTab === 'negotiation' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tactical Negotiation Playbook
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1">
                <span className="font-semibold text-slate-900 block">Opening Position (Client Redline Comment):</span>
                <p className="font-serif italic text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                  {clause.negotiationPoints.clientPosition}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50/40 border border-emerald-200 rounded space-y-1">
                  <span className="font-semibold text-emerald-950 block">Acceptable Compromise:</span>
                  <p className="text-emerald-900">
                    {clause.negotiationPoints.compromisePosition}
                  </p>
                </div>

                <div className="p-3 bg-rose-50/40 border border-rose-200 rounded space-y-1">
                  <span className="font-semibold text-rose-950 block">Walkaway / Deal-Breaker Trigger:</span>
                  <p className="text-rose-900">
                    {clause.negotiationPoints.walkawayThreshold}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
};
