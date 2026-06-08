"use client"
import {
  Award,
  Bookmark,
  CheckCircle,
  MessageCircleQuestion,
  MessageSquare,
  TrendingUp,
  User,
} from 'lucide-react';
import { TabType } from '../../utils/contants/type';
import { useSelector } from 'react-redux';

interface TabNavigationProps {
  activeTab?: TabType;
  onTabChange: (tab: TabType) => void;
  userId : string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  userId
}) => {
  const { isAuthenticated , user } = useSelector((state: any) => state.auth)
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User className='w-4 h-4' /> },
    {
      id: 'questions',
      label: 'Questions',
      icon: <MessageSquare className='w-4 h-4' />,
    },
    {
      id: 'answers',
      label: 'Answers',
      icon: <CheckCircle className='w-4 h-4' />,
    },
    { id: 'badges', label: 'Badges', icon: <Award className='w-4 h-4' /> },
    {
      id: 'activity',
      label: 'Activity',
      icon: <TrendingUp className='w-4 h-4' />,
    },
    { id: 'saved', label: 'Saved', icon: <Bookmark className='w-4 h-4' /> },
    {
      id: 'ask',
      label: 'Ask Question',
      icon: <MessageCircleQuestion className='w-4 h-4' />,
    },
  ];

  return (
    <div className='bg-white border-b border-slate-200 sticky top-0 z-10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <nav className='flex gap-1 overflow-x-auto'>
          {tabs.map((tab) => {

            if (!isAuthenticated && tab.id == 'ask') return
            if(isAuthenticated && userId !== user?.id && tab.id == 'ask') return
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            )
          }
          )}
        </nav>
      </div>
    </div>
  );
};
