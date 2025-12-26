export interface Author {
  name: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content?: string;
  author: Author;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}



