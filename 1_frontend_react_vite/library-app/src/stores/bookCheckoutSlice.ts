import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BookModel from "src/models/BookModel";
import ReviewModel from "src/models/ReviewModel";

// interface
export interface BookCheckoutState {
  book: BookModel | undefined;
  reviews: ReviewModel[];
  totalStars: number;
  isLoading: boolean;
  error: string | null;
  isLoadingReview: boolean;
  isReviewLeft: boolean;
  isLoadingUserReview: boolean;
  isCheckedOut: boolean;
  currentLoansCount: number;
  isLoadingCurrentLoansCount: boolean;
  isLoadingBookCheckedOut: boolean;
  displayError: boolean;
}

// initial - state
const initialState: BookCheckoutState = {
  book: undefined,
  reviews: [],
  totalStars: 0,
  isLoading: true,
  error: null,
  isLoadingReview: true,
  isReviewLeft: false,
  isCheckedOut: false,
  currentLoansCount: 0,
  isLoadingUserReview: true,
  isLoadingCurrentLoansCount: true,
  isLoadingBookCheckedOut: false,
  displayError: false,
};

// async operations
// fetch single book
export const fetchBook = createAsyncThunk(
  "bookCheckout/fetchBook",
  async (bookId: string, { rejectWithValue }) => {
    try {
      const baseUrl: string = `${import.meta.env.VITE_REACT_APP_API}/books/${bookId}`;

      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();

      const loadedBook: BookModel = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        img: responseJson.img,
      };

      return { book: loadedBook };
      // return responseJson;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  },
);

// fetch book reviews
export const fetchBookReviews = createAsyncThunk(
  "bookCheckout/fetchBookReviews",
  async (bookId: string, { rejectWithValue }) => {
    try {
      const reviewUrl: string = `${import.meta.env.VITE_REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;
      const response = await fetch(reviewUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);

      const dataReviews = data._embedded.reviews;

      let weightedStarReviews: number = 0;
      const loadedReviews: ReviewModel[] = dataReviews.map((review: any) => {
        weightedStarReviews += review.rating;
        return {
          id: review.id,
          userEmail: review.userEmail,
          date: review.date,
          rating: review.rating,
          book_id: review.bookId,
          reviewDescription: review.reviewDescription,
        };
      });

      const totalStars =
        loadedReviews.length > 0
          ? Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2
          : 0;

      return {
        reviews: loadedReviews,
        totalStars,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  },
);

// is user review left ?
export const isUserReviewBook = createAsyncThunk(
  "bookCheckout/isUserReviewBook",
  async (
    { bookId, authState }: { bookId: string; authState: any },
    { rejectWithValue },
  ) => {
    try {
      if (authState && authState.isAuthenticated) {
        const url = `${import.meta.env.VITE_REACT_APP_API}/reviews/secure/user/book/?bookId=${bookId}`;
        const requestOption = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(url, requestOption);
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const userReviewResponseJson = await response.json();
        return {
          isReviewLeft: userReviewResponseJson,
        };
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  },
);

// fetch the number of checked book of users
export const fetchUserCurrentLoansCount = createAsyncThunk(
  "bookCheckout/fetchUserCurrentLoansCount",
  async ({ authState }: { authState: any }, { rejectWithValue }) => {
    try {
      if (authState && authState.isAuthenticated) {
        const url = `${import.meta.env.VITE_REACT_APP_API}/books/secure/currentloans/count`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const currentLoansCountResponse = await fetch(url, requestOptions);
        if (!currentLoansCountResponse.ok) {
          throw new Error("Something went wrong!");
        }

        const currentLoansCountResponseJson =
          await currentLoansCountResponse.json();
        return { checked: currentLoansCountResponseJson };
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  },
);

// is the book checked out ?
export const isBookCheckedOut = createAsyncThunk(
  "bookCheckout/isBookCheckedOut",
  async (
    { bookId, authState }: { bookId: string; authState: any },
    { rejectWithValue },
  ) => {
    try {
      if (authState && authState.isAuthenticated) {
        const url = `${import.meta.env.VITE_REACT_APP_API}/books/secure/ischeckedout/byuser/?bookId=${bookId}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const bookCheckedOut = await fetch(url, requestOptions);
        if (!bookCheckedOut.ok) {
          throw new Error("Something went wrong!");
        }
        const bookCheckedOutResponseJson = await bookCheckedOut.json();
        return {
          success: bookCheckedOutResponseJson,
        };
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  },
);

// slice
const bookCheckoutSlice = createSlice({
  name: "bookCheckout",
  initialState,
  reducers: {
    setIsCheckedOut(state, action) {
      state.isCheckedOut = action.payload;
    },
    setIsReviewLeft(state, action) {
      state.isReviewLeft = action.payload;
    },
    setDisplayError(state, action) {
      state.displayError = action.payload;
    },
    resetState(state) {
      state.book = undefined;
      state.reviews = [];
      state.totalStars = 0;
      state.isReviewLeft = false;
      state.isCheckedOut = false;
      state.currentLoansCount = 0;
      state.isLoadingUserReview = true;
      state.isLoadingCurrentLoansCount = true;
      state.displayError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBook
      .addCase(fetchBook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.book = action.payload.book;
      })
      .addCase(fetchBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBookReviews.pending, (state) => {
        state.isLoadingReview = true;
        state.error = null;
      })
      .addCase(fetchBookReviews.fulfilled, (state, action) => {
        state.isLoadingReview = false;
        state.reviews = action.payload.reviews;
        state.totalStars = action.payload.totalStars;
      })
      .addCase(fetchBookReviews.rejected, (state, action) => {
        state.isLoadingReview = false;
        state.error = action.payload as string;
      })
      // isUserReviewBook
      .addCase(isUserReviewBook.pending, (state) => {
        state.isLoadingUserReview = true;
        state.error = null;
      })
      .addCase(isUserReviewBook.fulfilled, (state, action) => {
        state.isLoadingUserReview = false;
        state.isReviewLeft = action.payload?.isReviewLeft;
      })
      .addCase(isUserReviewBook.rejected, (state, action) => {
        state.isLoadingUserReview = false;
        state.error = action.payload as string;
      })
      // fetch the checked book of users
      .addCase(fetchUserCurrentLoansCount.pending, (state) => {
        state.isLoadingCurrentLoansCount = true;
        state.error = null;
      })
      .addCase(fetchUserCurrentLoansCount.fulfilled, (state, action) => {
        state.isLoadingCurrentLoansCount = false;
        state.currentLoansCount = action.payload?.checked;
      })
      .addCase(fetchUserCurrentLoansCount.rejected, (state, action) => {
        state.isLoadingCurrentLoansCount = false;
        state.error = action.payload as string;
      })
      // isBookCheckedOut
      .addCase(isBookCheckedOut.pending, (state) => {
        state.isLoadingBookCheckedOut = true;
        state.error = null;
      })
      .addCase(isBookCheckedOut.fulfilled, (state, action) => {
        state.isLoadingBookCheckedOut = false;
        state.isCheckedOut = action.payload?.success;
      })
      .addCase(isBookCheckedOut.rejected, (state, action) => {
        state.isLoadingBookCheckedOut = false;
        state.error = action.payload as string;
        state.displayError = true;
      });
  },
});

export const { setDisplayError, resetState, setIsReviewLeft, setIsCheckedOut } =
  bookCheckoutSlice.actions;
export default bookCheckoutSlice.reducer;
