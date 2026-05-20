'use client';
import React, { useState } from 'react';
import { MessageSquare, Users, TrendingUp, Search } from 'lucide-react';
import Button from '../Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestionList } from '@/api/question';
import { showMessage } from '@/features/messageSlice';

// Landing/Home Page Component
const LandingPage = () => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [questions, setQuestion] = useState([]);
  const dispatch = useDispatch();


  const handleSearchQuestion = async (e) => {
    const thread = e.target.value;
    if (!thread) return;
    try {
      let param = {
        title: thread,
      }
      const res = await getQuestionList(param)
      if (!res.ok) {
        dispatch(showMessage({
          messageType: 'error',
          message: res.message ?? "Unable to fetch Question!"
        }))
        return;
      }

      if (res?.questions?.length <= 0) {
        dispatch(showMessage({
          messageType: 'info',
          message: res.message
        }))
        return
      }
      setQuestion(res?.questions)

    } catch (error) {
      console.warn(error, 'something went wrong!')
    }
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='text-center max-w-3xl mx-auto'>
          <h1 className='text-5xl md:text-6xl font-bold text-slate-900 mb-6'>
            Every developer has a tab open to{' '}
            <span className='text-blue-600'>Solvly</span>
          </h1>
          <p className='text-xl text-slate-600 mb-8'>
            Join millions of developers getting answers to their coding
            questions, sharing knowledge, and building their careers.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button variant='primary' size='lg' href='/register'>
              Join the Community
            </Button>
            <Button variant='outline' size='lg' href='/question'>
              Explore Questions
            </Button>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20'>
        <div className='relative'>
          <Search className='absolute left-4 top-4 w-5 h-5 text-slate-400' />
          <input
            onChange={handleSearchQuestion}
            type='text'
            placeholder='Search questions...?'
            className='w-full pl-12 pr-4 py-4 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg'
          />
        </div>
        {questions &&
          <ul id="">
            {questions.map((d) => (
              <li key={d._id} value={d._id} className='w-full pl-2 pr-4 py-4 border-2 border-slate-300 mt-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg'>{d.title}</li>
            ))}
          </ul>
        }
      </section>

      {/* Features */}
      <section className='bg-slate-50 py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-slate-900 text-center mb-12'>
            Why developers choose Solvly
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='bg-white p-8 rounded-xl shadow-sm'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
                <MessageSquare className='w-6 h-6 text-blue-600' />
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-2'>
                Ask Questions
              </h3>
              <p className='text-slate-600'>
                Get help from experienced developers around the world. No
                question is too simple or complex.
              </p>
            </div>

            <div className='bg-white p-8 rounded-xl shadow-sm'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4'>
                <Users className='w-6 h-6 text-green-600' />
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-2'>
                Build Community
              </h3>
              <p className='text-slate-600'>
                Connect with developers, share your knowledge, and grow your
                professional network.
              </p>
            </div>

            <div className='bg-white p-8 rounded-xl shadow-sm'>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4'>
                <TrendingUp className='w-6 h-6 text-purple-600' />
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-2'>
                Level Up Skills
              </h3>
              <p className='text-slate-600'>
                Learn from real-world problems and solutions. Earn reputation
                and showcase your expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-3 gap-8 text-center'>
            <div>
              <div className='text-4xl font-bold text-blue-600 mb-2'>100M+</div>
              <div className='text-slate-600'>Questions & Answers</div>
            </div>
            <div>
              <div className='text-4xl font-bold text-blue-600 mb-2'>50M+</div>
              <div className='text-slate-600'>Active Developers</div>
            </div>
            <div>
              <div className='text-4xl font-bold text-blue-600 mb-2'>1M+</div>
              <div className='text-slate-600'>Daily Visitors</div>
            </div>
          </div>
        </div>
      </section>
      {!isAuthenticated && (
        <>
          {/* CTA Section */}
          <section className='bg-gradient-to-r from-blue-600 to-blue-800 py-20'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center grid items-center justify-center'>
              <h2 className='text-4xl font-bold text-white mb-6'>
                Ready to join our community?
              </h2>
              <p className='text-xl text-blue-100 mb-8'>
                Start asking questions, sharing knowledge, and connecting with
                developers today.
              </p>
              <Button variant='secondary' size='md' href='/register'>
                Sign Up for Free
              </Button>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default LandingPage;
