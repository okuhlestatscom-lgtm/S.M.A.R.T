import React, { useState } from 'react';
import { BookOpen, X, ChevronLeft, ChevronRight, Bookmark, Share2, Type, Sun, Moon } from 'lucide-react';
import { Book } from '../data/smartData';

interface EBookReaderModalProps {
  book: Book | null;
  onClose: () => void;
}

export const EBookReaderModal: React.FC<EBookReaderModalProps> = ({
  book,
  onClose,
}) => {
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'parchment' | 'sepia'>('dark');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copiedQuote, setCopiedQuote] = useState(false);

  if (!book) return null;

  const currentChapter = book.sampleChapters[currentChapterIdx] || book.sampleChapters[0];

  const themeStyles = {
    dark: 'bg-[#0b0f17] text-slate-200 border-slate-800',
    parchment: 'bg-[#faf8f5] text-stone-900 border-stone-300',
    sepia: 'bg-[#f4ecd8] text-[#5b4636] border-[#e2d5b5]',
  };

  const textStyles = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-loose',
    lg: 'text-lg leading-loose',
  };

  const handleShareQuote = () => {
    const textToCopy = `"${currentChapter.text[0]}" — from '${book.title}' by Nicholas Dlamini (S.M.A.R.T Ministry Tools)`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className={`w-full max-w-4xl h-[92vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${themeStyles[theme]}`}>
        
        {/* Top Reader Controls Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-inherit flex items-center justify-between gap-4 shrink-0">
          
          {/* Book Info */}
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-8 h-10 rounded object-cover shadow border border-inherit shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="truncate">
              <h3 className="font-cinzel text-sm font-bold truncate">
                {book.title}
              </h3>
              <p className="text-[11px] opacity-70 truncate font-mono">
                Chapter {currentChapter.number}: {currentChapter.title}
              </p>
            </div>
          </div>

          {/* Reader Preferences & Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Font Size Selector */}
            <div className="flex items-center rounded-lg border border-inherit p-0.5 text-xs">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 rounded ${fontSize === 'sm' ? 'bg-amber-500/20 font-bold' : ''}`}
                title="Small text"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 rounded ${fontSize === 'base' ? 'bg-amber-500/20 font-bold' : ''}`}
                title="Regular text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 rounded ${fontSize === 'lg' ? 'bg-amber-500/20 font-bold' : ''}`}
                title="Large text"
              >
                A+
              </button>
            </div>

            {/* Theme switcher */}
            <div className="flex items-center rounded-lg border border-inherit p-0.5 text-xs">
              <button
                onClick={() => setTheme('dark')}
                className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-slate-800 text-amber-400 font-bold' : ''}`}
                title="Obsidian Dark"
              >
                Dark
              </button>
              <button
                onClick={() => setTheme('parchment')}
                className={`px-2 py-1 rounded ${theme === 'parchment' ? 'bg-stone-300 font-bold' : ''}`}
                title="Warm Parchment"
              >
                Paper
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`px-2 py-1 rounded ${theme === 'sepia' ? 'bg-[#e2d5b5] font-bold' : ''}`}
                title="Sepia"
              >
                Sepia
              </button>
            </div>

            {/* Share quote */}
            <button
              onClick={handleShareQuote}
              className="p-1.5 rounded-lg border border-inherit hover:opacity-80 text-xs flex items-center gap-1"
              title="Copy quote excerpt"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedQuote && <span className="text-[10px] text-emerald-500">Copied</span>}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-inherit hover:opacity-80"
              aria-label="Close reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Reader Reading Canvas */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 flex justify-center">
          <div className="max-w-2xl w-full">
            
            {/* Header info */}
            <div className="text-center pb-8 border-b border-inherit mb-8">
              <span className="text-xs uppercase tracking-widest font-mono opacity-60">
                Apostolic Monograph Excerpt · Published {book.publishYear}
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold mt-2">
                Chapter {currentChapter.number}: {currentChapter.title}
              </h2>
              <div className="text-xs opacity-75 mt-1 font-editorial italic">
                By {book.author}
              </div>
            </div>

            {/* Paragraphs with editorial drop cap */}
            <div className={`space-y-6 font-editorial ${textStyles[fontSize]}`}>
              {currentChapter.text.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'first-letter:text-5xl first-letter:font-cinzel first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-amber-500'
                      : ''
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Footer of Chapter */}
            <div className="mt-12 pt-6 border-t border-inherit flex items-center justify-between text-xs">
              <span className="opacity-70 font-mono">
                {book.pages} pages total in full published volume
              </span>
              <span className="font-semibold text-amber-500">
                S.M.A.R.T Publications
              </span>
            </div>

          </div>
        </div>

        {/* Bottom Chapter Navigation Bar */}
        <div className="px-6 py-3 border-t border-inherit flex items-center justify-between bg-inherit/50 shrink-0">
          <button
            disabled={currentChapterIdx === 0}
            onClick={() => setCurrentChapterIdx((prev) => Math.max(0, prev - 1))}
            className="px-3 py-1.5 rounded-lg border border-inherit text-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Chapter</span>
          </button>

          <div className="text-xs font-mono opacity-80">
            Chapter {currentChapterIdx + 1} of {book.sampleChapters.length}
          </div>

          <button
            disabled={currentChapterIdx === book.sampleChapters.length - 1}
            onClick={() => setCurrentChapterIdx((prev) => Math.min(book.sampleChapters.length - 1, prev + 1))}
            className="px-3 py-1.5 rounded-lg border border-inherit text-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
          >
            <span>Next Chapter</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
