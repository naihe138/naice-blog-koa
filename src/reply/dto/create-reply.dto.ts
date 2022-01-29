export class CreateReplyDto {
  post_id: string;
  cid: string;
  content: string;
  from: {
    gravatar: string;
    name: string;
    email: string;
    site?: string;
  };
}
