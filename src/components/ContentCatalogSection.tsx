import React, { useState, useMemo } from 'react';
import {
  Teaching,
  Book,
  MainContentCategory,
  CONTENT_CATEGORIES,
  isTeachingInCategory,
  isBookInCategory,
  getCategoryTags
} from '../data/smartData';

interface ContentCatalogSectionProps {
  teachings: Teaching[];
  books: Book[];
  bookmarkedTeachingIds: string[];
  bookmarkedBookIds: string[];
  onToggleTeachingBookmark: (id: string) => void;
  onToggleBookBookmark: (id: string) => void;
  onPlayAudio: (teaching: Teaching) => void;
  onOpenVideo: (teaching: Teaching) => void;
  onOpenPdf: (teaching: Teaching) => void;
  onReadBook: (book: Book) => void;
  onOrderBook: (book: Book) => void;
  initialCategory?: MainContentCategory;
  initialTag?: string;
}

type CatalogUnifiedItem =
  | { itemType: 'teaching'; item: Teaching; categoryLabel: 'Teachings (PDF)' | 'Teachings (Audio)' | 'Teachings (Video)' }
  | { itemType: 'book'; item: Book; categoryLabel: 'Books' | 'Ebooks' };

export const ContentCatalogSection: React.FC<ContentCatalogSectionProps> = ({
  teachings,
  books,
  bookmarkedTeachingIds,
  bookmarkedBookIds,
  onToggleTeachingBookmark,
  onToggleBookBookmark,
  onPlayAudio,
  onOpenVideo,
  onOpenPdf,
  onReadBook,
  onOrderBook,
  initialCategory = 'All Resources',
  initialTag
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MainContentCategory>(initialCategory);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTag ? [initialTag] : []);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'title'>('popular');

  // Compute available tags for current active category
  const categoryTags = useMemo(() => {
    return getCategoryTags(selectedCategory, teachings, books);
  }, [selectedCategory, teachings, books]);

  // Handle toggling tags
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  // Build unified items pool for filtering
  const allUnifiedItems = useMemo<CatalogUnifiedItem[]>(() => {
    const list: CatalogUnifiedItem[] = [];

    // Add teachings
    teachings.forEach((teaching) => {
      let label: 'Teachings (PDF)' | 'Teachings (Audio)' | 'Teachings (Video)' = 'Teachings (Audio)';
      if (teaching.format === 'pdf') label = 'Teachings (PDF)';
      else if (teaching.format === 'video') label = 'Teachings (Video)';
      list.push({ itemType: 'teaching', item: teaching, categoryLabel: label });
    });

    // Add books (may appear under Books and/or Ebooks)
    books.forEach((book) => {
      if (isBookInCategory(book, 'Books')) {
        list.push({ itemType: 'book', item: book, categoryLabel: 'Books' });
      }
      if (isBookInCategory(book, 'Ebooks')) {
        list.push({ itemType: 'book', item: book, categoryLabel: 'Ebooks' });
      }
    });

    return list;
  }, [teachings, books]);

  // Filter items based on active category, selected tags, search query, and sort
  const filteredItems = useMemo(() => {
    let result = allUnifiedItems.filter((entry) => {
      // Category filter
      if (selectedCategory !== 'All Resources') {
        if (entry.categoryLabel !== selectedCategory) {
          return false;
        }
      }

      // Selected Tags filter (AND condition: must match all selected tags)
      if (selectedTags.length > 0) {
        const itemTags = (entry.item.tags || []).map((t) => t.toLowerCase());
        const hasAllTags = selectedTags.every((t) => itemTags.includes(t.toLowerCase()));
        if (!hasAllTags) return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const cleanTagQ = q.startsWith('#') ? q.slice(1) : q;

        if (entry.itemType === 'teaching') {
          const t = entry.item;
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchSubtitle = t.subtitle.toLowerCase().includes(q);
          const matchDesc = t.description.toLowerCase().includes(q);
          const matchScriptures = t.scriptures.some((s) => s.toLowerCase().includes(q));
          const matchTags = (t.tags || []).some((tag) =>
            tag.toLowerCase().includes(q) || tag.toLowerCase().includes(cleanTagQ)
          );
          if (!matchTitle && !matchSubtitle && !matchDesc && !matchScriptures && !matchTags) {
            return false;
          }
        } else {
          const b = entry.item;
          const matchTitle = b.title.toLowerCase().includes(q);
          const matchSubtitle = b.subtitle.toLowerCase().includes(q);
          const matchSynopsis = b.synopsis.toLowerCase().includes(q);
          const matchTheme = b.scriptureTheme?.toLowerCase().includes(q) || false;
          const matchTags = (b.tags || []).some((tag) =>
            tag.toLowerCase().includes(q) || tag.toLowerCase().includes(cleanTagQ)
          );
          if (!matchTitle && !matchSubtitle && !matchSynopsis && !matchTheme && !matchTags) {
            return false;
          }
        }
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'title') {
        const titleA = a.itemType === 'teaching' ? a.item.title : a.item.title;
        const titleB = b.itemType === 'teaching' ? b.item.title : b.item.title;
        return titleA.localeCompare(titleB);
      }
      if (sortBy === 'newest') {
        const dateA = a.itemType === 'teaching' ? a.item.date : a.item.publishYear;
        const dateB = b.itemType === 'teaching' ? b.item.date : b.item.publishYear;
        return dateB.localeCompare(dateA);
      }
      // 'popular'
      const popA = a.itemType === 'teaching' ? (a.item.listenCount || 0) + (a.item.downloadsCount || 0) : (a.item.isBestseller ? 5000 : 1000);
      const popB = b.itemType === 'teaching' ? (b.item.listenCount || 0) + (b.item.downloadsCount || 0) : (b.item.isBestseller ? 5000 : 1000);
      return popB - popA;
    });

    return result;
  }, [allUnifiedItems, selectedCategory, selectedTags, searchQuery, sortBy]);

  // Current category metadata
  const currentCategoryMeta = CONTENT_CATEGORIES.find((c) => c.id === selectedCategory) || CONTENT_CATEGORIES[0];

  // Helper count for badge counts on category tabs
  const getCategoryCount = (catId: MainContentCategory) => {
    if (catId === 'All Resources') {
      return teachings.length + books.length;
    }
    if (catId === 'Teachings (PDF)') {
      return teachings.filter((t) => t.format === 'pdf').length;
    }
    if (catId === 'Teachings (Audio)') {
      return teachings.filter((t) => t.format === 'audio').length;
    }
    if (catId === 'Teachings (Video)') {
      return teachings.filter((t) => t.format === 'video').length;
    }
    if (catId === 'Books') {
      return books.filter((b) => isBookInCategory(b, 'Books')).length;
    }
    if (catId === 'Ebooks') {
      return books.filter((b) => isBookInCategory(b, 'Ebooks')).length;
    }
    return 0;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/60 border border-amber-500/20 p-6 md:p-10 shadow-2xl">
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Apostolic Knowledge Vault & Taxonomy
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-100 tracking-tight leading-tight">
            Categorized Content & Theological Tags
          </h1>
          <p className="mt-3 text-stone-300 text-sm md:text-base leading-relaxed">
            Navigate the complete ministerial corpus of Apostle Nicholas Dlamini by designated media formats
            and thematic tags. Filter through sound audio sermons, YouTube masterclasses, downloadable study PDFs,
            physical print books, and digital universal ebooks.
          </p>
        </div>
      </div>

      {/* Primary Category Selector Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/90">
            Select Content Category
          </span>
          <span className="text-xs text-stone-400">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {CONTENT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = getCategoryCount(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  // clear tags if not matching new category
                  setSelectedTags([]);
                }}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all text-xs relative overflow-hidden group ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10 text-white font-medium'
                    : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-850'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`font-semibold text-xs tracking-tight ${isSelected ? 'text-amber-300' : 'text-stone-200'}`}>
                    {cat.label}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-stone-800 text-stone-400 group-hover:text-stone-300'
                    }`}
                  >
                    {count}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 line-clamp-2 leading-snug">
                  {cat.description}
                </p>
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Sort, and Tag Cloud Filter Panel */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 md:p-6 space-y-5 shadow-xl backdrop-blur-sm">
        {/* Search & Sort Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${selectedCategory} by title, scriptures, or #tags...`}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <label className="text-xs text-stone-400 whitespace-nowrap">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-950 border border-stone-800 text-stone-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500/60"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Category Tag Bar */}
        <div className="pt-2 border-t border-stone-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                Granular Tags in {selectedCategory}
              </span>
              <span className="text-[11px] text-stone-500">
                ({categoryTags.length} distinct tags)
              </span>
            </div>

            {selectedTags.length > 0 && (
              <button
                onClick={handleClearTags}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2 flex items-center gap-1"
              >
                <span>Clear {selectedTags.length} active tag filter{selectedTags.length > 1 ? 's' : ''}</span>
              </button>
            )}
          </div>

          {/* Tag Chips */}
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-800">
            {categoryTags.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-1">No tags registered in this specific category.</p>
            ) : (
              categoryTags.map(({ tag, count }) => {
                const isActive = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all ${
                      isActive
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-sm shadow-amber-500/20'
                        : 'bg-stone-950/80 border border-stone-800 text-stone-300 hover:border-amber-500/40 hover:text-amber-300'
                    }`}
                  >
                    <span>{tag}</span>
                    <span
                      className={`text-[10px] px-1 rounded-full ${
                        isActive ? 'bg-stone-950/20 text-stone-950' : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(selectedTags.length > 0 || searchQuery.trim() || selectedCategory !== 'All Resources') && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800/60 text-xs text-stone-400">
            <span className="font-medium text-stone-300">Active Criteria:</span>
            {selectedCategory !== 'All Resources' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-800 text-amber-300 border border-amber-500/20">
                Category: {selectedCategory}
              </span>
            )}
            {selectedTags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30"
              >
                {t}
                <button
                  onClick={() => handleToggleTag(t)}
                  className="hover:text-white ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-800 text-stone-200">
                Query: "{searchQuery.trim()}"
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory('All Resources');
                setSelectedTags([]);
                setSearchQuery('');
              }}
              className="text-stone-500 hover:text-amber-400 text-xs ml-auto underline"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Content Results Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-stone-900/40 rounded-2xl border border-stone-800 p-8">
          <svg className="w-12 h-12 mx-auto text-stone-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-serif font-bold text-stone-300">No Resources Match This Tag Criteria</h3>
          <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
            Try deselecting some tags or widening your search term to explore other apostolic tools in the library.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All Resources');
              setSelectedTags([]);
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-semibold text-xs hover:bg-amber-400 transition-colors"
          >
            Show All Resources
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((entry, index) => {
            const isBook = entry.itemType === 'book';
            const itemKey = isBook ? `book-${entry.item.id}-${entry.categoryLabel}` : `teaching-${entry.item.id}`;

            if (isBook) {
              const book = entry.item;
              const isBookmarked = bookmarkedBookIds.includes(book.id);
              const isEbookCategory = entry.categoryLabel === 'Ebooks';

              return (
                <div
                  key={itemKey}
                  className="bg-stone-900/90 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col group shadow-lg"
                >
                  {/* Card Cover & Badge Header */}
                  <div className="relative h-56 bg-stone-950 flex items-center justify-center p-4 overflow-hidden border-b border-stone-800/80">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full max-h-48 w-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Category Label Chip */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border backdrop-blur-md ${
                          isEbookCategory
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {isEbookCategory ? (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        )}
                        {entry.categoryLabel}
                      </span>
                    </div>

                    {/* Bookmark action */}
                    <button
                      onClick={() => onToggleBookBookmark(book.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
                        isBookmarked
                          ? 'bg-amber-500 text-stone-950 border-amber-400'
                          : 'bg-stone-900/80 text-stone-400 border-stone-700 hover:text-white'
                      }`}
                      title={isBookmarked ? 'Bookmarked in My Library' : 'Bookmark this Book'}
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] text-stone-400 mb-1">
                        <span>{book.author}</span>
                        <span className="font-mono">{book.pages} pages</span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-xs text-amber-400/90 font-medium line-clamp-1 mb-2">
                        {book.subtitle}
                      </p>

                      <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-3">
                        {book.synopsis}
                      </p>

                      {/* Tags Bar */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {(book.tags || []).slice(0, 4).map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleToggleTag(tag)}
                            className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                              selectedTags.includes(tag)
                                ? 'bg-amber-500 text-stone-950 font-bold'
                                : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-amber-300'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions & Price */}
                    <div className="pt-3 border-t border-stone-800/80">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-amber-300 font-mono">
                          {book.price}
                        </span>
                        {book.courierFee && !isEbookCategory && (
                          <span className="text-[10px] text-stone-400">
                            + {book.courierFee} courier
                          </span>
                        )}
                        {isEbookCategory && (
                          <span className="text-[10px] text-cyan-400 font-semibold">
                            Universal eBook Link
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onReadBook(book)}
                          className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Sample Chapters
                        </button>

                        {isEbookCategory && book.onlinePurchaseUrl ? (
                          <a
                            href={book.onlinePurchaseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-stone-950 text-xs font-bold transition-colors flex items-center justify-center gap-1 text-center"
                          >
                            <span>Books2Read</span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <button
                            onClick={() => onOrderBook(book)}
                            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                          >
                            <span>Order Print</span>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Teaching Card
            const teaching = entry.item;
            const isBookmarked = bookmarkedTeachingIds.includes(teaching.id);
            const isPdf = teaching.format === 'pdf';
            const isVideo = teaching.format === 'video';
            const isAudio = teaching.format === 'audio';

            return (
              <div
                key={itemKey}
                className="bg-stone-900/90 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col group shadow-lg"
              >
                {/* Visual Header */}
                <div
                  className={`relative h-44 p-4 flex flex-col justify-between overflow-hidden border-b border-stone-800/80 ${
                    isVideo
                      ? 'bg-gradient-to-br from-rose-950 via-stone-950 to-stone-900'
                      : isPdf
                      ? 'bg-gradient-to-br from-emerald-950 via-stone-950 to-stone-900'
                      : 'bg-gradient-to-br from-purple-950 via-stone-950 to-stone-900'
                  }`}
                >
                  <div className="flex items-center justify-between z-10">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border backdrop-blur-md ${
                        isVideo
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : isPdf
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      }`}
                    >
                      {isVideo && (
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                      )}
                      {isAudio && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                        </svg>
                      )}
                      {isPdf && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      {entry.categoryLabel}
                    </span>

                    <button
                      onClick={() => onToggleTeachingBookmark(teaching.id)}
                      className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                        isBookmarked
                          ? 'bg-amber-500 text-stone-950 border-amber-400'
                          : 'bg-stone-900/80 text-stone-400 border-stone-700 hover:text-white'
                      }`}
                      title={isBookmarked ? 'Bookmarked in My Library' : 'Bookmark this Teaching'}
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>

                  <div className="z-10 mt-auto">
                    <span className="text-[10px] text-amber-400/90 font-mono uppercase tracking-wider block mb-1">
                      {teaching.category}
                    </span>
                    <h4 className="text-sm font-serif font-bold text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-2">
                      {teaching.title}
                    </h4>
                  </div>

                  {/* Faint watermark icon */}
                  <div className="absolute right-2 bottom-2 text-stone-800/20 group-hover:text-stone-800/40 transition-colors pointer-events-none">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                      {isVideo ? (
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      ) : isPdf ? (
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      ) : (
                        <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                      )}
                    </svg>
                  </div>
                </div>

                {/* Body Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-400 mb-2">
                      <span>{teaching.author}</span>
                      <span className="font-mono text-amber-400/90">{teaching.duration}</span>
                    </div>

                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-3">
                      {teaching.description}
                    </p>

                    {/* Scriptures */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {teaching.scriptures.slice(0, 2).map((scripture) => (
                        <span
                          key={scripture}
                          className="text-[10px] px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-amber-300/80 font-mono"
                        >
                          {scripture}
                        </span>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(teaching.tags || []).slice(0, 4).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleToggleTag(tag)}
                          className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-amber-500 text-stone-950 font-bold'
                              : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-amber-300'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-stone-800/80">
                    {isVideo && (
                      <button
                        onClick={() => onOpenVideo(teaching)}
                        className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Watch Intense Word Session</span>
                      </button>
                    )}

                    {isAudio && (
                      <button
                        onClick={() => onPlayAudio(teaching)}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Listen Now (Sermon Player)</span>
                      </button>
                    )}

                    {isPdf && (
                      <button
                        onClick={() => onOpenPdf(teaching)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>Study PDF Monograph</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
