/* eslint-disable no-unused-vars */
'use server';

import Answer from '@/database/answer.model';
import { connectToDatabase } from '../mongoose';
import { revalidatePath } from 'next/cache';
import {
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams
} from './shared.types';
import Question from '@/database/question.model';
import page from '@/app/(root)/(home)/page';
import Interaction from '@/database/interaction.model';
import Tag from '@/database/tags.model';
import User from '@/database/user.model';

export async function createAnswer(
  params: CreateAnswerParams
) {
  try {
    await connectToDatabase();

    const { content, author, question, path } = params;

    const answer = await Answer.create({
      content,
      author,
      question
    });

    const questionObject =
      await Question.findByIdAndUpdate(question, {
        $push: { answers: answer._id }
      });

    await Interaction.create({
      user: author,
      action: 'answer',
      question,
      answer: answer._id,
      tags: questionObject.tags
    });

    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 10 }
    });

    revalidatePath(path);

    return { answer };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllAnsewrs(
  params: GetAnswersParams
) {
  try {
    await connectToDatabase();
    const { questionId, sortBy, page, pageSize } =
      params;

    let sortOption = {};

    /*
    {
    name: 'Highest Upvotes',
    value: 'highestUpvotes'
  },
  {
    name: 'Lowest Upvotes',
    value: 'lowestUpvotes'
  },
  {
    name: 'Most Recent',
    value: 'recent'
  },
  { name: 'Oldest', value: 'old' }
    */
    switch (sortBy) {
      case 'highstUpvotes':
        sortOption = { upvotes: -1 };
        break;
      case 'lowestUpvotes':
        sortOption = { upvotes: 1 };
        break;
      case 'old':
        sortOption = { createdAt: 1 };
        break;
      case 'recent':
        sortOption = { createdAt: -1 };
        break;

      default:
        break;
    }

    const answers = await Answer.find({
      question: questionId
    })
      .populate('author', '_id clerkId name picture')
      .sort(sortOption);

    revalidatePath(`/question/${questionId}`);
    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAnswer(
  params: DeleteAnswerParams
) {
  try {
    await connectToDatabase();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    await Answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );
    await Interaction.deleteMany({
      answer: answerId
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
