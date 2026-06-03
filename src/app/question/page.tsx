import React from 'react';
import QuestionsPage from '@/component/quesion/QuestionPage';
import { getQuestionList } from "../../api/question/index"

async function page({ searchParams }: any) {
  const query = await searchParams;
  const data = await getQuestionList(query);

  return (
    <div>
      <QuestionsPage params={query} />
    </div>
  );
}

export default page;
