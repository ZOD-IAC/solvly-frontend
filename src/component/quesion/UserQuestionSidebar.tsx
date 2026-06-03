import { Eye, MessageSquare, ThumbsUp } from 'lucide-react';
import Button from '../Button/Button';
import { useEffect, useState } from 'react';
import { getUserRecentQuestion } from '@/api/question';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from '@/features/messageSlice';
import { Question, UserProfile } from '@/utils/contants/type';
import Link from 'next/link';

// User Questions Sidebar Component
const UserQuestionsSidebar: React.FC<{
  isAuthenticated: boolean;
  user: UserProfile;
}> = ({ isAuthenticated, user }) => {
  const dispatch = useDispatch();
  const [userQuestions, setUserQuestion] = useState([]);

  useEffect(() => {
    if (!isAuthenticated && !user) return;
    const fetchUserQuestion = async () => {
      const res = await getUserRecentQuestion(user?.id);

      if (!res.ok) {
        dispatch(
          showMessage({
            messageType: 'error',
            message:
              res?.message || 'Unable to fetch user&apos;s recent question',
          }),
        );
        return;
      }
      setUserQuestion(res?.data?.questions);
    };

    fetchUserQuestion();
  }, [user, dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className='bg-slate-50 border border-slate-200 rounded-lg p-6'>
        <h3 className='font-semibold text-slate-800 mb-3'>Your Questions</h3>
        <p className='text-sm text-slate-600 mb-4'>
          Log in to see your questions and track answers
        </p>
        <Button variant='primary' size='sm' fullWidth href='/login'>
          Log In
        </Button>
      </div>
    );
  }

  return (
    <div className='bg-white border border-slate-200 rounded-lg p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='font-semibold text-slate-800'>Your Questions</h3>
        <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>
          {userQuestions.length}
        </span>
      </div>
      <div className='space-y-3'>
        {userQuestions.map((q: Question) => (
          <div
            key={q._id}
            className='pb-3 border-b border-slate-100 last:border-0'
          >
            <Link href={`/question/${q._id}`}>
              <h4 className='text-sm font-medium text-slate-800 hover:text-blue-600 cursor-pointer mb-2 line-clamp-2'>
                {q.title}
              </h4>
            </Link>
            <div className='flex items-center gap-3 text-xs text-slate-500'>
              <span className='flex items-center gap-1'>
                <ThumbsUp className='w-3 h-3' />
                {q.upvotes}
              </span>
              <span
                className={`flex items-center gap-1 ${
                  q.isAnswered ? 'text-green-600' : ''
                }`}
              >
                <MessageSquare className='w-3 h-3' />
                {q.answersCount}
              </span>
              <span className='flex items-center gap-1'>
                <Eye className='w-3 h-3' />
                {q.views}
              </span>
            </div>
          </div>
        ))}
      </div>
      <Button
        variant='ghost'
        size='sm'
        fullWidth
        href={`/profile/${user?.id}?tab=questions`}
      >
        View All
      </Button>
    </div>
  );
};

export default UserQuestionsSidebar;
