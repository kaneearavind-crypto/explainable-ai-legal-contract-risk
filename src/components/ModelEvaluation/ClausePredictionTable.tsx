import React, { useState } from 'react';
import { EvaluatedSample } from '../../utils/evaluationMetrics';
import { Check, X, Search, Filter, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface ClausePredictionTableProps {
  samples: EvaluatedSample[];
  activeFilter?: 'all' | 'tp' | 'tn' | 'fp' | 'fn';
  onResetFilter?: () => void;
}

export const ClausePredictionTable: React.FC<ClausePredictionTableProps> = ({
  samples,
  activeFilter = 'all',
  onResetFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'correct' | 'incorrect' | 'fp' | 'fn'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sync external filter with internal statusFilter if activeFilter changes
  const effectiveFilter = activeFilter !== 'all' ? activeFilter : statusFilter;

  const filteredSamples = samples.filter(s => {
    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchText = s.clauseText.toLowerCase().includes(q);
      const matchActual = s.actualLabel.toLowerCase().includes(q);
      const matchPred = s.predictedLabel.toLowerCase().includes(q);
      if (!matchText && !matchActual && !matchPred) return false;
    }

    // Status filter
    if (effectiveFilter === 'correct') return s.isBinaryCorrect;
    if (effectiveFilter === 'incorrect') return !s.isBinaryCorrect;
    if (effectiveFilter === 'tp') return s.actualBinary === 'Risky' && s.predictedBinary === 'Risky';
    if (effectiveFilter === 'tn') return s.actualBinary === 'Not Risky' && s.predictedBinary === 'Not Risky';
    if (effectiveFilter === 'fp') return s.actualBinary === 'Not Risky' && s.predictedBinary === 'Risky';
    if (effectiveFilter === 'fn') return s.actualBinary === 'Risky' && s.predictedBinary === 'Not Risky';

    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold font-serif text-slate-900">
            Clause-by-Clause Evaluation Log ({filteredSamples.length} of {samples.length})
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Individual clause predictions evaluated against ground-truth labels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clauses..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs bg-white border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 w-44 sm:w-56"
            />
          </div>

          {/* Status Filter buttons */}
          <div className="flex items-center p-0.5 bg-slate-200/80 rounded text-xs font-sans">
            <button
              onClick={() => {
                setStatusFilter('all');
                onResetFilter?.();
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                effectiveFilter === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({samples.length})
            </button>
            <button
              onClick={() => setStatusFilter('correct')}
              className={`px-2.5 py-1 rounded transition-colors ${
                effectiveFilter === 'correct' || effectiveFilter === 'tp' || effectiveFilter === 'tn'
                  ? 'bg-white text-emerald-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Correct
            </button>
            <button
              onClick={() => setStatusFilter('incorrect')}
              className={`px-2.5 py-1 rounded transition-colors ${
                effectiveFilter === 'incorrect' || effectiveFilter === 'fp' || effectiveFilter === 'fn'
                  ? 'bg-white text-rose-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Errors
            </button>
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 font-sans">
              <th className="py-2.5 px-3 w-12 text-center">#</th>
              <th className="py-2.5 px-4 min-w-[320px]">Contract Clause Text</th>
              <th className="py-2.5 px-3 w-32">Actual Label (GT)</th>
              <th className="py-2.5 px-3 w-32">Predicted Label</th>
              <th className="py-2.5 px-3 w-28 text-center">Result</th>
              <th className="py-2.5 px-4 min-w-[200px]">Explainable Risk Detection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredSamples.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No evaluated clauses match the selected filter or search query.
                </td>
              </tr>
            ) : (
              filteredSamples.map(sample => {
                const isExpanded = expandedId === sample.id;
                const isError = !sample.isBinaryCorrect;

                return (
                  <tr
                    key={sample.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isError ? 'bg-rose-50/15' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center font-mono text-slate-400">
                      {sample.index}
                    </td>

                    {/* Clause text with toggle */}
                    <td className="py-3 px-4 font-serif text-slate-800 leading-relaxed">
                      <div className="flex items-start justify-between gap-2">
                        <div className="line-clamp-2">
                          {isExpanded ? (
                            <span className="whitespace-pre-wrap">{sample.clauseText}</span>
                          ) : (
                            <span>{sample.clauseText}</span>
                          )}
                        </div>
                        {sample.clauseText.length > 80 && (
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : sample.id)}
                            className="p-1 text-slate-400 hover:text-slate-600 shrink-0"
                            title={isExpanded ? 'Collapse clause' : 'Expand full clause'}
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                      {isExpanded && (
                        <div className="mt-2 pt-2 border-t border-slate-200 text-xs font-sans text-slate-500 space-y-1">
                          <div><strong>Raw Actual Annotation:</strong> {sample.actualLabel}</div>
                          <div><strong>Model Confidence:</strong> {(sample.confidence * 100).toFixed(0)}%</div>
                          <div><strong>Model Rationale:</strong> {sample.explanation}</div>
                        </div>
                      )}
                    </td>

                    {/* Ground truth */}
                    <td className="py-3 px-3">
                      <span className="font-semibold block text-slate-900 font-sans">
                        {sample.actualBinary}
                      </span>
                      {sample.actualMultiClass && (
                        <span className="text-[11px] text-slate-500 block">
                          Severity: {sample.actualMultiClass}
                        </span>
                      )}
                    </td>

                    {/* Predicted */}
                    <td className="py-3 px-3">
                      <span className={`font-semibold block font-sans ${
                        sample.predictedBinary === 'Risky' ? 'text-rose-700' : 'text-emerald-700'
                      }`}>
                        {sample.predictedBinary}
                      </span>
                      {sample.predictedMultiClass && (
                        <span className="text-[11px] text-slate-500 block">
                          Severity: {sample.predictedMultiClass}
                        </span>
                      )}
                    </td>

                    {/* Result */}
                    <td className="py-3 px-3 text-center">
                      {sample.isBinaryCorrect ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold text-xs">
                          <X className="w-3.5 h-3.5 text-rose-600" />
                          <span>{sample.actualBinary === 'Risky' ? 'False Negative' : 'False Positive'}</span>
                        </span>
                      )}
                    </td>

                    {/* Explainable factors */}
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      {sample.detectedFactors.length > 0 ? (
                        <ul className="space-y-1 list-disc list-inside">
                          {sample.detectedFactors.slice(0, 2).map((factor, i) => (
                            <li key={i} className="truncate max-w-xs" title={factor}>
                              {factor.split(':')[0]}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-400 italic">No high-risk indicators detected</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
