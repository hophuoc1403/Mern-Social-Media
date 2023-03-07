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
    _id: "1",
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
        friends: state.user.friends,
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
    setPost: (state, action: { payload: { post_id: string; post: IPost } }) => {
      const updatedPost = state.posts.map((post) => {
        if (post._id === action.payload.post_id) {
          return { ...post, ...action.payload.post, comment: post.comment };
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
        (post) => post._id == action.payload.postId
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
