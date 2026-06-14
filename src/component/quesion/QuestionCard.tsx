import Link from 'next/link';
import { Question } from '../../utils/contants/type';
import UserAvatar from '../common/UserAvatar';
import { makeURLPattern } from '@/utils/helper';

// Question Card Component
const QuestionCard: React.FC<{ question: Question }> = ({ question }) => {
  return (
    <div className='bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow'>
      <div className='flex gap-4'>
        {/* Stats Column */}
        <div className='flex flex-col items-center gap-3 text-sm min-w-[80px]'>
          <div className='flex flex-col items-center'>
            <span className='font-semibold text-slate-700'>
              {question?.upvotes}
            </span>
            <span className='text-slate-500 text-xs'>votes</span>
          </div>
          <div
            className={`flex flex-col items-center ${
              question?.isAnswered ? 'text-green-600' : 'text-slate-500'
            }`}
          >
            <span
              className={`font-semibold ${
                question?.isAnswered ? 'bg-green-100 px-2 py-1 rounded' : ''
              }`}
            >
              {question?.answersCount}
            </span>
            <span className='text-xs mt-1'>answers</span>
          </div>
          <div className='flex flex-col items-center text-slate-500'>
            <span className='font-semibold'>{question?.views}</span>
            <span className='text-xs'>views</span>
          </div>
        </div>

        {/* Question Content */}
        <div className='flex-1 min-w-0'>
          <Link href={`/question/${makeURLPattern({ url: question?.title })}/`}>
            <h3 className='text-lg font-semibold text-blue-600 hover:text-blue-700 cursor-pointer mb-2'>
              {question?.title}
            </h3>
          </Link>
          <p
            className='text-slate-600 text-sm mb-3 line-clamp-2 '
            dangerouslySetInnerHTML={{ __html: question?.body }}
          />

          {/* Tags */}
          <div className='flex flex-wrap gap-2 mb-3'>
            {question?.tags.map((tag, idx) => (
              <span
                key={tag._id}
                className='px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-md hover:bg-slate-200 cursor-pointer'
              >
                {tag.tagName}
              </span>
            ))}
          </div>

          {/* Author Info */}
          <div className='flex items-center justify-between text-xs text-slate-500'>
            <div className='flex items-center gap-2'>
              {question?.user?.avatar ? (
                <UserAvatar
                  svg={question?.user?.avatar}
                  className={'w-2 h-2'}
                />
              ) : (
                <div className='w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold' />
              )}
              <span className='font-medium text-slate-700'>
                {question?.user?.name}
              </span>
              <span>asked {question.createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
