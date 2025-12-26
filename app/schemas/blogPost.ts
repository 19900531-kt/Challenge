import { z } from 'zod';

// ブログ投稿フォームのバリデーションスキーマ
export const blogPostFormSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください')
    .trim(),
  content: z
    .string()
    .min(1, '内容は必須です')
    .min(10, '内容は10文字以上で入力してください')
    .max(5000, '内容は5000文字以内で入力してください')
    .trim(),
  author: z
    .string()
    .min(1, '著者を選択してください')
    .max(50, '著者名は50文字以内で入力してください')
    .trim(),
  tags: z
    .string()
    .optional()
    .transform((val) => {
      // カンマ区切りの文字列を配列に変換
      if (!val || val.trim() === '') {
        return [];
      }
      return val
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    })
    .pipe(
      z
        .array(z.string().min(1).max(20))
        .max(10, 'タグは10個まで入力できます')
    ),
});

export type BlogPostFormData = z.infer<typeof blogPostFormSchema>;

