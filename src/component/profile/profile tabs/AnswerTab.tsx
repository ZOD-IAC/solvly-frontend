// ============================================
// FILE: components/profile/AnswersTab.tsx

import { CheckCircle, Clock, ThumbsUp } from 'lucide-react';
import { Answer } from '../../../utils/contants/type';
import React, { useEffect, useState } from 'react';
import { AnswersTabProps } from '@/utils/contants/type';
import { getAnswers } from '../../../api/answer/index';
import { stripHtml } from '@/utils/helper';
import { useSelector } from 'react-redux';
const AnswerCard: React.FC<{ answer: Answer }> = ({ answer }) => {
  return (
    <div className='bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md transition-shadow'>
      <div className='flex gap-4'>
        <div className='flex flex-col items-center gap-2 min-w-[60px]'>
          <div className='flex items-center gap-1'>
            <ThumbsUp className='w-4 h-4 text-slate-500' />
            <span className='font-semibold text-slate-700'>{answer.votes}</span>
          </div>
          {answer.isAccepted && (
            <div className='flex items-center gap-1 text-green-600'>
              <CheckCircle className='w-4 h-4' />
              <span className='text-xs font-medium'>Accepted</span>
            </div>
          )}
        </div>

        <div className='flex-1'>
          <h3 className='text-lg font-semibold text-slate-900 mb-2'>
            Answer to:{' '}
            <a
              href={`/question/${answer.question[0]._id}`}
              className='text-blue-600 hover:text-blue-700 cursor-pointer'
            >
              {answer.question[0]?.title}
            </a>
          </h3>
          <p className='text-slate-600 text-sm mb-3 line-clamp-3 w-full'>
            {stripHtml(answer?.body)}
          </p>
          <div className='flex items-center gap-2 text-xs text-slate-500'>
            <Clock className='w-3 h-3' />
            <span>answered {answer.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AnswersTab: React.FC = () => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [filter, setFilter] = useState<'all' | 'accepted'>('all');
  const { user } = useSelector((s: any) => s.auth);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        if (!user) return;
        const params = {
          userId: user.id,
        };
        const res = await getAnswers(params);
        if (!res.ok) {
          throw new Error(res.message);
        }

        setAnswers(res.data);
      } catch (error) {
        // Narrow the type to ensure error is an Error instance
        const errMessage =
          error instanceof Error ? error.message : 'Something went wrong';
        console.warn(errMessage, ': some error occurred');
      }
    };
    fetchAnswers();
  }, []);

  const filteredAnswers = answers?.filter((a) => {
    if (filter === 'accepted') return a.isAccepted;
    return true;
  });

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between bg-white rounded-lg border border-slate-200 p-4'>
        <h2 className='text-xl font-bold text-slate-900'>
          Answers ({answers.length})
        </h2>
        <div className='flex gap-2'>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700'
              }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === 'accepted'
              ? 'bg-green-600 text-white'
              : 'bg-slate-100 text-slate-700'
              }`}
          >
            Accepted
          </button>
        </div>
      </div>

      {filteredAnswers.map((answer) => (
        <AnswerCard key={answer._id} answer={answer} />
      ))}
    </div>
  );
};
