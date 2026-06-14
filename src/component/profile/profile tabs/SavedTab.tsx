// ============================================
// FILE: components/profile/SavedTab.tsx
import React, { useEffect, useState } from 'react';
import { Bookmark, X } from 'lucide-react';
import { getQuestionSavedByUser } from '@/api/user';
import { showMessage } from '@/features/messageSlice';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { saveQuestion } from '@/api/question';
import { Question } from '@/utils/contants/type';
import { makeURLPattern } from '@/utils/helper';
type proptype = {
  question: Question;
  handleUnsave: any;
};

export const SavedCard = ({ question, handleUnsave }: proptype) => {
  const questionPattern = makeURLPattern({ url: question.title });

  return (
    <div className='bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-start gap-3 flex-1'>
          <Bookmark className='w-5 h-5 text-red-600 mt-1' fill='#b13112' />
          <div>
            <Link href={`/question/${questionPattern}/`}>
              <h3 className='text-lg font-semibold text-blue-600 hover:text-blue-700 cursor-pointer mb-1'>
                {question?.title}
              </h3>
            </Link>
            <div className='flex items-center gap-2 text-xs text-slate-500'>
              <span className='capitalize'>question</span>
              <span>•</span>
              <span>Saved {new Date(question?.createdAt).toDateString()}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => handleUnsave(question._id)}
          className='text-slate-400 hover:text-red-600'
        >
          <X className='w-5 h-5' />
        </button>
      </div>
    </div>
  );
};

// ============================================
export const SavedTab: React.FC<{ userId: string }> = ({ userId }) => {
  const dispatch = useDispatch();
  const [savedQuestion, setSavedQuestion] = useState([]);

  useEffect(() => {
    const fetchUserSaved = async () => {
      if (!userId) return;
      const data = await getQuestionSavedByUser(userId);

      if (!data.ok) {
        dispatch(
          showMessage({
            messageType: 'error',
            message: data.message,
          }),
        );
        return;
      }

      setSavedQuestion(data?.data?.saved);
    };
    fetchUserSaved();
  }, [dispatch, userId]);

  const handleUnsave = async (questionId: string) => {
    try {
      const res = await saveQuestion(questionId);
      dispatch(
        showMessage({
          messageType: res.ok ? 'success' : 'error',
          message: res.message,
        }),
      );

      const removed = savedQuestion.filter(
        (prev: any) => prev?.question?.id != questionId,
      );

      setSavedQuestion(removed);
    } catch (error) {
      console.warn(error);
    }
  };
  return (
    <div className='space-y-4'>
      <div className='bg-white rounded-lg border border-slate-200 p-4'>
        <h2 className='text-xl font-bold text-slate-900'>
          Saved Items ({savedQuestion.length})
        </h2>
      </div>

      {savedQuestion.map((item: proptype) => (
        <SavedCard
          key={item?.question?._id}
          question={item?.question}
          handleUnsave={handleUnsave}
        />
      ))}
    </div>
  );
};
