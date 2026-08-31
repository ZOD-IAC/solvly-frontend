import React from 'react';
import { Calendar, Edit, LinkIcon, MapPin, Share2, Star } from 'lucide-react';
import { UserProfile } from '../../utils/contants/type';
import UserAvatar from '../common/UserAvatar';

interface ProfileHeaderProps {
  user: UserProfile;
  isOwnProfile: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwnProfile,
}) => {
  // if(!user) return;
  return (
    <div className='bg-white border-b border-slate-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col md:flex-row gap-6 items-start'>
          {/* Avatar */}
          <div className='relative'>
            {user?.avatar ? (
              <UserAvatar svg={user?.avatar} className={'w-32 h-32'} />
            ) : (
              <div className='w-32 h-32 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg'>
                {user?.name ||
                  'Harshit'
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
              </div>
            )}
            {isOwnProfile && (
              <button className='absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 shadow-lg'>
                <Edit className='w-5 h-5' />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className='flex-1'>
            <div className='flex items-start justify-between mb-4'>
              <div>
                <h1 className='text-3xl font-bold text-slate-900 mb-1'>
                  {user?.name}
                </h1>
                <p className='text-lg text-slate-600'>@{user?.email || "NoUser@found"}</p>
              </div>
              <div className='flex gap-2'>
                {isOwnProfile ? (
                  <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2'>
                    <Edit className='w-4 h-4' />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
                      Follow
                    </button>
                    <button className='px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50'>
                      Message
                    </button>
                  </>
                )}
                <button className='px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50'>
                  <Share2 className='w-4 h-4' />
                </button>
              </div>
            </div>

            <p className='text-slate-600 mb-4 max-w-2xl'>{user?.bio}</p>

            {/* Meta Info */}
            <div className='flex flex-wrap gap-4 text-sm text-slate-600 mb-4'>
              {user?.location && (
                <div className='flex items-center gap-1'>
                  <MapPin className='w-4 h-4' />
                  {user?.location}
                </div>
              )}
              {user?.website && (
                <div className='flex items-center gap-1'>
                  <LinkIcon className='w-4 h-4' />
                  <a
                    href={user?.website}
                    className='text-blue-600 hover:underline'
                  >
                    {user?.website}
                  </a>
                </div>
              )}
              <div className='flex items-center gap-1'>
                <Calendar className='w-4 h-4' />
                Joined {new Date(user?.createdAt).toDateString()}
              </div>
            </div>

            {/* Social Links */}
            {/* {(user?.social.github ||
              user?.social.twitter ||
              user?.social.linkedin) && (
              <div className='flex gap-3'>
                {user?.social.github && (
                  <a
                    href={user?.social.github}
                    className='text-slate-600 hover:text-slate-900'
                  >
                    <Github className='w-5 h-5' />
                  </a>
                )}
                {user?.social.twitter && (
                  <a
                    href={user?.social.twitter}
                    className='text-slate-600 hover:text-slate-900'
                  >
                    <Twitter className='w-5 h-5' />
                  </a>
                )}
                {user?.social.linkedin && (
                  <a
                    href={user?.social.linkedin}
                    className='text-slate-600 hover:text-slate-900'
                  >
                    <Linkedin className='w-5 h-5' />
                  </a>
                )}
              </div>
            )} */}
          </div>
        </div>

        {/* Stats Bar */}
        <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-slate-200'>
          <div className='text-center'>
            <div className='flex items-center justify-center gap-2 text-2xl font-bold text-slate-900 mb-1'>
              <Star className='w-6 h-6 text-amber-500' />
              {user?.reputation}
            </div>
            <p className='text-sm text-slate-600'>Reputation</p>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-slate-900 mb-1'>
              {user?.stats.questions}
            </div>
            <p className='text-sm text-slate-600'>Questions</p>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-slate-900 mb-1'>
              {user?.stats.answers}
            </div>
            <p className='text-sm text-slate-600'>Answers</p>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-green-600 mb-1'>
              {user?.stats.accepted}
            </div>
            <p className='text-sm text-slate-600'>Accepted</p>
          </div>
        </div>
      </div>
    </div>
  );
};
