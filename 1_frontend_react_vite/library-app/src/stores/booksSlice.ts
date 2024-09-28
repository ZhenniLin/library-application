import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BookModel from "../models/BookModel";

export interface BooksState {
  books: BookModel[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  booksPerPage: number;
  totalAmountOfBooks: number;
  totalPages: number;
  search: string;
  searchUrl: string;
  categorySelection: string;
}

const initialState: BooksState = {
  books: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  booksPerPage: 5,
  totalAmountOfBooks: 0,
  totalPages: 0,
  search: "",
  searchUrl: "",
  categorySelection: "Book category",
};

// async thunk to fetch the books data
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (
    {
      currentPage,
      booksPerPage,
      searchUrl,
    }: {
      currentPage: number;
      booksPerPage: number;
      searchUrl: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const baseUrl = `${import.meta.env.VITE_REACT_APP_API}/books`;
      let url: string = searchUrl
        ? baseUrl + searchUrl.replace("<pageNumber>", `${currentPage - 1}`)
        : `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();
      const responseData = responseJson._embedded.books;

      const loadedBooks: BookModel[] = responseData.map((book: any) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        copies: book.copies,
        copiesAvailable: book.copiesAvailable,
        category: book.category,
        img: book.img,
      }));

      return {
        books: loadedBooks,
        totalAmountOfBooks: responseJson.page.totalElements,
        totalPages: responseJson.page.totalPages,
      };
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    }
  },
);

export const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setPage(state, action) {
      state.currentPage = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setSearchUrl(state, action) {
      state.searchUrl = action.payload;
    },
    setCategory(state, action) {
      state.categorySelection = action.payload;
    },
    resetSearch(state) {
      state.search = "";
      state.searchUrl = "";
      state.currentPage = 1;
      state.categorySelection = "All";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload.books;
        state.totalAmountOfBooks = action.payload.totalAmountOfBooks;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        // state.error = action.error.message || "Failed to load books";
        state.error = action.payload as string;
      });
  },
});

export const { setPage, setSearch, setSearchUrl, setCategory, resetSearch } =
  booksSlice.actions;
export default booksSlice.reducer;
