export interface FetchResults {
  messag: string;
  postDetails: Posts[];
}
export interface Posts {
  postId: number;
  postImg: string;
  imageName: string;
  postCaption: string;
  postDesc: string;
  postedAt: Date;
  updatedAt: Date;
}

export interface Users {
  username: string;
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}
