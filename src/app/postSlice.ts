import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setCachedPosts: (state, action) => {
      state.posts = action.payload;
    },
    clearCachedPosts: (state) => {
      state.posts = [];
    },
  },
});

export const { setCachedPosts, clearCachedPosts} = postsSlice.actions;
export default postsSlice.reducer;