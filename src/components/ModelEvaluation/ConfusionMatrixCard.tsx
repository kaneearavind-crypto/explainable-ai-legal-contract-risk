import React, { useState } from 'react';
import { BinaryConfusionMatrix, MultiClassConfusionMatrix } from '../../utils/evaluationMetrics';
import { HelpCircle, Filter } from 'lucide-react';

interface ConfusionMatrixCardProps {
  binaryMatrix: BinaryConfusionMatrix;
  multiClassMatrix: MultiClassConfusionMatrix;
  onFilterCell?: (type: 'all' | 'tp' | 'tn' | 'fp' | 'fn') => void;
  activeFilter?: 'all' | 'tp' | 'tn' | 'fp' | 'fn';
}

export const ConfusionMatrixCard: React.FC<ConfusionMatrixCardProps> = ({
  binaryMatrix,
  multiClassMatrix,
  onFilterCell,
  activeFilter = 'all'
}) => {
  const [viewMode, setViewMode] = useState<'binary' | 'multiclass'>('binary');
  const { truePositive, trueNegative, falsePositive, falseNegative, total } = binaryMatrix;

  const tpPct = total > 0 ? ((truePositive / total) * 100).toFixed(1) : '0';
  const tnPct = total > 0 ? ((trueNegative / total) * 100).toFixed(1) : '0';
  const fpPct = total > 0 ? ((falsePositive / total) * 100).toFixed(1) : '0';
  const fnPct = total > 0 ? ((falseNegative / total) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      {/* Header with toggle */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
        <div>
          <h3 className="text-sm font-bold font-serif text-slate-900">
            Confusion Matrix
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Cross-tabulation of ground-truth annotations versus model predictions.
          </p>
        </div>

        <div className="flex items-center p-0.5 bg-slate-200/80 rounded text-xs font-sans">
          <button
            onClick={() => setViewMode('binary')}
            className={`px-3 py-1 rounded transition-colors ${
              viewMode === 'binary'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Binary (Risky / Not Risky)
          </button>
          <button
            onClick={() => setViewMode('multiclass')}
            className={`px-3 py-1 rounded transition-colors ${
              viewMode === 'multiclass'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Multi-Class (Low / Med / High)
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {viewMode === 'binary' ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse max-w-xl mx-auto text-xs">
                <thead>
                  <tr>
                    <th className="p-2"></th>
                    <th className="p-2"></th>
                    <th colSpan={2} className="p-2 pb-3 font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                      Predicted Risk Label
                    </th>
                  </tr>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="p-2"></th>
                    <th className="p-2"></th>
                    <th className="p-2.5 font-medium text-slate-800 bg-slate-50 w-44">Predicted: Risky</th>
                    <th className="p-2.5 font-medium text-slate-800 bg-slate-50 w-44">Predicted: Not Risky</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1: Actual Risky */}
                  <tr className="border-b border-slate-100">
                    <td rowSpan={2} className="p-2 font-semibold text-slate-700 uppercase tracking-wider -rotate-90 text-[11px] w-8">
                      Actual
                    </td>
                    <td className="p-2.5 font-medium text-slate-800 bg-slate-50 text-right pr-4">
                      Actual: Risky
                    </td>
                    {/* True Positive */}
                    <td
                      onClick={() => onFilterCell?.('tp')}
                      className={`p-4 border border-slate-200 cursor-pointer transition-colors ${
                        activeFilter === 'tp' ? 'ring-2 ring-emerald-600' : 'hover:bg-emerald-50/40'
                      } bg-emerald-50/20`}
                    >
                      <div className="text-xl font-bold font-mono text-emerald-800 tabular-nums">
                        {truePositive}
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">
                        True Positive (TP)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {tpPct}% of dataset
                      </span>
                    </td>
                    {/* False Negative */}
                    <td
                      onClick={() => onFilterCell?.('fn')}
                      className={`p-4 border border-slate-200 cursor-pointer transition-colors ${
                        activeFilter === 'fn' ? 'ring-2 ring-rose-600' : 'hover:bg-rose-50/40'
                      } ${falseNegative > 0 ? 'bg-rose-50/20' : 'bg-slate-50/30'}`}
                    >
                      <div className={`text-xl font-bold font-mono tabular-nums ${falseNegative > 0 ? 'text-rose-700' : 'text-slate-400'}`}>
                        {falseNegative}
                      </div>
                      <span className={`text-[11px] font-semibold block mt-0.5 ${falseNegative > 0 ? 'text-rose-700' : 'text-slate-500'}`}>
                        False Negative (FN)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Type II Error ({fnPct}%)
                      </span>
                    </td>
                  </tr>

                  {/* Row 2: Actual Not Risky */}
                  <tr>
                    <td className="p-2.5 font-medium text-slate-800 bg-slate-50 text-right pr-4">
                      Actual: Not Risky
                    </td>
                    {/* False Positive */}
                    <td
                      onClick={() => onFilterCell?.('fp')}
                      className={`p-4 border border-slate-200 cursor-pointer transition-colors ${
                        activeFilter === 'fp' ? 'ring-2 ring-amber-600' : 'hover:bg-amber-50/40'
                      } ${falsePositive > 0 ? 'bg-amber-50/20' : 'bg-slate-50/30'}`}
                    >
                      <div className={`text-xl font-bold font-mono tabular-nums ${falsePositive > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
                        {falsePositive}
                      </div>
                      <span className={`text-[11px] font-semibold block mt-0.5 ${falsePositive > 0 ? 'text-amber-700' : 'text-slate-500'}`}>
                        False Positive (FP)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Type I Error ({fpPct}%)
                      </span>
                    </td>
                    {/* True Negative */}
                    <td
                      onClick={() => onFilterCell?.('tn')}
                      className={`p-4 border border-slate-200 cursor-pointer transition-colors ${
                        activeFilter === 'tn' ? 'ring-2 ring-emerald-600' : 'hover:bg-emerald-50/40'
                      } bg-emerald-50/20`}
                    >
                      <div className="text-xl font-bold font-mono text-emerald-800 tabular-nums">
                        {trueNegative}
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">
                        True Negative (TN)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {tnPct}% of dataset
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>Diagonal indicates accurate classifications ({truePositive + trueNegative} clauses).</span>
              </span>
              {onFilterCell && (
                <button
                  onClick={() => onFilterCell('all')}
                  className={`text-slate-700 hover:text-slate-900 underline font-medium ${
                    activeFilter !== 'all' ? 'text-slate-900 font-semibold' : ''
                  }`}
                >
                  {activeFilter === 'all' ? 'Showing all rows' : 'Reset filter to show all rows'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse max-w-2xl mx-auto text-xs">
                <thead>
                  <tr>
                    <th className="p-2"></th>
                    <th className="p-2"></th>
                    <th colSpan={multiClassMatrix.classes.length} className="p-2 pb-3 font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                      Predicted Risk Severity
                    </th>
                  </tr>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="p-2"></th>
                    <th className="p-2"></th>
                    {multiClassMatrix.classes.map(c => (
                      <th key={c} className="p-2.5 font-medium text-slate-800 bg-slate-50 min-w-[100px]">
                        Pred: {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {multiClassMatrix.classes.map((actualClass, rowIdx) => (
                    <tr key={actualClass} className="border-b border-slate-100">
                      {rowIdx === 0 && (
                        <td
                          rowSpan={multiClassMatrix.classes.length}
                          className="p-2 font-semibold text-slate-700 uppercase tracking-wider -rotate-90 text-[11px] w-8"
                        >
                          Actual
                        </td>
                      )}
                      <td className="p-2.5 font-medium text-slate-800 bg-slate-50 text-right pr-4">
                        Actual: {actualClass}
                      </td>
                      {multiClassMatrix.classes.map((predClass, colIdx) => {
                        const count = multiClassMatrix.matrix[rowIdx][colIdx];
                        const isDiagonal = rowIdx === colIdx;
                        return (
                          <td
                            key={predClass}
                            className={`p-3.5 border border-slate-200 ${
                              isDiagonal
                                ? 'bg-emerald-50/30 text-emerald-900 font-bold'
                                : count > 0
                                ? 'bg-rose-50/20 text-rose-800 font-medium'
                                : 'text-slate-400'
                            }`}
                          >
                            <span className="text-base font-mono tabular-nums">{count}</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Multi-class breakdown tracking severity level transitions (e.g. Medium risk predicted as High).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
