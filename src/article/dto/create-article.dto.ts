export class CreateArticleDto {
  title?: string;
  tag?: any[];
  content?: string;
  editContent?: string;
  keyword?: string;
  descript?: string;
  state?: number;
  publish?: number;
  thumb?: string;
  type?: number;
  meta?: {
    views: number;
    likes: number;
    comments: number;
  };
}
