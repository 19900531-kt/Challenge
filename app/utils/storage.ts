import { BlogPost } from '../types/blog';

const STORAGE_KEY = 'mini-blog-posts';

// サーバーサイド用のメモリストレージ
let serverStorage: BlogPost[] = [];

export const getPosts = (): BlogPost[] => {
  if (typeof window === 'undefined') {
    // サーバーサイド: メモリストレージを使用
    return serverStorage;
  }
  // クライアントサイド: localStorage を使用
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const savePost = (post: BlogPost): void => {
  if (typeof window === 'undefined') {
    // サーバーサイド: メモリストレージを使用
    const posts = getPosts();
    const existingIndex = posts.findIndex((p) => p.id === post.id);
    
    if (existingIndex >= 0) {
      posts[existingIndex] = post;
    } else {
      posts.push(post);
    }
    serverStorage = posts;
    return;
  }
  // クライアントサイド: localStorage を使用
  const posts = getPosts();
  const existingIndex = posts.findIndex((p) => p.id === post.id);
  
  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.push(post);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const deletePost = (id: string): void => {
  if (typeof window === 'undefined') {
    // サーバーサイド: メモリストレージを使用
    serverStorage = getPosts().filter((p) => p.id !== id);
    return;
  }
  // クライアントサイド: localStorage を使用
  const posts = getPosts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const getPostById = (id: string): BlogPost | undefined => {
  return getPosts().find((p) => p.id === id);
};



