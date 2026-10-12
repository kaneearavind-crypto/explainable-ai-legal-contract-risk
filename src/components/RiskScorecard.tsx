import React from 'react';
import { ILLUSTRATIVE_CLAUSES } from '../data/contractClauses';
import { AlertOctagon, Scale, ShieldCheck, ArrowRight } from 'lucide-react';

interface RiskScorecardProps {
  onSelectClause: (clauseId: string) => void;
}

export const RiskScorecard: React.FC<RiskScorecardProps> = ({ onSelectClause }) => {
  return (
    <div className="space-y-8">
      {/* Top executive summary strip */}
      <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">
            Executive Legal Evaluation
          </div>
          <h2 className="text-2xl font-bold font-serif text-slate-900 tracking-tight">
            Illustrative Service Agreement: Risk Profile Assessment
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed font-sans">
            This illustrative draft exhibits <strong className="text-rose-900 font-semibold">extreme structural asymmetry</strong> and significant legal deficiencies. 
            Two clauses pose <strong className="text-rose-700 font-semibold">Critical</strong> existential threats (perpetual client lock-in with zero-notice vendor exit, and uninsurable strict-liability indemnification). 
            Signing this agreement without comprehensive redlining would leave the client exposed to immediate operational abandonment and uncapped financial liability.
          </p>
        </div>

        {/* High-level metrics row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-500 block">Total Analyzed Clauses</span>
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">5</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Core agreement sections</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Critical Exposure Items</span>
            <span className="text-2xl font-bold font-mono text-rose-700 tabular-nums">2</span>
            <span className="text-[11px] text-rose-600 block mt-0.5">Termination & Indemnity</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">High Risk Items</span>
            <span className="text-2xl font-bold font-mono text-amber-700 tabular-nums">1</span>
            <span className="text-[11px] text-amber-600 block mt-0.5">Unilateral Payment</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Ambiguity Gaps</span>
            <span className="text-2xl font-bold font-mono text-blue-700 tabular-nums">2</span>
            <span className="text-[11px] text-blue-600 block mt-0.5">Confidentiality & Forum</span>
          </div>
        </div>
      </div>

      {/* Clause-by-Clause Executive Risk Matrix */}
      <div className="border border-slate-200 rounded-lg bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Comparative Risk & Remedy Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side assessment of original flaws vs. balanced market remedies.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 font-sans">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-40">Clause & Category</th>
                <th className="py-3 px-4 w-32">Risk Severity</th>
                <th className="py-3 px-4 w-56">Drafting Ambiguity / Flaw</th>
                <th className="py-3 px-4 min-w-[240px]">Balanced Market Remedy</th>
                <th className="py-3 px-4 w-28 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {ILLUSTRATIVE_CLAUSES.map(clause => {
                const severityDotColor = 
                  clause.riskSeverity === 'Critical' ? 'bg-rose-600 text-rose-700' :
                  clause.riskSeverity === 'High' ? 'bg-amber-600 text-amber-700' : 'bg-blue-600 text-blue-700';

                return (
                  <tr key={clause.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-500 text-center">
                      0{clause.number}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block font-serif text-sm">
                        {clause.title}
                      </span>
                      <span className="text-[11px] text-slate-500">{clause.category}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className={`w-2 h-2 rounded-full ${severityDotColor.split(' ')[0]}`}></span>
                        <span className={severityDotColor.split(' ')[1]}>{clause.riskSeverity}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 leading-relaxed">
                      {clause.ambiguities[0]}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 leading-relaxed font-serif">
                      <span className="text-slate-900 font-sans font-medium text-[11px] block text-emerald-800">
                        Proposed Fix:
                      </span>
                      {clause.redlinePresets.balanced.description}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectClause(clause.id)}
                        className="inline-flex items-center gap-1 text-slate-900 hover:text-slate-600 font-medium transition-colors"
                      >
                        <span>Examine</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Synthesis Commentary & Counsel Advice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 border border-slate-200 rounded-lg bg-white space-y-2">
          <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
            <AlertOctagon className="w-4 h-4" />
            <span>1. Illusory Consideration</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            By reserving unilateral termination without notice for the provider while extinguishing all client termination rights, the contract risks being invalidated by courts as an unenforceable illusory promise under common contract law.
          </p>
        </div>

        <div className="p-5 border border-slate-200 rounded-lg bg-white space-y-2">
          <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm">
            <Scale className="w-4 h-4" />
            <span>2. Strict Liability Shift</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Indemnifying "all losses... regardless of cause" without third-party limitation or gross negligence carve-outs effectively converts the client into an insurer. Commercial liability insurance policies typically deny coverage for such voluntarily assumed liabilities.
          </p>
        </div>

        <div className="p-5 border border-slate-200 rounded-lg bg-white space-y-2">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>3. Procedural Vacuums</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Failing to define governing jurisdiction, invoice dispute timelines, or confidentiality survival leads to high-cost preliminary procedural litigation before substantive claims can ever be adjudicated.
          </p>
        </div>
      </div>
    </div>
  );
};
