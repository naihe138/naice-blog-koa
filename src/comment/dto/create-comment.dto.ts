export class CreateCommentDto {
  post_id: string;
  pid?: number;
  content: string;
  author: {
    name: string;
    email: string;
    site: string;
  };
}

export class GetArticleComment {
  sort: number;
  current_page: number;
  page_size: number;
  keyword: string;
  post_id: string;
  state: number;
}

export class Pagination {
  total: number;
  current_page: number;
  total_page: number;
  page_size: number;
}

export class FindComment {
  pagination: Pagination;
  list: Array<CreateCommentDto>;
}
