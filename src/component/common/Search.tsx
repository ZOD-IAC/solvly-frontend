'use client';

import { Clock, Filter, Search, TrendingUp, X } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import DebounceSelect from './DebounceSelect';
import { getQuestionTags } from '@/api/question';
import { Tag } from '@/utils/contants/type';

const SearchFilterBar: React.FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Initialize state from URL params so filters survive refresh
  const [searchQuery, setSearchQuery] = useState(searchParams.get('title') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [tagInput, setTagInput] = useState<Tag[]>([]);
  const [hasAcceptedAnswer, setHasAcceptedAnswer] = useState(
    searchParams.get('hasAcceptedAnswer') === 'true'
  );
  const [noAnswers, setNoAnswers] = useState(
    searchParams.get('noAnswers') === 'true'
  );
  const [filterOpen, setFilterOpen] = useState(false);

  // Single function that updates ALL params at once
  const updateParams = useCallback(
    (overrides: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(overrides).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Always reset to page 1 when filters change
      params.set('page', '1');
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  // Debounce title search
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateParams({ title: searchQuery.trim() || null });
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Sync sort to URL immediately
  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateParams({ sort: value });
  };

  // Sync tags to URL
  const handleTagChange = (tags: Tag[]) => {
    setTagInput(tags);
    const tagIds = tags.map((t) => t._id).join(',');
    updateParams({ tags: tagIds || null });
  };

  // Sync checkboxes
  const handleAcceptedAnswer = (checked: boolean) => {
    setHasAcceptedAnswer(checked);
    // Mutually exclusive with noAnswers
    if (checked) setNoAnswers(false);
    updateParams({
      hasAcceptedAnswer: checked ? 'true' : null,
      noAnswers: checked ? null : searchParams.get('noAnswers'),
    });
  };

  const handleNoAnswers = (checked: boolean) => {
    setNoAnswers(checked);
    if (checked) setHasAcceptedAnswer(false);
    updateParams({
      noAnswers: checked ? 'true' : null,
      hasAcceptedAnswer: checked ? null : searchParams.get('hasAcceptedAnswer'),
    });
  };

  const fetchTags = async (query: string): Promise<Tag[]> => {
    const res = await getQuestionTags(query);
    const list: unknown[] = res?.data ?? [];
    return (list as Tag[]).filter((t) => !!t._id);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSortBy('newest');
    setTagInput([]);
    setHasAcceptedAnswer(false);
    setNoAnswers(false);
    router.replace(pathname);
  };

  const hasActiveFilters =
    searchQuery || sortBy !== 'newest' || tagInput.length || hasAcceptedAnswer || noAnswers;

  return (
    <div className='bg-white border-b border-slate-200 sticky top-0 z-10'>
      <div className='p-4 space-y-3'>

        {/* Search Bar */}
        <div className='relative'>
          <Search className='absolute left-3 top-3 w-5 h-5 text-slate-400' />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search questions...'
            className='w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-3 text-slate-400 hover:text-slate-600'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>

        {/* Sort and Filter Row */}
        <div className='flex items-center gap-3 flex-wrap'>
          <div className='flex items-center gap-2'>
            <label className='text-sm font-medium text-slate-700'>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className='px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='newest'>Newest</option>
              <option value='active'>Active</option>
              <option value='unanswered'>Unanswered</option>
              <option value='votes'>Most Voted</option>
              <option value='views'>Most Viewed</option>
            </select>
          </div>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-black text-sm hover:bg-slate-50 ${
              filterOpen ? 'border-blue-500 text-blue-600' : 'border-slate-300'
            }`}
          >
            <Filter className='w-4 h-4' />
            Filters
            {(tagInput.length > 0 || hasAcceptedAnswer || noAnswers) && (
              <span className='bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>
                {[tagInput.length > 0, hasAcceptedAnswer, noAnswers].filter(Boolean).length}
              </span>
            )}
          </button>

          <div className='flex gap-2 ml-auto'>
            <button
              onClick={() => handleSortChange('votes')}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm ${
                sortBy === 'votes' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <TrendingUp className='w-4 h-4' />
              Trending
            </button>
            <button
              onClick={() => handleSortChange('newest')}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm ${
                sortBy === 'newest' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Clock className='w-4 h-4' />
              Recent
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className='flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 hover:text-red-700'
              >
                <X className='w-4 h-4' />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className='p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4'>

            {/* Tag filter */}
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>
                Filter by tags
              </label>
              <DebounceSelect
                value={tagInput}
                onChange={handleTagChange}
                fetchTags={fetchTags}
                max={5}
                multiple
                allowCreateTag={false}
              />
            </div>

            {/* Answer filters */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-slate-700'>
                Answer status
              </label>
              <label className='flex items-center gap-2 text-sm cursor-pointer'>
                <input
                  type='checkbox'
                  checked={hasAcceptedAnswer}
                  onChange={(e) => handleAcceptedAnswer(e.target.checked)}
                  className='w-4 h-4 text-blue-600 rounded'
                />
                <span>Has accepted answer</span>
              </label>
              <label className='flex items-center gap-2 text-sm cursor-pointer'>
                <input
                  type='checkbox'
                  checked={noAnswers}
                  onChange={(e) => handleNoAnswers(e.target.checked)}
                  className='w-4 h-4 text-blue-600 rounded'
                />
                <span>No answers yet</span>
              </label>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilterBar;