import React, { useState, useMemo } from 'react';
import { BookOpen, Download, ShoppingBag, Check, Star, BookMarked, Eye, Bookmark, Heart, Truck, ExternalLink, Globe, Sparkles } from 'lucide-react';
import { Book } from '../data/smartData';

interface BooksSectionProps {
  books: Book[];
  bookmarkedIds?: string[];
  onReadBook: (book: Book) => void;
  onOrderBook: (book: Book) => void;
  onToggleBookmark?: (id: string) => void;
}

export const BooksSection: React.FC<BooksSectionProps> = ({
  books,
  bookmarkedIds = [],
  onReadBook,
  onOrderBook,
  onToggleBookmark,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [downloadSuccess, setDownloadSuccess] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: `All Books (${books.length})` },
    { id: 'online', label: 'Buy Online (Books2Read)' },
    { id: 'print', label: 'Print Copies (SA Courier)' },
    { id: 'Marketplace & Governance', label: 'Marketplace & Economics' },
    { id: 'Prayer & Intercession', label: 'Prayer & Intercession' },
    { id: 'Spiritual Warfare & Deliverance', label: 'Spiritual Warfare' },
  ];

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (activeCategory === 'all') return true;
      if (activeCategory === 'online') return Boolean(book.onlinePurchaseUrl);
      if (activeCategory === 'print') return Boolean(book.courierFee || book.price.startsWith('R'));
      return book.category === activeCategory;
    });
  }, [books, activeCategory]);

  const handleDownloadSample = (book: Book) => {
    const content = `=====================================================
S.M.A.R.T - SOUND MINISTRY AND REFORMATION TOOLS
The Smart Leaders Family Of Churches
BOOK EXCERPT & STUDY PREVIEW
=====================================================

TITLE: ${book.title}
SUBTITLE: ${book.subtitle}
AUTHOR: ${book.author}
PRICE: ${book.price} ${book.courierFee ? `(${book.courierFee})` : ''}
${book.onlinePurchaseUrl ? `ONLINE PURCHASE (Books2Read): ${book.onlinePurchaseUrl}` : ''}
${book.foreword ? `FOREWORD: ${book.foreword}` : ''}
${book.churchBuildingSupport ? `SPECIAL NOTE: ${book.churchBuildingSupport}` : ''}

-----------------------------------------------------
SYNOPSIS:
${book.synopsis}

-----------------------------------------------------
KEY TAKEAWAYS FOR LEADERS & BUILDERS:
${book.keyTakeaways.map((takeaway, idx) => `[0${idx + 1}] ${takeaway}`).join('\n')}

-----------------------------------------------------
SAMPLE CHAPTER:
${book.sampleChapters
  .map(
    (ch) => `
CHAPTER ${ch.number}: ${ch.title.toUpperCase()}
${ch.text.join('\n\n')}
`
  )
  .join('\n-----------------------------------------------------\n')}

=====================================================
Buy online via Books2Read or order direct courier:
Author: Apostle Nicholas Dlamini | S.M.A.R.T
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}_Sample.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess((prev) => ({ ...prev, [book.id]: true }));
    setTimeout(() => {
      setDownloadSuccess((prev) => ({ ...prev, [book.id]: false }));
    }, 3000);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              Apostolic Publications & Literature
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-amber-300 font-editorial italic">The Smart Leaders Family Of Churches</span>
          </div>
          <h2 className="text-3xl font-cinzel font-bold text-white mt-1">
            Books by Nicholas Dlamini
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Acquire authoritative kingdom literature for believers, corporate leaders, and fivefold ministers. Available online globally via Books2Read (Amazon Kindle, Apple Books, Kobo, Barnes & Noble) or direct physical courier in South Africa.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>Global Books2Read Links + Local SA Delivery</span>
        </div>
      </div>

      {/* Global Books2Read Information Banner */}
      <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-amber-950/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
            <ExternalLink className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Buy Online Across Global Bookstores via Books2Read
            </h4>
            <p className="text-xs text-slate-300">
              Universal links allow you to purchase directly in your local currency on your favorite digital reader: Amazon Kindle, Apple Books, Barnes & Noble, Kobo, Smashwords, and more.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono rounded-lg shrink-0">
          10+ Published Titles
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 text-xs font-medium">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="space-y-10">
        {filteredBooks.map((book) => {
          const isBookmarked = bookmarkedIds.includes(book.id);

          return (
            <div
              key={book.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-600/40 transition-all p-6 sm:p-8 shadow-xl shadow-black/30 relative"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Book Cover Presentation */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative group max-w-sm w-full">
                    <div className="relative rounded-lg overflow-hidden border border-amber-600/40 shadow-2xl shadow-amber-950/40 transition-transform duration-300 group-hover:scale-[1.02] bg-black">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-auto object-cover max-h-[440px] mx-auto"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {book.isBestseller && (
                      <div className="absolute -top-3 -right-3 px-3 py-1 bg-amber-500 text-slate-950 font-bold text-[11px] rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-slate-950" />
                        Apostolic Resource
                      </div>
                    )}
                  </div>
                </div>

                {/* Book Details */}
                <div className="lg:col-span-8 flex flex-col space-y-4">
                  
                  {/* Top Row: Price, Category, and Bookmark */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-cinzel font-bold text-amber-400 font-mono">
                        {book.price}
                      </span>
                      {book.courierFee && (
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          <Truck className="w-3 h-3 text-amber-500/80" />
                          <span>{book.courierFee}</span>
                        </span>
                      )}
                      {book.onlinePurchaseUrl && (
                        <span className="text-xs text-blue-300 font-mono bg-blue-950/60 px-2.5 py-1 rounded border border-blue-800/60 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-blue-400" />
                          <span>Books2Read Available</span>
                        </span>
                      )}
                    </div>

                    {/* Bookmark Toggle */}
                    {onToggleBookmark && (
                      <button
                        onClick={() => onToggleBookmark(book.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                          isBookmarked
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/50 font-semibold'
                            : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                        }`}
                        title={isBookmarked ? 'Saved to My Library' : 'Save to My Library'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                        <span>{isBookmarked ? 'Saved in My Library' : 'Bookmark'}</span>
                      </button>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white leading-tight">
                      {book.title}
                    </h3>
                    <p className="text-base text-amber-300 font-editorial italic mt-1">
                      {book.subtitle}
                    </p>
                  </div>

                  {/* Foreword / Publisher / Church Building Notice */}
                  {book.foreword && (
                    <div className="text-xs font-mono text-slate-400">
                      ★ {book.foreword}
                    </div>
                  )}

                  {book.churchBuildingSupport && (
                    <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-600/40 text-xs text-amber-200 flex items-start gap-2">
                      <Heart className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{book.churchBuildingSupport}</span>
                    </div>
                  )}

                  {/* Synopsis */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {book.synopsis}
                  </p>

                  {/* Key Takeaways */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-2 font-mono">
                      Core Revelations & Leadership Principles:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {book.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-mono font-bold">0{idx + 1}.</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Purchase & Reading Actions Strip */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    
                    {/* 1. Books2Read Online Universal Store Link */}
                    {book.onlinePurchaseUrl && (
                      <a
                        href={book.onlinePurchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-blue-950/40"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Buy Online (Books2Read)</span>
                      </a>
                    )}

                    {/* 2. Direct Order Form (South Africa print copies) */}
                    {(book.price.startsWith('R') || book.courierFee) && (
                      <button
                        onClick={() => onOrderBook(book)}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-amber-950/40"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Order Print Copy ({book.price})</span>
                      </button>
                    )}

                    {/* 3. Read Sample in App */}
                    <button
                      onClick={() => onReadBook(book)}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Read Sample Chapter</span>
                    </button>

                    {/* 4. Download Sample */}
                    <button
                      onClick={() => handleDownloadSample(book)}
                      className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-300 text-xs rounded-lg border border-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      {downloadSuccess[book.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Downloaded</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                          <span>Download Excerpt</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
