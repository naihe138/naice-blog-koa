export class FindArticleDto {
  current_page?: number;
  page_size?: number;
  keyword?: string;
  state?: number;
  tag?: string;
  type?: number;
  date?: string;
  hot?: string;
  publish?: number;
}
