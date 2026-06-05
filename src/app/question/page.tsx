import React from 'react';
import QuestionsPage from '@/component/quesion/QuestionPage';

async function page({ searchParams }: any) {
  const query = await searchParams;

  return (
    <div>
      <QuestionsPage params={query} />
    </div>
  );
}

export default page;
