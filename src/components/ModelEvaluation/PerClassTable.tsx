import React from 'react';
import { MultiClassMetrics } from '../../utils/evaluationMetrics';

interface PerClassTableProps {
  metrics: MultiClassMetrics;
}

export const PerClassTable: React.FC<PerClassTableProps> = ({ metrics }) => {
  const { perClass, macroPrecision, macroRecall, macroF1, weightedF1, accuracy } = metrics;
  const classes = Object.keys(perClass);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold font-serif text-slate-900">
            Per-Class Performance Metrics (Multi-Class Risk Breakdown)
          </h3>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Statistical precision, recall, and F1-score computed for each distinct risk category.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 font-sans">
              <th className="py-2.5 px-4">Risk Class</th>
              <th className="py-2.5 px-4 text-right">Support</th>
              <th className="py-2.5 px-4 text-right">TP</th>
              <th className="py-2.5 px-4 text-right">FP</th>
              <th className="py-2.5 px-4 text-right">FN</th>
              <th className="py-2.5 px-4 text-right">Precision</th>
              <th className="py-2.5 px-4 text-right">Recall (Sensitivity)</th>
              <th className="py-2.5 px-4 text-right">F1-Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {classes.map(cName => {
              const item = perClass[cName];
              const prec = (item.precision * 100).toFixed(1);
              const rec = (item.recall * 100).toFixed(1);
              const f1 = (item.f1Score * 100).toFixed(1);

              return (
                <tr key={cName} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 font-serif">
                    {item.className} Risk
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                    {item.support}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700">
                    {item.truePositive}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-700">
                    {item.falsePositive}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-rose-700">
                    {item.falseNegative}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-medium text-slate-900">
                    {prec}%
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-medium text-slate-900">
                    {rec}%
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                    {f1}%
                  </td>
                </tr>
              );
            })}

            {/* Macro Average Row */}
            <tr className="bg-slate-50/80 font-medium text-slate-900 border-t-2 border-slate-200">
              <td className="py-2.5 px-4 font-semibold">Macro Average</td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-600">—</td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-600">—</td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-600">—</td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-600">—</td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold">
                {(macroPrecision * 100).toFixed(1)}%
              </td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold">
                {(macroRecall * 100).toFixed(1)}%
              </td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                {(macroF1 * 100).toFixed(1)}%
              </td>
            </tr>

            {/* Weighted Average Row */}
            <tr className="bg-slate-100/60 font-medium text-slate-900">
              <td className="py-2.5 px-4 font-semibold">Weighted Average</td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-600">
                {Object.values(perClass).reduce((acc, curr) => acc + curr.support, 0)}
              </td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-600">—</td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-600">—</td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-600">—</td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold">—</td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums font-semibold">—</td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                {(weightedF1 * 100).toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
