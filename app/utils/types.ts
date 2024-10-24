import { ResourceType, User } from "@prisma/client";

  // Define the type for a Course
  export interface Course {
    id: string;
    name: string;
    description: string;
    subdirectory: string;
    degreeCode: string;
    module?: Module[];  // A course can have multiple modules
  }

// Define the type for a Module
export interface Module {
    id: string;  // Optional because it may not exist before being added
    name: string;
    description: string;
    slug: string;
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
    concept: Concept | null; // Note that `concept` can be `null` in your schema.
  }