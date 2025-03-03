interface ApiResponse<T>{
    jwt: string;
    data: T | null | any;
   messsage: string;
    success: boolean;
}

interface User{
    id: number;
    username: string;
    email: string;
}

interface BlogPost {
    id: number;
    documentId: string;
    title: string;
    author: number;
    content: string[]; // Assuming it's an array, update as needed
    blogStatus: "Pending" | "Published" | "Rejected"; // Add other possible statuses if needed
    slug: string;
    createdAt: string; // Consider Date if working with Date objects
    updatedAt: string;
    publishedAt: string;
  }

  interface Comment {
    id: number;
    blog: string;
    comment: string;
    author?:string;
    user?:string;
  }