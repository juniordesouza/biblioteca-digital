export interface Book {
    id: number;
    title: string;
    author: string;
    category: string;
    cover: string;
    description?: string;
    publisher?: string;
    rating?: number;
    quantity?: number;
  }