'use client';
import { Bomb, LaptopMinimalCheck, BadgeInfo, X } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage } from '@/features/messageSlice';

function MessagePopUp() {
  const dispatch = useDispatch();

  const message = useSelector(
    (state: {
      message: { messageType: 'error' | 'info' | 'success'; message: string };
    }) => state.message,
  );

  const config = {
    error: {
      icon: <Bomb size={16} />,
      dot: 'bg-rose-400',
      text: 'text-rose-400',
      // border: 'border-rose-400/20',
    },
    info: {
      icon: <BadgeInfo size={16} />,
      dot: 'bg-blue-400',
      text: 'text-blue-400',
      // border: 'border-blue-400/20',
    },
    success: {
      icon: <LaptopMinimalCheck size={16} />,
      dot: 'bg-emerald-400',
      text: 'text-emerald-400',
      // border: 'border-emerald-400/20',
    },
  };

  useEffect(() => {
    if (!message.message.trim()) return;
    const timer = setTimeout(() => dispatch(clearMessage()), 3000);
    return () => clearTimeout(timer);
  }, [message.message, dispatch]);

  if (!message.message.trim()) return null;

  const { icon, text } = config[message.messageType];

  return (
    <div className='fixed bottom-6 right-5 z-50 animate-slideUp'>
      <div
        className={`relative flex items-center gap-3 bg-[#111110] border text-white px-4 py-3 rounded-xl shadow-2xl max-w-[320px]`}
      >
        <div className={`shrink-0 ${text} flex items-center`}>{icon}</div>
        <p className='font-mono text-[14px] text-white/80 leading-snug flex-1'>
          {message.message}
        </p>
        <button
          onClick={() => dispatch(clearMessage())}
          className='shrink-0 text-white/30 hover:text-white/70 transition-colors'
        >
          <X size={13} />
        </button>
        <div className='absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl overflow-hidden'>
          <div
            className={`h-full animate-shrink`}
            style={{ transformOrigin: 'left' }}
          />
        </div>
      </div>
    </div>
  );
}

export default MessagePopUp;
