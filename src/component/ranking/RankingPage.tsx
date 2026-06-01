'use client';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Star,
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  Filter,
  Calendar,
  Target,
  Zap,
  Crown,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { showMessage } from '@/features/messageSlice';
import { getUsersByRanking } from '@/api/user';
import { UserProfile } from '@/utils/contants/type';

type RankingPeriod = 'weekly' | 'monthly' | 'yearly' | 'alltime';
type RankingCategory = 'reputation' | 'answers' | 'questions' | 'accepted';

// ============================================
// FILE: components/ranking/RankingHeader.tsx
// ============================================
const RankingHeader: React.FC = () => {
  return (
    <div className='bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-center gap-3 mb-4'>
          <Trophy className='w-12 h-12' />
          <h1 className='text-4xl md:text-5xl font-bold'>Community Rankings</h1>
        </div>
        <p className='text-center text-xl text-amber-50 max-w-2xl mx-auto'>
          Recognizing our top contributors who make Solvly an amazing
          community
        </p>
      </div>
    </div>
  );
};

// ============================================
// FILE: components/ranking/FilterBar.tsx
// ============================================
interface FilterBarProps {
  period?: RankingPeriod;
  category: RankingCategory;
  onPeriodChange?: (period: RankingPeriod) => void;
  onCategoryChange: (category: RankingCategory) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  // period,
  category,
  // onPeriodChange,
  onCategoryChange,
}) => {
  return (
    <div className='bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
          {/* Period Filter */}
          {/* <div className='flex items-center gap-2 flex-wrap'>
            <span className='text-sm font-medium text-slate-700 flex items-center gap-2'>
              <Calendar className='w-4 h-4' />
              Period:
            </span>
            <div className='flex gap-2'>
              {(
                ['weekly', 'monthly', 'yearly', 'alltime'] as RankingPeriod[]
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => onPeriodChange(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                  {p === 'alltime'
                    ? 'All Time'
                    : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div> */}

          {/* Category Filter */}
          <div className='flex items-center gap-2 flex-wrap'>
            <span className='text-sm font-medium text-slate-700 flex items-center gap-2'>
              <Filter className='w-4 h-4' />
              Rank by:
            </span>
            <select
              value={category}
              onChange={(e) =>
                onCategoryChange(e.target.value as RankingCategory)
              }
              className='px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='reputation'>Reputation</option>
              <option value='answers'>Total Answers</option>
              <option value='questions'>Total Questions</option>
              <option value='accepted'>Accepted Answers</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// FILE: components/ranking/TopThreeCard.tsx
// ============================================
interface TopThreeCardProps {
  user: UserProfile;
  position: 1 | 2 | 3;
}

const TopThreeCard: React.FC<TopThreeCardProps> = ({ user, position }) => {
  const colors = {
    1: {
      bg: 'from-amber-400 to-yellow-600',
      badge: 'bg-amber-500',
      text: 'text-amber-600',
    },
    2: {
      bg: 'from-slate-300 to-slate-600',
      badge: 'bg-slate-400',
      text: 'text-slate-600',
    },
    3: {
      bg: 'from-orange-300 to-orange-600',
      badge: 'bg-orange-400',
      text: 'text-orange-600',
    },
  };

  const icons = {
    1: <Crown className='w-8 h-8 text-amber-500' />,
    2: <Medal className='w-8 h-8 text-slate-500' />,
    3: <Award className='w-8 h-8 text-orange-500' />,
  };

  return (
    <div
      className={`relative`}
    >
      <div className='bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden hover:shadow-xl transition-shadow text-sha'>
        {/* Rank Badge */}
        <div
          className={`absolute top-4 left-4 w-12 h-12 bg-linear-to-br ${colors[position].bg} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10`}
        >
          {position}
        </div>

        {/* Icon Badge */}
        <div className='absolute top-4 right-4 z-10'>{icons[position]}</div>

        {/* Avatar */}
        <div className='pt-16 pb-6 px-6 text-center bg-linear-to-br from-slate-50 to-white'>
          <div
            className={`w-24 h-24 bg-linear-to-br ${colors[position].bg} rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg ring-4 ring-white`}
          >
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <h3 className='text-xl font-bold text-slate-900 mb-1'>{user.name}</h3>
          <p className='text-slate-500 text-sm mb-2'>@{user.email}</p>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors[position].bg} bg-linear-to-r text-white font-bold text-lg shadow-sm`}
          >
            <Star className='w-5 h-5' />
            {user.reputation.toLocaleString()}
          </div>
        </div>

        {/* Stats */}
        <div className='px-6 pb-6 grid grid-cols-3 gap-3'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-slate-900'>
              {user.stats.questions}
            </div>
            <div className='text-xs text-slate-500'>Questions</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-slate-900'>
              {user.stats.answers}
            </div>
            <div className='text-xs text-slate-500'>Answers</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-green-600'>
              {user.stats.accepted}
            </div>
            <div className='text-xs text-slate-500'>Accepted</div>
          </div>
        </div>

        {/* Badges */}
        <div className='px-6 pb-6 flex justify-center gap-4 border-t border-slate-100 pt-4'>
          <div className='flex items-center gap-1'>
            <div className='w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center'>
              <Award className='w-4 h-4 text-white' />
            </div>
            <span className='text-sm font-semibold text-slate-700'>
              {user?.badges?.gold || 50}
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center'>
              <Award className='w-4 h-4 text-white' />
            </div>
            <span className='text-sm font-semibold text-slate-700'>
              {user?.badges?.silver || 150}
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center'>
              <Award className='w-4 h-4 text-white' />
            </div>
            <span className='text-sm font-semibold text-slate-700'>
              {user?.badges?.bronze || 200}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// FILE: components/ranking/UserRankCard.tsx
// ============================================
interface UserRankCardProps {
  user: UserProfile;
}

const UserRankCard: React.FC<UserRankCardProps> = ({ user }) => {
  const getRankColor = (rank: number) => {
    if (rank <= 3) return 'text-amber-600 font-bold';
    if (rank <= 10) return 'text-blue-600 font-semibold';
    return 'text-slate-600';
  };

  return (
    <div className='bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-all hover:border-blue-300'>
      <div className='flex items-center gap-4'>
        {/* Rank change will be integrate later*/}
        {/* <div className='flex flex-col items-center min-w-15'>
          <span className={`text-2xl ${getRankColor(user.rank)}`}>
            #{user.rank}
          </span>
          {user.rankChange !== 'same' && (
            <div
              className={`flex items-center gap-1 text-xs ${user.rankChange === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
            >
              {user.rankChange === 'up' ? (
                <ChevronUp className='w-3 h-3' />
              ) : (
                <ChevronDown className='w-3 h-3' />
              )}
              {user.rankChangeValue}
            </div>
          )}
        </div> */}

        {/* Avatar */}
        <div className='w-14 h-14 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0'>
          {user.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>

        {/* User Info */}
        <div className='flex-1 min-w-0'>
          <h3 className='text-lg font-semibold text-slate-900 truncate'>
            {user.name}
          </h3>
          <p className='text-sm text-slate-500'>@{user.email}</p>
          <p className='text-xs text-slate-400'>location : {user.location != '' ? user.location : "this universe"}</p>
        </div>

        {/* Reputation */}
        <div className='text-right'>
          <div className='flex items-center gap-2 justify-end mb-1'>
            <Star className='w-5 h-5 text-amber-500' />
            <span className='text-xl font-bold text-slate-900'>
              {user.reputation.toLocaleString()}
            </span>
          </div>
          <p className='text-xs text-slate-500'>reputation</p>
        </div>

        {/* Stats */}
        <div className='hidden lg:flex gap-6 px-6 border-l border-slate-200'>
          <div className='text-center'>
            <div className='flex items-center gap-1 text-slate-700 mb-1'>
              <MessageSquare className='w-4 h-4' />
              <span className='font-semibold'>{user.stats.questions}</span>
            </div>
            <p className='text-xs text-slate-500'>Questions</p>
          </div>
          <div className='text-center'>
            <div className='flex items-center gap-1 text-slate-700 mb-1'>
              <ThumbsUp className='w-4 h-4' />
              <span className='font-semibold'>{user.stats.answers}</span>
            </div>
            <p className='text-xs text-slate-500'>Answers</p>
          </div>
          <div className='text-center'>
            <div className='flex items-center gap-1 text-green-600 mb-1'>
              <CheckCircle className='w-4 h-4' />
              <span className='font-semibold'>{user.stats.accepted}</span>
            </div>
            <p className='text-xs text-slate-500'>Accepted</p>
          </div>
        </div>

        {/* Badges */}
        <div className='hidden md:flex gap-3 items-center'>
          <div className='flex items-center gap-1'>
            <div className='w-5 h-5 bg-amber-500 rounded-full'></div>
            <span className='text-sm font-semibold'>{user?.badges?.gold || 50}</span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-5 h-5 bg-slate-400 rounded-full'></div>
            <span className='text-sm font-semibold'>{user?.badges?.silver || 15}</span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-5 h-5 bg-orange-600 rounded-full'></div>
            <span className='text-sm font-semibold'>{user?.badges?.bronze || 25}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// FILE: components/ranking/StatsSidebar.tsx
// ============================================
const StatsSidebar: React.FC = () => {
  return (
    <div className='space-y-4'>
      {/* Ranking Info */}
      <div className='bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6'>
        <h3 className='font-semibold text-slate-900 mb-4 flex items-center gap-2'>
          <Target className='w-5 h-5 text-blue-600' />
          How Rankings Work
        </h3>
        <div className='space-y-3 text-sm text-slate-600'>
          <p>Rankings are based on reputation points earned through:</p>
          <ul className='space-y-2 ml-4'>
            <li className='flex items-start gap-2'>
              <Zap className='w-4 h-4 text-amber-500 mt-0.5 shrink-0' />
              <span>Asking quality questions</span>
            </li>
            <li className='flex items-start gap-2'>
              <Zap className='w-4 h-4 text-green-500 mt-0.5 shrink-0' />
              <span>Providing helpful answers</span>
            </li>
            <li className='flex items-start gap-2'>
              <Zap className='w-4 h-4 text-blue-500 mt-0.5 shrink-0' />
              <span>Getting upvotes and accepted answers</span>
            </li>
            <li className='flex items-start gap-2'>
              <Zap className='w-4 h-4 text-purple-500 mt-0.5 shrink-0' />
              <span>Contributing to the community</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Badge Legend */}
      <div className='bg-white border border-slate-200 rounded-lg p-6'>
        <h3 className='font-semibold text-slate-900 mb-4 flex items-center gap-2'>
          <Award className='w-5 h-5 text-amber-500' />
          Badge System
        </h3>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 bg-amber-500 rounded-full'></div>
              <span className='text-sm font-medium text-slate-700'>Gold</span>
            </div>
            <span className='text-xs text-slate-500'>
              Outstanding contributions
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 bg-slate-400 rounded-full'></div>
              <span className='text-sm font-medium text-slate-700'>Silver</span>
            </div>
            <span className='text-xs text-slate-500'>Notable achievements</span>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 bg-orange-600 rounded-full'></div>
              <span className='text-sm font-medium text-slate-700'>Bronze</span>
            </div>
            <span className='text-xs text-slate-500'>First milestones</span>
          </div>
        </div>
      </div>

      {/* Trending This Week */}
      <div className='bg-white border border-slate-200 rounded-lg p-6'>
        <h3 className='font-semibold text-slate-900 mb-4 flex items-center gap-2'>
          <TrendingUp className='w-5 h-5 text-green-600' />
          Rising Stars
        </h3>
        <div className='space-y-3'>
          {[
            { name: 'Alex Chen', gain: '+450 pts' },
            { name: 'Maria Garcia', gain: '+392 pts' },
            { name: 'Ryan Park', gain: '+367 pts' },
          ].map((user, i) => (
            <div key={i} className='flex items-center justify-between text-sm'>
              <span className='text-slate-700 font-medium'>{user.name}</span>
              <span className='text-green-600 font-semibold'>{user.gain}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// FILE: pages/RankingPage.tsx
// ============================================

type Position = 1 | 2 | 3;
const USERS_PER_PAGE = 10; // users per page from API
const RankingPage: React.FC = () => {
  // const [period, setPeriod] = useState<RankingPeriod>('alltime');
  const [category, setCategory] = useState<RankingCategory>('reputation');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  // Fix 3: memoize so it only recomputes when users/page changes
  const remainingUsers = useMemo(
    () => (page === 1 ? users.slice(3) : users),
    [users, page]
  );

  // Fix 1 & 2: re-fetch on page, category, or period change
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fix 2: pass page (and period if your API supports it)
        const res = await getUsersByRanking(category, page);

        if (!res.ok) {
          dispatch(showMessage({ messageType: 'error', messsage: res.message }));
          return;
        }
        setUsers(res.data?.users ?? []);
        setTotalUsers(res.data?.total ?? 0);
      } catch (error) {
        console.warn(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [category, page]); // Fix 1: proper deps

  // Fix 7: reset to page 1 whenever category or period changes
  const handleCategoryChange = (c: RankingCategory) => {
    setCategory(c);
    setPage(1);
  };

  const handlePeriodChange = (p: RankingPeriod) => {
    // setPeriod(p);
    setPage(1);
  };

  // Fix 4: dynamic page window (shows 5 pages around current)
  const getPageNumbers = () => {
    const delta = 2; // pages on each side of current
    const range: (number | '...')[] = [];
    const rangeStart = Math.max(2, page - delta);
    const rangeEnd = Math.min(totalPages - 1, page + delta);

    range.push(1); // always show first

    if (rangeStart > 2) range.push('...');

    for (let i = rangeStart; i <= rangeEnd; i++) range.push(i);

    if (rangeEnd < totalPages - 1) range.push('...');

    if (totalPages > 1) range.push(totalPages); // always show last

    return range;
  };

  return (
    <div className='min-h-screen bg-slate-50'>
      <RankingHeader />
      <FilterBar
        // period={period}
        category={category}
        // onPeriodChange={handlePeriodChange}   // Fix 7
        onCategoryChange={handleCategoryChange} // Fix 7
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Top 3 Users */}
        {page === 1 && !loading && (
          <div className='mb-12'>
            <h2 className='text-2xl font-bold text-slate-900 mb-6 text-center'>
              Top Contributors
            </h2>
            <div className='grid md:grid-cols-3 gap-6'>
              {users.slice(0, 3).map((data, idx) => (
                <TopThreeCard key={data._id} user={data} position={(idx + 1) as Position} />
              ))}
            </div>
          </div>
        )}

        <div className='grid lg:grid-cols-12 gap-6'>
          <div className='lg:col-span-8'>
            <h2 className='text-xl font-bold text-slate-900 mb-4'>All Rankings</h2>
            {loading ? (
              <div className='flex justify-center py-12'>
                <span className='text-slate-400 text-sm'>Loading...</span>
              </div>
            ) : (
              <div className='space-y-3'>
                {remainingUsers.map((user: UserProfile) => (
                  <UserRankCard key={user._id} user={user} />
                ))}
              </div>
            )}

            {/* Fix 4: Dynamic pagination */}
            {totalPages > 1 && (
              <div className='mt-6 flex justify-center items-center gap-2'>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className='px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium
                             hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed'
                >
                  Previous
                </button>

                {getPageNumbers().map((num, idx) =>
                  num === '...' ? (
                    <span key={`ellipsis-${idx}`} className='px-2 text-slate-400 select-none'>
                      ...
                    </span>
                  ) : (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page === num
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      {num}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className='px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed'>
                  Next
                </button>
              </div>
            )}
          </div>

          <aside className='lg:col-span-4'>
            <StatsSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
