import { AnswerFilters } from '@/constants/filters';
import React from 'react';
import Filter from './Filter';
import { getAllAnsewrs } from '@/lib/actions/answer.action';
import Link from 'next/link';
import Image from 'next/image';
import { getTimestamp } from '@/lib/utils';
import ParseHTML from './ParseHTML';
import Votes from './Votes';

interface Props {
  questionId: string;
  userId: string | undefined;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter
}: Props) => {
  const result = await getAllAnsewrs({
    questionId,
    page: page ? +page : 1,
    sortBy: filter
  });

  return (
    <div className='mt-11'>
      <div className='flex items-center justify-between'>
        <h3 className='primary-text-gradient'>{totalAnswers} Answers</h3>

        <Filter filters={AnswerFilters} />
      </div>

      <div>
        {result.answers.map((answer) => (
          <article key={answer._id} className='light-border border-b py-10'>
            <div className='flex items-center justify-between'>
              {/* SPAN ID */}
              <div className='mb-8 flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className='flex flex-1 items-start gap-1 sm:items-center'
                >
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt={`${answer.author.name} profile picture`}
                    className='rounded-full object-cover max-sm:mt-0.5'
                  />
                  <div className='flex flex-col sm:flex-row sm:items-center'>
                    <p className='body-semibold text-dark300_light700'>
                      {answer.author.name}
                    </p>

                    <p className='small-regular text-light400_light500 ml-1 mt-0.5 line-clamp-1'>
                      answered {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div
                  className='flex justify-end
                '
                >
                  <Votes
                    type='answer'
                    itemId={JSON.parse(JSON.stringify(answer._id))}
                    userId={userId}
                    upvotes={answer.upvotes.length}
                    hasupVoted={answer.upvotes.includes(userId)}
                    hasSaved={false}
                    downvotes={answer.downvotes.length}
                    hasdownVoted={answer.downvotes.includes(userId)}
                  />
                </div>
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllAnswers;
