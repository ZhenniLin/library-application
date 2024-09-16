import BookModel from "src/models/BookModel";

type SearchBookState = {
  books: BookModel[];
  isLoading: boolean;
  httpError: string | null;
  currentPage: number;
  booksPerPage: number;
  totalAmountOfBooks: number;
  totalPages: number;
  search: string;
  searchUrl: string;
  categorySelection: string;
};

type Action =
  | { type: "FETCH_INIT" }
  | {
      type: "FETCH_SUCCESS";
      payload: {
        books: BookModel[];
        totalAmountOfBooks: number;
        totalPages: number;
      };
    }
  | {
      type: "FETCH_FAILURE";
      payload: string;
    }
  | { type: "FETCH_FINISH" }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_SEARCH_URL"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "RESET_SEARCH" };

export const initialState: SearchBookState = {
  books: [],
  isLoading: true,
  httpError: null,
  currentPage: 1,
  booksPerPage: 5,
  totalAmountOfBooks: 0,
  totalPages: 0,
  search: "",
  searchUrl: "",
  categorySelection: "Book category",
};

export function reducer(state: SearchBookState, action: Action) {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true, httpError: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        books: action.payload.books,
        totalAmountOfBooks: action.payload.totalAmountOfBooks,
        totalPages: action.payload.totalPages,
      };
    case "FETCH_FAILURE":
      return { ...state, isLoading: false, httpError: action.payload };
    case "FETCH_FINISH":
      return { ...state, isLoading: false };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_SEARCH_URL":
      return { ...state, searchUrl: action.payload };
    case "SET_CATEGORY":
      return { ...state, categorySelection: action.payload };
    case "RESET_SEARCH":
      return {
        ...state,
        search: "",
        searchUrl: "",
        currentPage: 1,
        categorySelection: "Book category",
      };
    default:
      throw new Error(`Unknown action`);
  }
}
