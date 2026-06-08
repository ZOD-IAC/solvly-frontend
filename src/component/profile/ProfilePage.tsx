'use client';
import React, { useState, useEffect } from 'react';
import { Badge, TabType } from '../../utils/contants/type';
import { ProfileHeader } from './ProfileHeader';
import { TabNavigation } from './TabNavigation';
import { ProfileSidebar } from './ProfileSidebar';
import { ProfileTab } from './profile tabs/ProfileTab';
import { QuestionsTab } from './profile tabs/QuestionTab';
import { AnswersTab } from './profile tabs/AnswerTab';
import { ActivityTab } from './profile tabs/ActivityTab';
import { SavedTab } from './profile tabs/SavedTab';
import { BadgesTab } from './profile tabs/BadgeTab';
import { useRouter, useSearchParams } from 'next/navigation';
import AskQuestionForm from '../form/AskQuestionForm';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from '@/features/messageSlice';
import { BASE_URL } from '@/utils/Setting';

interface Id {
  userId: string;
}

const ProfilePage: React.FC<Id> = ({ userId }) => {
  const param = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const tab = param?.get('tab');
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [data, setData] = useState<any>();

  // State with URL parameter sync (lazy initializer to avoid calling setState in effect)
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${BASE_URL}/user/api/get-user/${userId}`, {
        method: 'GET',
      });
      const data = await res.json();

      if (!data.ok) {
        dispatch(
          showMessage({
            message: data.message,
            messageType: 'error',
          }),
        );
      }
      setData(data?.data);
    };

    fetchUser();
  }, []);

  // Listen for back/forward navigation and update tab (setState inside event callback is fine)
  useEffect(() => {
    const onPopState = () => {
      try {
        if (tab == 'ask' && !isAuthenticated) {
          const query = new URLSearchParams(window.location.search);
          query.set('tab', 'profile');
          router.replace(`?${query.toString()}`)
          return
        }
        if(data){
          if (tab == "ask" && data?.user?.id !== userId){
            const query = new URLSearchParams(window.location.search);
            query.set('tab', 'profile');
            router.replace(`?${query.toString()}`)
            return
          }
        }

        if (tab) {
          setActiveTab(tab as TabType);
        } else {
          setActiveTab('profile');
        }
      } catch {
        setActiveTab('profile');
      }
    };

    onPopState();
    return () => window.removeEventListener('popstate', onPopState);
  }, [tab]);

  // Update URL when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  const badges: Badge[] = [
    {
      id: 1,
      name: 'Expert Contributor',
      description: 'Provided 100+ accepted answers',
      type: 'gold',
      earnedDate: '2 weeks ago',
      icon: '🏆',
    },
    {
      id: 2,
      name: 'Great Answer',
      description: 'Answer scored 100 or more',
      type: 'gold',
      earnedDate: '1 month ago',
      icon: '⭐',
    },
    {
      id: 3,
      name: 'Enthusiast',
      description: 'Visited the site each day for 30 consecutive days',
      type: 'silver',
      earnedDate: '2 months ago',
      icon: '🔥',
    },
    {
      id: 4,
      name: 'Nice Answer',
      description: 'Answer scored 10 or more',
      type: 'silver',
      earnedDate: '3 months ago',
      icon: '👍',
    },
    {
      id: 5,
      name: 'Scholar',
      description: 'Asked first question with score of 1 or more',
      type: 'bronze',
      earnedDate: '6 months ago',
      icon: '📚',
    },
    {
      id: 6,
      name: 'Student',
      description: 'First question with score of 1 or more',
      type: 'bronze',
      earnedDate: '6 months ago',
      icon: '🎓',
    },
  ];

  const isOwnProfile = true; // Change to false to see non-owner view

  if (!data) return;
  return (
    <div className='min-h-screen bg-slate-50'>
      <ProfileHeader user={data?.user} isOwnProfile={isOwnProfile} />
      <TabNavigation userId={userId} activeTab={activeTab} onTabChange={handleTabChange} />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid lg:grid-cols-12 gap-6'>
          {/* Main Content */}
          <main className='lg:col-span-8'>
            {activeTab === 'profile' && <ProfileTab user={data?.user} />}
            {activeTab === 'questions' && (
              <QuestionsTab question={data?.question} />
            )}
            {activeTab === 'answers' && <AnswersTab userId={userId} />}
            {activeTab === 'badges' && <BadgesTab badges={badges} />}
            {activeTab === 'activity' && <ActivityTab />}
            {activeTab === 'saved' && <SavedTab userId={userId} />}
            {isAuthenticated && activeTab === 'ask' && <AskQuestionForm />}
          </main>

          {/* Sidebar */}
          <aside className='lg:col-span-4'>
            <ProfileSidebar user={data?.user} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
