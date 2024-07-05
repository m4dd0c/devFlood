import { BADGE_CRITERIA } from "@/constants";
import { ObjectId } from "mongoose";

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export interface IAnswer extends Document {
  author: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  content: string;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface ITag extends Document {
  name: string;
  description: string;
  questions: Schema.Types.ObjectId[];
  createdOn: Date;
  followers: Schema.Types.ObjectId[];
}

export interface IQuestion extends Document {
  title: string;
  content: string;
  tags: Schema.Types.ObjectId[];
  views: number;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  answers: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}
export interface IInteraction extends Document {
  action: string;
  user: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  answer: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}
export interface IUser extends Document {
  _id: ObjectId;
  clerkId: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  picture: string;
  location?: string;
  reputation?: number;
  portfolioWebsite?: string;
  saved: ObjectId[];
  createdAt: NativeDate;
  updatedAt: NativeDate;
}
export interface ISavedQuestion extends Omit<IQuestion, "author" | "tags"> {
  _id: ObjectId;
  author: IAuthor;
  tags: ITagSnippet[];
}
export interface ISaved extends Omit<IUser, "saved"> {
  saved: ISavedQuestion[];
}

export interface IQuestionWithAuthorTag
  extends Omit<IQuestion, "author" | "tags"> {
  _id: ObjectId;
  author: IAuthor;
  tags: ITagSnippet[];
}

export interface ITagQuestions extends Omit<ITag, "questions"> {
  questions: IQuestionWithAuthorTag[];
}
export interface IGetUserAnswers extends Omit<IAnswer, "author" | "question"> {
  _id: ObjectId;
  author: IAuthor;
  question: IQuestionSnippet;
}
interface IQuestionSnippet {
  _id: ObjectId;
  title: string;
}
export interface IAnswerWithAuthor extends Omit<IAnswer, "author"> {
  _id: ObjectId;
  author: IAuthor;
}
export interface IAuthor {
  _id: ObjectId;
  clerkId: string;
  name: string;
  picture: string;
}
export interface IGetQuestions extends Omit<IQuestion, "tags" | "author"> {
  _id: ObjectId;
  tags: ITag[];
  author: IUser;
}
export interface ITagSnippet {
  _id: ObjectId;
  name: string;
}

export interface Job {
  id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

export interface Country {
  name: {
    common: string;
  };
}

export interface ParamsProps {
  params: { id: string };
}

export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;
