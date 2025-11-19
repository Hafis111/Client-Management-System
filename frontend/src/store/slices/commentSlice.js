import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Fetch all comments
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/comments");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);

// Create comment
export const createComment = createAsyncThunk(
  "comments/createComment",
  async (commentData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/comments", commentData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create comment"
      );
    }
  }
);

// Update comment
export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ id, commentData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/comments/${id}`, commentData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update comment"
      );
    }
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete comment"
      );
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearError } = commentSlice.actions;
export default commentSlice.reducer;
