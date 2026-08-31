// ============================================
// FILE: components/profile/ProfileTab.tsx
// ============================================
import React from 'react';
import { UserProfile } from '../../../utils/contants/type';
import { Award } from 'lucide-react';

interface ProfileTabProps {
  user: UserProfile;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ user }) => {
  return (
    <div className='space-y-6'>
      {/* About */}
      <div className='bg-white rounded-lg border border-slate-200 p-6'>
        <h2 className='text-xl font-bold text-slate-900 mb-4'>About</h2>
        <p className='text-slate-600 leading-relaxed'>
          {user?.bio || 'Some Bio need to be here'}
        </p>
      </div>

      {/* Badges Summary */}
      {/* <div className='bg-white rounded-lg border border-slate-200 p-6'>
        <h2 className='text-xl font-bold text-slate-900 mb-4'>Badges</h2>
        <div className='flex gap-6'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center'>
              <Award className='w-6 h-6 text-amber-600' />
            </div>
            <div>
              <div className='text-2xl font-bold text-slate-900'>
                {user.badges.gold}
              </div>
              <div className='text-sm text-slate-600'>Gold Badges</div>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center'>
              <Award className='w-6 h-6 text-slate-600' />
            </div>
            <div>
              <div className='text-2xl font-bold text-slate-900'>
                {user.badges.silver}
              </div>
              <div className='text-sm text-slate-600'>Silver Badges</div>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center'>
              <Award className='w-6 h-6 text-orange-600' />
            </div>
            <div>
              <div className='text-2xl font-bold text-slate-900'>
                {user.badges.bronze}
              </div>
              <div className='text-sm text-slate-600'>Bronze Badges</div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Top Tags */}
      <div className='bg-white rounded-lg border border-slate-200 p-6'>
        <h2 className='text-xl font-bold text-slate-900 mb-4'>Top Tags</h2>
        <div className='flex flex-wrap gap-2'>
          {['JavaScript', 'React', 'TypeScript', 'Node.js', 'MongoDB'].map(
            (tag) => (
              <div
                key={tag}
                className='px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200'
              >
                <div className='font-semibold'>{tag}</div>
                <div className='text-xs text-blue-600'>125 posts</div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
