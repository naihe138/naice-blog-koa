export class CreateHeroDto {
  name: string;
  content: string;
  author: {
    gravatar: string;
    name: string;
    email: string;
    site: string;
  };
  state: number;
  ip: string;
  city: string;
  range: string;
  country: string;
  agent: string;
  create_time?: string;
}
