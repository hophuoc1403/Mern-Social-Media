import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  mode: "light" | "dark";
  user: IUser;
  token: string | null;
  posts: IPost[];
  postsSearched: IPost[];
}

const initialState: IInitialState = {
  mode: "dark",
  user: {
    id: 1,
    lastName: "admin",
    firstName: "ho",
    friends: [],
    impressions: "",
    viewedProfile: 0,
    occupation: "",
    location: "",
    picturePath: "",
    updatedAt: "",
  },
  token: null,
  posts: [],
  postsSearched: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUSer: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload.user,
        friends: [],
      };
    },
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = { ...action.payload.user };
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = initialState.user;
      state.token = null;
    },
    setFriends: (state, action: { payload: { friends: IUser[] } }) => {
      state.user.friends = action.payload.friends;
    },
    setPosts: (state, action: { payload: { posts: IPost[] } }) => {
      state.posts = action.payload.posts;
    },
    setAvatar: (state, action: { payload: { avatar: string } }) => {
      state.user.picturePath = action.payload.avatar;
    },
    setPost: (state, action: { payload: { postid: number; post: IPost } }) => {
      const updatedPost = state.posts.map((post) => {
        if (post.id === action.payload.postid) {
          return {
            ...post,
            ...action.payload.post,
            comment: post.commentCount,
          };
        }
        return post;
      });
      state.posts = [...updatedPost];
    },
    setPostsSearched: (state, action: { payload: { posts: IPost[] } }) => {
      state.postsSearched = action.payload.posts;
    },
    addNewestPost: (state, action: { payload: { post: IPost } }) => {
      state.posts = [action.payload.post, ...state.posts];
    },
    patchLikePost: (
      state,
      action: { payload: { postId: string; likedId: string } }
    ) => {
      let postInndex = state.posts.findIndex(
        (post) => post.id == action.payload.postId
      );
      if (state.posts[postInndex].likes[action.payload.likedId]) {
        delete state.posts[postInndex].likes[action.payload.likedId];
      } else {
        state.posts[postInndex].likes[action.payload.likedId] = true;
      }
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setPosts,
  setPost,
  setFriends,
  setAvatar,
  setUSer,
  setPostsSearched,
  addNewestPost,
} = authSlice.actions;

export default authSlice.reducer;
