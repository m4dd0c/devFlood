import * as z from "zod";

const QuestionSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(100).max(10000),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

const AnswerSchema = z.object({
  answer: z.string().min(100),
});

const ProfileSchema = z.object({
  name: z.string().min(5).max(50),
  username: z.string().min(5).max(50),
  bio: z.string().min(10).max(150),
  portfolioWebsite: z.string().url(),
  location: z.string().min(5).max(50),
});
export { QuestionSchema, AnswerSchema, ProfileSchema };
