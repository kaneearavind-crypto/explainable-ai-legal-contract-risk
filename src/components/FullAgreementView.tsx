import React, { useState } from 'react';
import { ILLUSTRATIVE_CLAUSES } from '../data/contractClauses';
import { Copy, Check, Download, FileText, Split, Eye } from 'lucide-react';

export const FullAgreementView: React.FC = () => {
  const [viewFormat, setViewFormat] = useState<'side-by-side' | 'balanced-only' | 'original-only'>('side-by-side');
  const [copied, setCopied] = useState(false);

  const fullOriginalText = `ILLUSTRATIVE SERVICE AGREEMENT

1. Payment: The client shall pay the service provider for the services rendered. The payment deadline shall be determined by the service provider.

2. Termination: The service provider may terminate this agreement at any time without notice. The client shall not have the right to terminate this agreement.

3. Indemnity: The client shall be responsible for all losses, claims, damages, and expenses of any kind, regardless of their cause.

4. Confidentiality: The parties shall maintain the confidentiality of all confidential information. The agreement does not specify how long this obligation will continue.

5. Dispute Resolution: Any disputes arising under this agreement shall be resolved according to applicable law.`;

  const fullBalancedText = `BALANCED MASTER SERVICES AGREEMENT (REVISED)

1. Payment and Invoicing.
(a) Fees & Acceptance. Client shall pay Service Provider the agreed fees set forth in the applicable Statement of Work ("SOW") upon satisfactory completion and written acceptance of the designated deliverables within a fourteen (14) day inspection window.
(b) Invoicing & Terms. Service Provider shall issue monthly itemized invoices. Client shall pay all undisputed invoice amounts within thirty (30) calendar days of receipt of invoice ("Net 30").
(c) Invoice Disputes. In the event Client disputes any portion of an invoice in good faith, Client shall deliver written notice detailing the grounds within ten (10) business days of receipt. Client may withhold payment of only the disputed portion without penalty while paying all undisputed amounts.

2. Term and Termination.
(a) Termination for Convenience. Either party may terminate this Agreement without cause upon thirty (30) calendar days' prior written notice to the other party.
(b) Termination for Material Cause. Either party may terminate this Agreement immediately upon written notice if the other party: (i) commits a material breach of this Agreement and fails to cure such breach within thirty (30) calendar days of receiving written notice; or (ii) becomes insolvent or enters bankruptcy proceedings.
(c) Effect of Termination. Upon termination, Client shall pay Service Provider for conforming services performed through the effective date of termination. Service Provider shall promptly deliver to Client all completed and in-progress work product and proprietary materials.

3. Mutual Indemnification and Liability.
(a) Indemnification. Each party ("Indemnifying Party") shall defend, indemnify, and hold harmless the other party and its officers ("Indemnified Party") against third-party claims, liabilities, damages, and reasonable attorney's fees arising directly from: (i) the Indemnifying Party's gross negligence or willful misconduct; (ii) material breach of this Agreement; or (iii) infringement of third-party intellectual property rights by its deliverables or materials.
(b) Exceptions. Neither party shall indemnify the other to the extent any claim results from the Indemnified Party's own negligence or unauthorized modifications.
(c) Procedures. The Indemnified Party shall provide prompt written notice of any claim and grant the Indemnifying Party control of defense, provided no settlement admitting fault may be entered without prior written consent.
(d) Limitation of Liability. Except for IP infringement or gross negligence, each party's aggregate liability under this Agreement shall not exceed total fees paid or payable by Client in the twelve (12) months preceding the claim.

4. Confidentiality.
(a) Definition. "Confidential Information" means all non-public technical, commercial, or operational information disclosed by one party ("Discloser") to the other ("Recipient") that is marked as confidential or that reasonably should be understood as confidential.
(b) Standard of Care. Recipient shall protect Discloser's Confidential Information with the same degree of care it uses for its own confidential information, but no less than reasonable care, and shall not use or disclose it except to perform obligations under this Agreement.
(c) Exclusions. Confidentiality obligations do not apply to information that: (i) is publicly available without breach; (ii) was already known to Recipient; (iii) is independently developed; or (iv) is required to be disclosed by court order upon prompt notice to Discloser.
(d) Survival Term. These obligations shall survive for three (3) years following termination of this Agreement, provided that statutory trade secrets shall remain protected for as long as they qualify under applicable law.
(e) Return of Materials. Upon written request or agreement termination, Recipient shall promptly return or certify destruction of all Confidential Information.

5. Governing Law and Dispute Resolution.
(a) Governing Law. This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without giving effect to conflict of laws principles.
(b) Pre-Dispute Negotiation. Prior to initiating formal proceedings, the parties agree to make good-faith efforts to resolve any dispute through direct negotiations between designated senior executives for at least thirty (30) calendar days.
(c) Exclusive Jurisdiction. Any unresolved legal action or proceeding shall be instituted exclusively in the federal or state courts located in New Castle County, Delaware. Each party irrevocably submits to the personal jurisdiction and venue of such courts.
(d) Equitable Relief. Either party may seek emergency injunctive or equitable relief in any court of competent jurisdiction to restrain unauthorized use or disclosure of proprietary information or IP infringement.
(e) Attorney's Fees. In any action to enforce this Agreement, the prevailing party shall be entitled to recover reasonable attorney's fees and court costs.`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = `# Comparative Contract Analysis & Redline\n\n## 1. Original Illustrative Agreement\n\`\`\`\n${fullOriginalText}\n\`\`\`\n\n## 2. Balanced Revised Agreement\n\`\`\`\n${fullBalancedText}\n\`\`\`\n`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Balanced_Service_Agreement_Redline.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top action strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
        <div className="space-y-1">
          <h2 className="text-base font-bold font-serif text-slate-900">
            Full Agreement Document Synthesis
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            Complete comparison between the raw illustrative draft and the commercially balanced redline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded border border-slate-200 text-xs">
            <button
              onClick={() => setViewFormat('side-by-side')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                viewFormat === 'side-by-side' ? 'bg-white text-slate-900 shadow-xs font-medium' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              onClick={() => setViewFormat('balanced-only')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                viewFormat === 'balanced-only' ? 'bg-white text-slate-900 shadow-xs font-medium' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Balanced Only</span>
            </button>
            <button
              onClick={() => setViewFormat('original-only')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                viewFormat === 'original-only' ? 'bg-white text-slate-900 shadow-xs font-medium' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Original Draft</span>
            </button>
          </div>

          <button
            onClick={() => handleCopy(fullBalancedText)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Balanced Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .MD</span>
          </button>
        </div>
      </div>

      {/* Main comparison grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(viewFormat === 'side-by-side' || viewFormat === 'original-only') && (
          <div className="p-6 bg-white border border-rose-200/90 rounded-lg shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">
                  Original Illustrative Agreement
                </span>
                <span className="text-xs text-rose-500">Unilateral Discretion & Uncapped Risk</span>
              </div>
              <span className="text-xs font-mono text-slate-400">Baseline</span>
            </div>

            <pre className="font-serif text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
              {fullOriginalText}
            </pre>
          </div>
        )}

        {(viewFormat === 'side-by-side' || viewFormat === 'balanced-only') && (
          <div className="p-6 bg-white border border-emerald-200/90 rounded-lg shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                  Balanced Master Services Agreement
                </span>
                <span className="text-xs text-emerald-600">Standard Commercial Practice & Bilateral Protections</span>
              </div>
              <span className="text-xs font-mono text-emerald-700 font-medium">Standard</span>
            </div>

            <pre className="font-serif text-sm text-slate-900 whitespace-pre-wrap leading-relaxed">
              {fullBalancedText}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
