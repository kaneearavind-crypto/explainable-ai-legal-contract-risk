import React, { useState } from 'react';
import { Copy, Check, Split, AlignLeft, Eye } from 'lucide-react';

interface DiffViewerProps {
  originalText: string;
  proposedText: string;
  deletions?: string[];
  insertions?: string[];
  title?: string;
  defaultMode?: 'inline' | 'side-by-side' | 'clean';
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  originalText,
  proposedText,
  deletions = [],
  insertions = [],
  title,
  defaultMode = 'inline'
}) => {
  const [viewMode, setViewMode] = useState<'inline' | 'side-by-side' | 'clean'>(defaultMode);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render an inline track-changes representation
  const renderInlineDiff = () => {
    return (
      <div className="space-y-4 font-serif text-slate-800 leading-relaxed text-sm whitespace-pre-wrap">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded">
          <div className="text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Track Changes Markup
          </div>
          <p className="leading-7">
            {/* Show deleted parts with strikethrough and new parts */}
            <span className="block mb-3 text-slate-400 text-xs font-sans">
              [Original baseline removed:
              <span className="line-through bg-rose-50 text-rose-800 px-1 py-0.5 mx-1 font-serif text-sm">
                {originalText}
              </span>
              ]
            </span>
            <span className="font-serif text-slate-900 bg-emerald-50/50 p-2 rounded block border border-emerald-200/50">
              {proposedText}
            </span>
          </p>
        </div>

        {deletions.length > 0 && insertions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans pt-1">
            <div className="p-3 bg-rose-50/60 border border-rose-200 rounded">
              <div className="font-semibold text-rose-900 mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block"></span>
                <span>Striken / Problematic Terms</span>
              </div>
              <ul className="space-y-1 text-rose-800 list-disc list-inside">
                {deletions.map((d, i) => (
                  <li key={i} className="line-through">"{d}"</li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded">
              <div className="font-semibold text-emerald-900 mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                <span>Inserted Safeguards</span>
              </div>
              <ul className="space-y-1 text-emerald-800 list-disc list-inside">
                {insertions.map((ins, i) => (
                  <li key={i}>"{ins}"</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border border-slate-200 rounded bg-white overflow-hidden shadow-xs">
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          {title && <span className="font-medium text-xs text-slate-700">{title}</span>}
          <div className="flex items-center p-0.5 bg-slate-200/80 rounded text-xs font-sans">
            <button
              onClick={() => setViewMode('inline')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                viewMode === 'inline' ? 'bg-white text-slate-900 shadow-xs font-medium' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Markup Diff</span>
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                viewMode === 'side-by-side' ? 'bg-white text-slate-900 shadow-xs font-medium' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              onClick={() => setViewMode('clean')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                viewMode === 'clean' ? 'bg-white text-slate-900 shadow-xs font-medium' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Clean Text</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => handleCopy(viewMode === 'clean' ? proposedText : proposedText)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-2xs"
          title="Copy revised clause text"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Wording</span>
            </>
          )}
        </button>
      </div>

      {/* Content body */}
      <div className="p-4">
        {viewMode === 'inline' && renderInlineDiff()}

        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-rose-50/40 border border-rose-200/80 rounded flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
                    Original Illustrative Clause
                  </span>
                  <span className="text-xs text-rose-600 font-sans">High Risk</span>
                </div>
                <div className="font-serif text-sm text-slate-800 leading-relaxed italic whitespace-pre-wrap">
                  "{originalText}"
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-200 text-xs text-rose-700">
                Lacks necessary safeguards, bilateral protections, and standard market definitions.
              </div>
            </div>

            <div className="p-4 bg-emerald-50/40 border border-emerald-200/80 rounded flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                    Proposed Balanced Redline
                  </span>
                  <span className="text-xs text-emerald-700 font-sans">Commercial Standard</span>
                </div>
                <div className="font-serif text-sm text-slate-900 leading-relaxed whitespace-pre-wrap">
                  {proposedText}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-200 text-xs text-emerald-700">
                Incorporates industry cure periods, mutual warranties, and procedural guardrails.
              </div>
            </div>
          </div>
        )}

        {viewMode === 'clean' && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded">
            <div className="text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Ready-to-Insert Contract Provision
            </div>
            <pre className="font-serif text-sm text-slate-900 whitespace-pre-wrap leading-relaxed">
              {proposedText}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
