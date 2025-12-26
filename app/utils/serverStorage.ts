import { BlogPost } from '../types/blog';
import { promises as fs } from 'fs';
import path from 'path';

const STORAGE_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

// データディレクトリが存在しない場合は作成
async function ensureDataDirectory() {
  const dataDir = path.dirname(STORAGE_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// ファイルからデータを読み込む
async function readPosts(): Promise<BlogPost[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(STORAGE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // ファイルが存在しない場合は空配列を返す
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// ファイルにデータを書き込む
async function writePosts(posts: BlogPost[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(STORAGE_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

export const getPosts = async (): Promise<BlogPost[]> => {
  return await readPosts();
};

export const savePost = async (post: BlogPost): Promise<void> => {
  const posts = await readPosts();
  const existingIndex = posts.findIndex((p) => p.id === post.id);
  
  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.push(post);
  }
  
  await writePosts(posts);
};

export const deletePost = async (id: string): Promise<void> => {
  const posts = await readPosts();
  const filteredPosts = posts.filter((p) => p.id !== id);
  await writePosts(filteredPosts);
};

export const getPostById = async (id: string): Promise<BlogPost | undefined> => {
  const posts = await readPosts();
  return posts.find((p) => p.id === id);
};

