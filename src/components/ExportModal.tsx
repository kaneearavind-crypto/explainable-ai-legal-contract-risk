import React, { useState } from 'react';
import { ILLUSTRATIVE_CLAUSES } from '../data/contractClauses';
import { X, Copy, Check, Download, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [exportType, setExportType] = useState<'markdown' | 'clean' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdownReport = () => {
    let md = `# Legal Analysis & Redline Audit: Illustrative Service Agreement\n\n`;
    md += `**Date:** October 12, 2026\n`;
    md += `**Document Type:** Commercial Service Agreement (Illustrative)\n`;
    md += `**Status:** Comprehensive Redline & Risk Review\n\n`;
    md += `---\n\n`;

    ILLUSTRATIVE_CLAUSES.forEach(clause => {
      md += `## Clause ${clause.number}: ${clause.title} (${clause.riskSeverity} Risk)\n\n`;
      md += `### Original Draft Text\n> "${clause.originalText}"\n\n`;
      md += `### Risk Summary\n${clause.riskSummary}\n\n`;
      md += `### Identified Ambiguities & Drafting Gaps\n`;
      clause.ambiguities.forEach(amb => {
        md += `- ${amb}\n`;
      });
      md += `\n### Party Risk Exposure\n`;
      md += `**Client Impact:**\n`;
      clause.partyRisks.client.forEach(r => (md += `  - ${r}\n`));
      md += `**Service Provider Impact:**\n`;
      clause.partyRisks.provider.forEach(r => (md += `  - ${r}\n`));
      md += `\n### Proposed Balanced Wording\n\`\`\`\n${clause.balancedRedline}\n\`\`\`\n\n`;
      md += `### Tactical Negotiation Talking Point\n*${clause.negotiationPoints.clientPosition}*\n\n`;
      md += `---\n\n`;
    });

    return md;
  };

  const generateCleanAgreement = () => {
    let text = `MASTER SERVICES AGREEMENT (BALANCED REVISED DRAFT)\n\n`;
    ILLUSTRATIVE_CLAUSES.forEach(clause => {
      text += `${clause.balancedRedline}\n\n`;
    });
    return text;
  };

  const generateJsonData = () => {
    return JSON.stringify(ILLUSTRATIVE_CLAUSES, null, 2);
  };

  const getContent = () => {
    if (exportType === 'markdown') return generateMarkdownReport();
    if (exportType === 'clean') return generateCleanAgreement();
    return generateJsonData();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getContent();
    const ext = exportType === 'markdown' ? 'md' : exportType === 'clean' ? 'txt' : 'json';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Contract_Analysis_${exportType}.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 font-serif">
              Export Legal Analysis & Redlines
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selectors */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 text-xs bg-white">
          <span className="font-medium text-slate-600">Export Format:</span>
          <div className="flex items-center p-0.5 bg-slate-100 rounded border border-slate-200">
            <button
              onClick={() => setExportType('markdown')}
              className={`px-3 py-1 rounded transition-colors ${
                exportType === 'markdown' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
              }`}
            >
              Full Markdown Audit
            </button>
            <button
              onClick={() => setExportType('clean')}
              className={`px-3 py-1 rounded transition-colors ${
                exportType === 'clean' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
              }`}
            >
              Clean Agreement Text
            </button>
            <button
              onClick={() => setExportType('json')}
              className={`px-3 py-1 rounded transition-colors ${
                exportType === 'json' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
              }`}
            >
              Raw JSON Data
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-4 overflow-y-auto flex-1 font-mono text-xs bg-slate-50 text-slate-800">
          <pre className="whitespace-pre-wrap leading-relaxed">
            {getContent()}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Ready for counsel review, negotiation redlines, or client briefing.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
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
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
