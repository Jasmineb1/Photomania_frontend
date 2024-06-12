export interface FetchResults {
  messag: string;
  postDetails: Posts[];
}
export interface Posts {
  post_id: number;
  post_img: string;
  image_name: string;
  post_caption: string;
  post_desc: string;
  posted_at: Date;
  updated_at: Date;
}

export enum Nav {
  Home,
  Create,
  Login,
  Signup,
  Profile,
  Logout
}

export interface Modal {
  showSignupModal: boolean;
  showLoginModal: boolean;
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
