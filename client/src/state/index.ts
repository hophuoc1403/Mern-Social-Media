import {createSlice} from "@reduxjs/toolkit"



interface IInitialState {
  mode: "light" | "dark",
  user: IUser ,
  token: string | null,
  posts: IPost[]
}

const initialState: IInitialState = {
  mode: "light",
  user: {
    _id:"1",
    lastName:"admin",
    firstName:"ho",
    friends:[],
    impressions:"",
    viewedProfile:0,
    occupation:"",
    location:"",
    picturePath:"",
    updatedAt:""
  },
  token: null,
  posts: [],
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: state => {
      state.mode = state.mode === "light" ? "dark" : "light"
    },
    setLogin: (state, action) => {
      console.log(action.payload)
      state.user = {...action.payload.user};
      state.token = action.payload.token
    },
    setLogout: state => {
      state.user = initialState.user
      state.token = null
    },
    setFriends: (state, action: { payload: { friends: IUser[] } }) => {
      if (state.user) {
        state.user.friends = [...action.payload.friends]
      } else {
        throw Error("User friend not exit ... !!!")
      }
    },
    setPosts: (state, action: { payload: { posts: IPost[] } }) => {
      state.posts = action.payload.posts.reverse()
    },
    setPost: (state, action: { payload: { post_id: string, post: IPost } }) => {
      const updatedPost = state.posts.map(post => {
        if (post._id === action.payload.post_id) {
          return action.payload.post
        }
        return post
      })
      state.posts = [...updatedPost]
    }

  }
})

export const {setMode, setLogin, setLogout, setPosts, setPost, setFriends}
  = authSlice.actions

export default authSlice.reducer