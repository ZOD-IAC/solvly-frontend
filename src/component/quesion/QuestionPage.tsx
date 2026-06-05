'use client';
import React, { useEffect, useState, useMemo } from 'react';
import SearchFilterBar from '../common/Search';
import QuestionList from './QuestionList';
import InfoSidebar from './InfoSidebar';
import UserQuestionCard from './components/UserQuestionCard';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from '@/features/messageSlice';
import { Question } from '@/utils/contants/type';
import { getQuestionList } from '@/api/question';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

type QuestionsPageProps = {
  params: object;
};

const LIMIT = 15;

const QuestionsPage: React.FC<QuestionsPageProps> = ({ params }) => {
  const dispatch   = useDispatch();
  const router     = useRouter();
  const pathname   = usePathname();
  const searchParams = useSearchParams();

  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(false);

  // Single source of truth — read page from URL, not useState
  const currentPage = Math.max(1, Number(searchParams.get('page') || 1));
  const totalPages  = Math.ceil(total / LIMIT);

  const stableParams = useMemo(()=> params, [JSON.stringify(params)])

  // Re-fetch whenever any URL param changes (page, sort, title, tags, etc.)
  useEffect(() => {
    const fetchQuestionData = async () => {
      setLoading(true);
      try {
        // params already contains all searchParams including page
        const res = await getQuestionList(params);

        if (!res.ok) {
          dispatch(showMessage({ messageType: 'error', message: res?.message }));
          return;
        }

        setQuestions(res?.data?.questions || []);
        setTotal(res?.data?.total || 0);
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionData();
  }, [stableParams]); // params object changes whenever URL changes — covers page + all filters

  // Push new page into URL — SearchFilterBar and this share the same URL
  const goToPage = (p: number) => {
    const urlParams = new URLSearchParams(searchParams.toString());
    urlParams.set('page', String(p));
    router.push(`${pathname}?${urlParams.toString()}`);
  };

  // Windowed page numbers: [1, '...', 4, 5, 6, '...', 20]
  const pageNumbers = useMemo((): (number | '...')[] => {
    if (totalPages <= 1) return [];

    const delta  = 2;
    const range: (number | '...')[] = [];
    const start  = Math.max(2, currentPage - delta);
    const end    = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);
    if (start > 2) range.push('...');
    for (let i = start; i <= end; i++) range.push(i);
    if (end < totalPages - 1) range.push('...');
    if (totalPages > 1) range.push(totalPages);

    return range;
  }, [currentPage, totalPages]);

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>

          <UserQuestionCard isAuthenticated={isAuthenticated} user={user} />

          <main className='lg:col-span-6'>
            <div className='mb-6'>
              <h2 className='text-2xl font-bold text-slate-800 mb-2'>All Questions</h2>
              {/* Fix: show total from API, not current page slice length */}
              <p className='text-slate-600'>{total} questions</p>
            </div>

            <SearchFilterBar />

            <div className='mt-4'>
              {loading ? (
                <div className='flex justify-center py-16 text-slate-400 text-sm'>
                  Loading...
                </div>
              ) : (
                <QuestionList data={questions} />
              )}
            </div>

            {/* Dynamic pagination */}
            {totalPages > 1 && (
              <div className='mt-6 flex justify-center items-center gap-2'>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className='px-3 py-2 border border-slate-300 rounded-lg text-sm
                             hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed'
                >
                  Previous
                </button>

                {pageNumbers.map((num, idx) =>
                  num === '...' ? (
                    <span key={`ellipsis-${idx}`} className='px-2 text-slate-400 select-none'>
                      ...
                    </span>
                  ) : (
                    <button
                      key={num}
                      onClick={() => goToPage(num)}
                      disabled={loading}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === num
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {num}
                    </button>
                  )
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className='px-3 py-2 border border-slate-300 rounded-lg text-sm
                             hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed'
                >
                  Next
                </button>
              </div>
            )}
          </main>

          <aside className='lg:col-span-3 '>
            <InfoSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;