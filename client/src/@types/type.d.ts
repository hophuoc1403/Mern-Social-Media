interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  friends: IUser[];
  location: string;
  occupation: string;
  viewedProfile: number;
  impressions: string;
  picturePath: string;
  updatedAt: string;
}

interface ISinglePost {
  description: string;
  id: number;
  picturePath: string;
}

interface ITag {
  id: number;
  name: string;
}

interface IPost {
  id: number;
  createdAt: string;
  post: ISinglePost;
  tags: ITag[];
  user: IUser;
  userRoot?: IUser;
  sharedContent?: string;
  likes: Like[];
  commentCount: number;
}

interface IComment {
  id: number;
  content: string;
  user: IUser;
  post: IPost;
  parentCommentId: number | null;
  createdAt:string
}

interface Like {
  id: number;
  user: IUser;
  post: IPost;
}

interface PaginationOptions {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
