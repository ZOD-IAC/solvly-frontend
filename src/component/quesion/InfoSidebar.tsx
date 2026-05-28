import { getStatsData } from '@/api/question';
import { showMessage } from '@/features/messageSlice';
import { Tag, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Stats and Info Sidebar Component
const InfoSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const [trendingTag, setTrendingTag] = useState([]);
  const [statsData, setStatsData] = useState({
    answersToday: 0,
    questionsToday: 0,
    activeUsersToday: 0,
  });

  useEffect(() => {
    const fetchStatsData = async () => {
      const res = await getStatsData();

      if (!res.ok) {
        dispatch(
          showMessage({
            messageType: 'error',
            message: res.message,
          }),
        );
        return;
      }

      setTrendingTag(res.trendingTags)
      setStatsData(res.stats);
    };

    fetchStatsData();
  }, []);

  return (
    <div className='space-y-4'>
      {/* Quick Stats */}
      <div className='bg-linear-to-br from-[#3E3F29] to-[#1d1e12] text-white rounded-lg p-4'>
        <h3 className='font-semibold mb-3 flex items-center gap-2'>
          <TrendingUp className='w-5 h-5' />
          Today&apos;s Stats
        </h3>
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-blue-100'>Questions</span>
            <span className='font-semibold'>{statsData?.questionsToday}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-blue-100'>Answers</span>
            <span className='font-semibold'>{statsData?.answersToday}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-blue-100'>Active Users</span>
            <span className='font-semibold'>{statsData?.activeUsersToday}</span>
          </div>
        </div>
      </div>

      {/* Trending Tags */}
      {trendingTag.length > 0 &&
        <div className='bg-white border border-slate-200 rounded-lg p-4'>
          <h3 className='font-semibold text-slate-800 mb-3 flex items-center gap-2'>
            <Tag className='w-5 h-5' />
            Trending Tags
          </h3>
          <div className='space-y-2'>
            {trendingTag.map(
              (tag: any, idx) => (
                <div
                  className='flex items-center justify-between text-sm'
                >
                  <span key={idx} className='text-slate-700 hover:text-blue-600 cursor-pointer'>
                    {tag?.name}
                  </span>
                  <span className='text-slate-400 text-xs'>+{tag?.count} added</span>
                </div>
              ),
            )}
          </div>
        </div>
      }

      {/* Guidelines */}
      <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
        <h3 className='font-semibold text-slate-800 mb-2 text-sm'>
          Asking Guidelines
        </h3>
        <ul className='space-y-1 text-xs text-slate-600'>
          <li>• Search for similar questions first</li>
          <li>• Be specific and clear</li>
          <li>• Include code samples</li>
          <li>• Use proper tags</li>
        </ul>
      </div>
    </div>
  );
};

export default InfoSidebar;
