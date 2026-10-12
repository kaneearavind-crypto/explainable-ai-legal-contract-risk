import React from 'react';
import { BinaryMetrics, FullEvaluationReport } from '../../utils/evaluationMetrics';
import { CheckCircle2, XCircle, Target, Activity, Award, BarChart3 } from 'lucide-react';

interface EvaluationSummaryCardsProps {
  report: FullEvaluationReport;
}

export const EvaluationSummaryCards: React.FC<EvaluationSummaryCardsProps> = ({ report }) => {
  const { binaryMetrics, multiClassMetrics, validSamplesCount, correctPredictionsCount, incorrectPredictionsCount } = report;
  const accuracyPct = (binaryMetrics.accuracy * 100).toFixed(1);
  const precisionPct = (binaryMetrics.precision * 100).toFixed(1);
  const recallPct = (binaryMetrics.recall * 100).toFixed(1);
  const f1Pct = (binaryMetrics.f1Score * 100).toFixed(1);
  const correctPct = validSamplesCount > 0 ? ((correctPredictionsCount / validSamplesCount) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-4">
      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Evaluated */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <span className="text-xs text-slate-500 font-sans block">Evaluated Clauses</span>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {validSamplesCount}
          </div>
          <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
            100% ground-truth matched
          </span>
        </div>

        {/* Accuracy */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-sans block">Accuracy</span>
            <Target className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {accuracyPct}%
          </div>
          <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
            {correctPredictionsCount}/{validSamplesCount} correct ({correctPct}%)
          </span>
        </div>

        {/* Precision */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-sans block">Precision</span>
            <Award className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {precisionPct}%
          </div>
          <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
            TP / (TP + FP)
          </span>
        </div>

        {/* Recall / Sensitivity */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-sans block">Recall (Sensitivity)</span>
            <Activity className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {recallPct}%
          </div>
          <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
            TP / (TP + FN)
          </span>
        </div>

        {/* F1-Score */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-sans block">F1-Score</span>
            <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {f1Pct}%
          </div>
          <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
            Harmonic mean
          </span>
        </div>

        {/* Error Breakdown */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <span className="text-xs text-slate-500 font-sans block">Prediction Outcome</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold font-mono text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {correctPredictionsCount}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-bold font-mono text-rose-700 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              {incorrectPredictionsCount}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-sans block mt-0.5">
            {incorrectPredictionsCount === 0 ? 'Zero prediction errors' : `${incorrectPredictionsCount} misclassified`}
          </span>
        </div>
      </div>
    </div>
  );
};
