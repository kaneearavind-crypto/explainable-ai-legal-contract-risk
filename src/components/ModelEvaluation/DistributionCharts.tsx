import React from 'react';
import { FullEvaluationReport } from '../../utils/evaluationMetrics';

interface DistributionChartsProps {
  report: FullEvaluationReport;
}

export const DistributionCharts: React.FC<DistributionChartsProps> = ({ report }) => {
  const { classDistribution, predictedDistribution, validSamplesCount, samples } = report;

  // Binary counts
  const actualRisky = samples.filter(s => s.actualBinary === 'Risky').length;
  const actualNotRisky = samples.filter(s => s.actualBinary === 'Not Risky').length;
  const predRisky = samples.filter(s => s.predictedBinary === 'Risky').length;
  const predNotRisky = samples.filter(s => s.predictedBinary === 'Not Risky').length;

  const total = validSamplesCount || 1;

  // Multiclass classes present
  const allClasses = Array.from(
    new Set([...Object.keys(classDistribution), ...Object.keys(predictedDistribution)])
  ).sort();

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-5 space-y-6">
      <div>
        <h3 className="text-sm font-bold font-serif text-slate-900">
          Actual vs. Predicted Risk Category Distribution
        </h3>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          Comparison between ground-truth annotations and model predicted frequencies.
        </p>
      </div>

      {/* Binary Category Comparison Bars */}
      <div className="space-y-4">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Binary Label Comparison
        </div>

        <div className="space-y-3 font-sans text-xs">
          {/* Risky row */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-800">Risky Clauses</span>
              <span className="text-slate-500 font-mono">
                Actual: {actualRisky} ({( (actualRisky / total) * 100).toFixed(1)}%) · Predicted: {predRisky} ({( (predRisky / total) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-4 bg-slate-100 rounded-xs overflow-hidden flex items-center">
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${(actualRisky / total) * 100}%` }}
                ></div>
              </div>
              <div className="h-4 bg-slate-100 rounded-xs overflow-hidden flex items-center">
                <div
                  className="h-full bg-rose-600 transition-all duration-300"
                  style={{ width: `${(predRisky / total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Not Risky row */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-800">Not Risky Clauses</span>
              <span className="text-slate-500 font-mono">
                Actual: {actualNotRisky} ({( (actualNotRisky / total) * 100).toFixed(1)}%) · Predicted: {predNotRisky} ({( (predNotRisky / total) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-4 bg-slate-100 rounded-xs overflow-hidden flex items-center">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${(actualNotRisky / total) * 100}%` }}
                ></div>
              </div>
              <div className="h-4 bg-slate-100 rounded-xs overflow-hidden flex items-center">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${(predNotRisky / total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-slate-400 rounded-2xs inline-block"></span>
            <span>Left Bar: Ground Truth</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-slate-700 rounded-2xs inline-block"></span>
            <span>Right Bar: Model Prediction</span>
          </div>
        </div>
      </div>

      {/* Multi-Class Distribution */}
      {allClasses.length > 0 && (
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Per-Severity Distribution (Low / Medium / High)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {allClasses.map(cls => {
              const actualCount = classDistribution[cls] || 0;
              const predCount = predictedDistribution[cls] || 0;
              const actualPct = ((actualCount / total) * 100).toFixed(1);
              const predPct = ((predCount / total) * 100).toFixed(1);

              return (
                <div key={cls} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{cls} Risk</span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Act: {actualCount} · Pred: {predCount}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Ground Truth ({actualPct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-2xs overflow-hidden">
                      <div
                        className="h-full bg-slate-600"
                        style={{ width: `${actualPct}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Model Predicted ({predPct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-2xs overflow-hidden">
                      <div
                        className="h-full bg-slate-900"
                        style={{ width: `${predPct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
