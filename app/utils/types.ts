import { ResourceType, User } from "@prisma/client";
import { JSONContent } from "novel";

  // Define the type for a Course
  export interface Course {
    id: string;
    name: string;
    description: string;
    subdirectory: string;
    degreeCode: string;
    module?: ModuleType[];  // A course can have multiple modules
    details: JSONContent;
  }

// Define the type for a Module
export interface ModuleType {
    id: string;  // Optional because it may not exist before being added
    name: string;
    description: string;
    slug: string;
    year: number;
    details: JSONContent;
  }
  
  export interface Post {
    id: string;
    title: string;
    postContent: string;
    smallDescription: string;
    image: string;
    slug: string;
    site: Site;
    user: User;
  }
  
  export interface Site {
    id: string;
    name: string;
    description: string;
    subdirectory: string;
    imageUrl?: string;
    posts?: Post[];
    user: User;
  }

  export interface Concept {
    id: string;
    name: string;
    description?: string | null;
    // resources: Resource[];
  }
  export interface Resource {
    id: string;
    name: string;
    slug: string;
    description: string;
    type: ResourceType;
    conceptId: string | null;
    concept: Concept | null;
    upVotes: number; // Add these properties
    downVotes: number; // Add these properties
  }

  export interface VoteState {
    upVotes: number;
    downVotes: number;
    userVote: "upvote" | "downvote" | null;
  }

  export interface Question {
    id: string;
    questionText: string;
    options: string[];
    correctAnswer: number;
  }
  
  export interface Quiz {
    id: string;
    title: string;
    description?: string;
    questions: Question[];
  }

  export interface QuizState {
    currentQuestionIndex: number;
    score: number;
    answers: { questionId: string; correct: boolean; userAnswer: number }[];
  }