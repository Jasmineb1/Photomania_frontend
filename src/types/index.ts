export interface FetchResults{
    messag: string,
    postDetails: Posts[],
    
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
