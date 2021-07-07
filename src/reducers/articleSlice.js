import { createSlice } from "@reduxjs/toolkit";

export const articleSlice = createSlice({
  name: "article",
  initialState: {
    loading: false,
    article: [],
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setArticle: (state, action) => {
      state.article = action.payload;
    },
  },
});
export const { setLoading, setArticle } = articleSlice.actions;

export const selectLoading = (state) => state.article.loading;
export const selectArticle = (state) => state.article.article;

export default articleSlice.reducer;
