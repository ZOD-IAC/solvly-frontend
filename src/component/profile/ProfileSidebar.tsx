// ============================================
// FILE: components/profile/ProfileSidebar.tsx

import { Award, Star, Tag, Trophy } from 'lucide-react';
import React from 'react';
import { UserProfile } from '../../utils/contants/type';

// ============================================
interface ProfileSidebarProps {
  user: UserProfile;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user }) => {
  return (
    <div className='space-y-4'>
      {/* Stats Card */}
      <div className='bg-white rounded-lg border border-slate-200 p-6'>
        <h3 className='font-semibold text-slate-900 mb-4 flex items-center gap-2'>
          <Trophy className='w-5 h-5 text-amber-500' />
          Stats Overview
        </h3>
        <div className='space-y-3'>
          {/* <div className='flex justify-between items-center'>
            <span className='text-slate-600 text-sm'>Reached</span>
            <span className='font-bold text-slate-900'>
              {user.stats.reached}
            </span>
          </div> */}
          <div className='flex justify-between items-center'>
            <span className='text-slate-600 text-sm'>Questions</span>
            <span className='font-bold text-slate-900'>
              {user?.stats?.questions}
            </span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-slate-600 text-sm'>Answers</span>
            <span className='font-bold text-slate-900'>
              {user?.stats?.answers}
            </span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-slate-600 text-sm'>Acceptance Rate</span>
            <span className='font-bold text-green-600'>
              {Math.round((user?.stats?.accepted / user?.stats?.answers) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Badges Summary */}
      {/* <div className='bg-linear-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-6'>
        <h3 className='font-semibold text-slate-900 mb-4'>Badges Earned</h3>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center'>
                <Award className='w-5 h-5 text-white' />
              </div>
              <span className='text-sm font-medium text-slate-700'>Gold</span>
            </div>
            <span className='text-xl font-bold text-slate-900'>
              {user.badges.gold}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center'>
                <Award className='w-5 h-5 text-white' />
              </div>
              <span className='text-sm font-medium text-slate-700'>Silver</span>
            </div>
            <span className='text-xl font-bold text-slate-900'>
              {user.badges.silver}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center'>
                <Award className='w-5 h-5 text-white' />
              </div>
              <span className='text-sm font-medium text-slate-700'>Bronze</span>
            </div>
            <span className='text-xl font-bold text-slate-900'>
              {user.badges.bronze}
            </span>
          </div>
        </div>
      </div> */}

      {/* Top Tags */}
      <div className='bg-white rounded-lg border border-slate-200 p-6'>
        <h3 className='font-semibold text-slate-900 mb-4 flex items-center gap-2'>
          <Tag className='w-5 h-5 text-blue-600' />
          Top Tags
        </h3>
        <div className='space-y-2'>
          {[
            {
              name: 'JavaScript',
              count: 125,
              color: 'bg-yellow-100 text-yellow-700',
            },
            { name: 'React', count: 98, color: 'bg-blue-100 text-blue-700' },
            {
              name: 'TypeScript',
              count: 87,
              color: 'bg-indigo-100 text-indigo-700',
            },
            {
              name: 'Node.js',
              count: 76,
              color: 'bg-green-100 text-green-700',
            },
            {
              name: 'MongoDB',
              count: 54,
              color: 'bg-emerald-100 text-emerald-700',
            },
          ].map((tag) => (
            <div key={tag.name} className='flex items-center justify-between'>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${tag.color}`}
              >
                {tag.name}
              </span>
              <span className='text-sm text-slate-600'>{tag.count} posts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className='bg-linear-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6'>
        <h3 className='font-semibold text-slate-900 mb-4 flex items-center gap-2'>
          <Star className='w-5 h-5 text-purple-600' />
          Recent Achievement
        </h3>
        <div className='text-center'>
          <div className='w-16 h-16 bg-linear-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3'>
            <Trophy className='w-8 h-8 text-white' />
          </div>
          <h4 className='font-semibold text-slate-900 mb-1'>Top Contributor</h4>
          <p className='text-xs text-slate-600 mb-3'>
            Ranked in top 5% this month
          </p>
          <div className='text-xs text-purple-600 font-medium'>
            Keep it up! 🎉
          </div>
        </div>
      </div>
    </div>
  );
};
