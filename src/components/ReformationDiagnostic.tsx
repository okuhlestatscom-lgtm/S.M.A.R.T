import React, { useState } from 'react';
import { Compass, ShieldCheck, AlertTriangle, ArrowRight, RotateCcw, CheckCircle, Download, BookOpen } from 'lucide-react';
import { ALIGNMENT_QUESTIONS, AlignmentQuestion } from '../data/smartData';

interface ReformationDiagnosticProps {
  onNavigateToTeaching: (category: string) => void;
  onNavigateToBook: () => void;
}

export const ReformationDiagnostic: React.FC<ReformationDiagnosticProps> = ({
  onNavigateToTeaching,
  onNavigateToBook,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { score: number; text: string; guidance: string }>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const question = ALIGNMENT_QUESTIONS[currentStep];

  const handleSelectOption = (score: number, text: string, guidance: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: { score, text, guidance },
    }));

    if (currentStep < ALIGNMENT_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr.score, 0);
  const maxPossible = ALIGNMENT_QUESTIONS.length * 2; // 10
  const percentage = Math.round((totalScore / maxPossible) * 100);

  const getAlignmentAssessment = () => {
    if (percentage >= 80) {
      return {
        tier: 'Apostolic Sound Alignment',
        color: 'text-emerald-400',
        bg: 'bg-emerald-950/40 border-emerald-700/60',
        verdict: 'Your ministry demonstrates mature structural alignment, clear fatherhood covering, doctrinal depth, and ethical guardrails. Continue reinforcing the secret altar to sustain the fire without compromise.',
      };
    } else if (percentage >= 50) {
      return {
        tier: 'Vulnerable to Ministry Delay Traps',
        color: 'text-amber-400',
        bg: 'bg-amber-950/40 border-amber-700/60',
        verdict: 'You possess genuine calling and zeal, but specific structural blindspots (such as weak accountability, financial informality, or shallow doctrine) are introducing friction and impending delays.',
      };
    } else {
      return {
        tier: 'High Risk: Critical Ministry Traps Active',
        color: 'text-rose-400',
        bg: 'bg-rose-950/40 border-rose-700/60',
        verdict: 'Urgent Reformation Required! Your ministry is walking through acute trap zones (lone-ranger isolation, sensationalism, or altar depletion) that have incapacitated many predecessors.',
      };
    }
  };

  const handleDownloadReport = () => {
    const reportText = `=====================================================
S.M.A.R.T - APOSTOLIC ALIGNMENT & MINISTRY TRAPS REPORT
Sound Ministry and Reformation Tools | Apostle Nicholas Abraham
=====================================================

ALIGNMENT SCORE: ${percentage}% (${totalScore} / ${maxPossible} Points)
VERDICT: ${getAlignmentAssessment().tier}
DIAGNOSIS SUMMARY:
${getAlignmentAssessment().verdict}

-----------------------------------------------------
DETAILED SECTION AUDIT:
${ALIGNMENT_QUESTIONS.map((q) => {
  const ans = answers[q.id];
  return `
[Area: ${q.area}]
Question: ${q.question}
Selected Response: ${ans ? ans.text : 'Unanswered'}
Apostolic Guidance: ${ans ? ans.guidance : ''}
`;
}).join('\n-----------------------------------------------------')}

=====================================================
PRESCRIPTIVE APOSTOLIC ACTION PLAN:
1. Obtain and study "Avoiding The Traps of Ministry Delay" by Apostle Nicholas Abraham.
2. Institute verified spiritual fatherhood covering before expanding public itineraries.
3. Establish independent trustees and strict financial checks.
4. Fuel the secret prayer altar daily (Leviticus 6:13).

Report generated on: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Apostolic_Alignment_Diagnostic_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-medium mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Interactive Fivefold Alignment Diagnostic</span>
        </div>
        <h2 className="text-3xl font-cinzel font-bold text-white">
          Apostolic Alignment & Traps Evaluation
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          An honest diagnostic tool for emerging apostles, prophets, pastors, and teachers to pinpoint blindspots, avoid ministry delay traps, and build on bedrock.
        </p>
      </div>

      {!isCompleted ? (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
            <span>
              Question <span className="text-amber-400 font-bold">{currentStep + 1}</span> of{' '}
              {ALIGNMENT_QUESTIONS.length}
            </span>
            <span>{Math.round(((currentStep + 1) / ALIGNMENT_QUESTIONS.length) * 100)}% Completed</span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full mb-8 overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / ALIGNMENT_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Area Kicker */}
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-2 font-mono">
            Focus Pillar: {question.area}
          </span>

          {/* Question Text */}
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-6 leading-snug">
            {question.question}
          </h3>

          {/* Options List */}
          <div className="space-y-3">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt.score, opt.text, opt.guidance)}
                className="w-full text-left p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-950 transition-all group flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full border border-slate-700 group-hover:border-amber-400 flex items-center justify-center shrink-0 text-xs font-mono text-slate-400 group-hover:text-amber-400">
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="text-sm text-slate-300 group-hover:text-white leading-relaxed">
                  {opt.text}
                </div>
              </button>
            ))}
          </div>

          {/* Step Controls */}
          {currentStep > 0 && (
            <div className="mt-8 pt-4 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Back to previous question
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Results View */
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Top Score Banner */}
          <div className={`p-6 rounded-xl border ${getAlignmentAssessment().bg}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  Diagnostic Result
                </span>
                <h3 className={`text-2xl font-cinzel font-bold mt-1 ${getAlignmentAssessment().color}`}>
                  {getAlignmentAssessment().tier}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-3xl font-cinzel font-bold text-white font-mono">
                  {percentage}%
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {totalScore} of {maxPossible} Alignment Points
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-200 mt-4 leading-relaxed border-t border-slate-800/80 pt-3">
              {getAlignmentAssessment().verdict}
            </p>
          </div>

          {/* Detailed Guidance List */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 font-mono">
              Apostolic Breakdown by Focus Pillar:
            </h4>
            
            {ALIGNMENT_QUESTIONS.map((q) => {
              const userAns = answers[q.id];
              return (
                <div key={q.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-300">{q.area}</span>
                    <span className="font-mono text-amber-400">Score: {userAns?.score} / 2</span>
                  </div>
                  <p className="text-xs text-slate-400 italic">"{userAns?.text}"</p>
                  <p className="text-xs text-amber-300/90 mt-2 font-medium">
                    ↳ Guidance: {userAns?.guidance}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Prescriptive Next Steps */}
          <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-700/40">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Recommended Immediate Reformation Steps
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Study Apostle Nicholas Abraham's monograph "The Anatomy of Ministry Delays" and review the sample chapters of "Avoiding The Traps of Ministry Delay" to install divine order into your ministry.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onNavigateToBook}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read "Avoiding The Traps" Book</span>
              </button>

              <button
                onClick={() => onNavigateToTeaching('Ministry Delay Traps')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <span>Listen to Delay Traps Audio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleDownloadReport}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs rounded-lg border border-amber-800/60 transition-colors flex items-center gap-1.5 ml-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Diagnostic Report</span>
              </button>
            </div>
          </div>

          {/* Reset button */}
          <div className="text-center pt-2">
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Diagnostic Assessment</span>
            </button>
          </div>

        </div>
      )}

    </section>
  );
};
