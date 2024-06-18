export interface FetchResults {
  message: string;
  // postDetails: Posts[];
  posts: Posts[];
  totalPages: number;
  currentPage: number;
  data: [];
}
export interface UserResponse {
  message: string;
  userdata: Users;
}
export interface UserPost {
  message: string;
  userPostdata: Posts[];
}
export interface Posts {
  postId: number;
  postImg: string;
  imageName: string;
  postCaption: string;
  postDesc: string;
  postedAt: Date;
  updatedAt: Date;
  postImgWidth: number;
  postImgHeight: number;
  nextPage: number | null;
}

export interface Users {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}
