import Filters from '@/components/shared/Filter';
import QuestionCard from '@/components/cards/QuestionCard';
import HomeFilters from '@/components/home/HomeFilters';
import NoResult from '@/components/shared/NoResult';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import Link from 'next/link';
import React from 'react';
import { getQuestions } from '@/lib/actions/question.action';
import { SearchParamsProps } from '@/types';
import Pagination from '@/components/shared/Pagination';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Dev Overflow',
  description:
    'Welcome to Dev Overflow, a community-driven Q&A platform where developers can ask, answer, and share their knowledge.'
};

const Home = async ({
  searchParams
}: SearchParamsProps) => {
  const result = await getQuestions({
    page: searchParams?.page ? +searchParams.page : 1,
    searchQuery: searchParams.q,
    filter: searchParams.filter
  });

  return (
    <>
      <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900'>
          All Question
        </h1>

        {result.questions.length > 0 ? (
          <Link
            href={'/ask-question'}
            className='flex justify-end max-sm:w-full'
          >
            <Button className=' primary-gradient min-h-[46px] px-4 py-3 !text-light-900'>
              Ask a Question
            </Button>
          </Link>
        ) : (
          ''
        )}
      </div>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearchBar
          route='/'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search for questions...'
          otherClasses='flex-1'
        />
        <Filters
          filters={HomePageFilters}
          otherClasses='min-h-[56px] sm:min-width-[170px]'
          containerClasses='hidden max-md:flex'
        />
      </div>

      <HomeFilters />
      <div className='mt-10 flex w-full flex-col gap-6'>
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title='There are no questions to show'
            description='Be the first to break the slience! 🚀 Ask a Qeustion and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡.'
            link='/ask-question'
            linkTitle='Ask a Question'
          />
        )}
      </div>

      {result.isNext && (
        <div className='mt-10'>
          <Pagination
            pageNumber={
              searchParams?.page
                ? +searchParams.page
                : 1
            }
            isNext={result.isNext}
          />
        </div>
      )}
    </>
  );
};

export default Home;
