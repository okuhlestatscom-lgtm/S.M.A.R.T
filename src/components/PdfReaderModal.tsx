import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Circle, Download, Share2, BookOpen } from 'lucide-react';
import { Teaching } from '../data/smartData';

interface PdfReaderModalProps {
  teaching: Teaching | null;
  onClose: () => void;
}

export const PdfReaderModal: React.FC<PdfReaderModalProps> = ({
  teaching,
  onClose,
}) => {
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({});

  if (!teaching) return null;

  const pdf = teaching.pdfContent;

  const toggleChecklist = (idx: number) => {
    setCompletedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleDownloadPdf = () => {
    const text = `=====================================================
S.M.A.R.T - APOSTOLIC STUDY MONOGRAPH & OUTLINE
Sound Ministry and Reformation Tools
=====================================================

TITLE: ${teaching.title}
AUTHOR: ${teaching.author}
CATEGORY: ${teaching.category}
SCRIPTURES: ${teaching.scriptures.join(', ')}

-----------------------------------------------------
EXECUTIVE SUMMARY:
${pdf?.summary || teaching.description}

-----------------------------------------------------
CHAPTERS:
${pdf?.chapters
  .map(
    (ch) => `
[${ch.title.toUpperCase()}]
${ch.paragraphs.join('\n\n')}
`
  )
  .join('\n-----------------------------------------------------\n')}

-----------------------------------------------------
REFORMATION CHECKLIST FOR LOCAL LEADERS:
${pdf?.reformationChecklist
  .map((item, idx) => `[${completedItems[idx] ? 'X' : ' '}] ${item}`)
  .join('\n')}

=====================================================
Apostle Nicholas Abraham | S.M.A.R.T
`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${teaching.title.replace(/[^a-zA-Z0-9]/g, '_')}_Monograph.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#0e1420] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400">
                Apostolic Monograph & Ordination Study Guide
              </span>
              <h3 className="font-cinzel text-base font-bold text-white truncate max-w-md">
                {teaching.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Monograph</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono block mb-1">
              Executive Doctrinal Summary
            </span>
            <p className="text-sm text-slate-200 font-editorial italic leading-relaxed">
              "{pdf?.summary || teaching.description}"
            </p>
          </div>

          {/* Chapters */}
          {pdf?.chapters && pdf.chapters.length > 0 ? (
            <div className="space-y-6">
              {pdf.chapters.map((chapter, cIdx) => (
                <div key={cIdx} className="space-y-3">
                  <h4 className="font-cinzel text-lg font-bold text-white border-b border-slate-800 pb-2">
                    {chapter.title}
                  </h4>
                  <div className="space-y-3 font-editorial text-sm text-slate-300 leading-relaxed">
                    {chapter.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 font-editorial text-sm text-slate-300 leading-relaxed">
              <p>{teaching.description}</p>
            </div>
          )}

          {/* Reformation Checklist */}
          {pdf?.reformationChecklist && (
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono block">
                Reformation Audit Checklist for Pastors & Fivefold Leaders:
              </span>
              <div className="space-y-2">
                {pdf.reformationChecklist.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleChecklist(idx)}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 flex items-center gap-3 transition-colors text-xs text-slate-200"
                  >
                    {completedItems[idx] ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className={completedItems[idx] ? 'line-through text-slate-500' : ''}>
                      {item}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
