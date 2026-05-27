'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, Users, TrendingUp, Search, Loader2, X } from 'lucide-react';
import Button from '../Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestionList } from '@/api/question';
import { showMessage } from '@/features/messageSlice';
import styles from '../../styles/LandingPage.module.css';
import Link from 'next/link';

/* ── Feature card data ──────────────────────────────────────── */
const FEATURES = [
  {
    icon: <MessageSquare className='w-6 h-6 text-blue-600' />,
    iconBg: 'bg-blue-100',
    title: 'Ask Questions',
    desc: 'Get help from experienced developers around the world. No question is too simple or complex.',
    delay: '0ms',
  },
  {
    icon: <Users className='w-6 h-6 text-green-600' />,
    iconBg: 'bg-green-100',
    title: 'Build Community',
    desc: 'Connect with developers, share your knowledge, and grow your professional network.',
    delay: '80ms',
  },
  {
    icon: <TrendingUp className='w-6 h-6 text-purple-600' />,
    iconBg: 'bg-purple-100',
    title: 'Level Up Skills',
    desc: 'Learn from real-world problems and solutions. Earn reputation and showcase your expertise.',
    delay: '160ms',
  },
] as const;

const STATS = [
  { value: '100M+', label: 'Questions & Answers' },
  { value: '50M+', label: 'Active Developers' },
  { value: '1M+', label: 'Daily Visitors' },
] as const;

const LandingPage = () => {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  const [questions, setQuestion] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* Scroll-reveal via IntersectionObserver */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('lp-visible');
          }
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.lp-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Debounced search — 350 ms */
  const handleSearchQuestion = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchQuery(val);

      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

      if (!val.trim()) {
        setQuestion([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await getQuestionList({ title: val });
          if (!res.ok) {
            dispatch(
              showMessage({
                messageType: 'error',
                message: res.message ?? 'Unable to fetch Question!',
              })
            );
            setQuestion([]);
            return;
          }
          if (!res?.questions?.length) {
            dispatch(showMessage({ messageType: 'info', message: res.message }));
            setQuestion([]);
            return;
          }
          setQuestion(res.questions);
        } catch (err) {
          console.warn(err, 'something went wrong!');
        } finally {
          setIsSearching(false);
        }
      }, 350);
    },
    [dispatch]
  );

  const clearSearch = () => {
    setSearchQuery('');
    setQuestion([]);
  };

  const showDropdown = isFocused && questions.length > 0;
  const showEmpty = isFocused && !!searchQuery && !isSearching && questions.length === 0;

  return (
    <div className={styles.page}>

      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='text-center max-w-3xl mx-auto'>

          <h1 className={`${styles.heroTitle} text-5xl md:text-5xl font-bold text-slate-900 mb-6`}>
            Every developer has a tab open to{' '}
            <span className='text-blue-600'>Solvly</span>
          </h1>

          <p className={`${styles.heroSub} text-l text-slate-600 mb-8`}>
            Join millions of developers getting answers to their coding
            questions, sharing knowledge, and building their careers.
          </p>

          <div className={`${styles.heroCta} flex flex-col sm:flex-row gap-4 justify-center`}>
            <Button variant='primary' size='lg' href='/register'>
              Join the Community
            </Button>
            <Button variant='outline' size='lg' href='/question'>
              Explore Questions
            </Button>
          </div>
        </div>
      </section>

      {/* ── Search Bar ────────────────────────────── */}
      <section className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20'>
        <div
          className={`${styles.heroSearch} ${styles.searchContainer}`}
          ref={searchContainerRef}
        >
          {/* Input row */}
          <div className={styles.searchWrap}>
            {isSearching ? (
              <Loader2 size={18} className={styles.spinIcon} />
            ) : (
              <Search size={18} className={styles.searchIcon} />
            )}

            <input
              className={styles.searchInput}
              value={searchQuery}
              onChange={handleSearchQuestion}
              onFocus={() => setIsFocused(true)}
              type='text'
              placeholder='Search questions…'
            />

            {searchQuery && !isSearching && (
              <button
                className={styles.clearBtn}
                onClick={clearSearch}
                aria-label='Clear search'
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Results dropdown */}
          {showDropdown && (
            <div className={styles.dropdown}>
              <ul className={styles.resultsList}>
                <li className={styles.resultsHeader}>
                  <span className={styles.resultsCount}>
                    {questions.length} result{questions.length !== 1 ? 's' : ''}
                  </span>
                  <span className={styles.resultsLabel}>Questions</span>
                </li>

                {questions.map((d: any) => (
                  <Link key={d._id} href={`/question/${d?._id}`}>
                    <li className={styles.resultItem}>
                      <Search size={13} className={styles.resultIcon} />
                      {d.title}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          )}

          {/* Empty state */}
          {showEmpty && (
            <div className={styles.dropdown}>
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>
                  No questions found for <strong>"{searchQuery}"</strong>
                </p>
                {isAuthenticated ?
                  (<Link href={`/profile/${user.id}/?tab=ask`} className={styles.emptyLink}>
                    Ask this question →
                  </Link>) : (<Link href='/register' className={styles.emptyLink}>
                    Regsiter to Ask this question →
                  </Link>)}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className='bg-slate-50 py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='lp-reveal text-3xl font-bold text-slate-900 text-center z-30 mb-12'>
            Why developers choose Solvly
          </h2>

          <div className='grid md:grid-cols-3 gap-8'>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`lp-reveal ${styles.card} bg-white p-8 rounded-xl shadow-sm`}
                style={{ transitionDelay: f.delay }}
              >
                <div className={`w-12 h-12 ${f.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className='text-xl font-bold text-slate-900 mb-2'>{f.title}</h3>
                <p className='text-slate-600'>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='lp-reveal grid md:grid-cols-3 gap-8 text-center'>
            {STATS.map((s, i) => (
              <div key={i} className='lp-stat'>
                <div className='text-4xl font-bold text-blue-600 mb-2'>{s.value}</div>
                <div className='text-slate-600'>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!isAuthenticated && (
        <section className='bg-white py-20'>
          <div className='lp-reveal max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center grid items-center justify-center'>
            <h2 className='text-4xl font-bold text-black mb-6'>
              Ready to join our community?
            </h2>
            <p className='text-xl text-blue-900 mb-8'>
              Start asking questions, sharing knowledge, and connecting with
              developers today.
            </p>
            <Button variant='secondary' size='md' href='/register'>
              Sign Up for Free
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;