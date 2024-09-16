import { useEffect, useReducer } from "react";
import BookModel from "src/models/BookModel";
import { initialState, reducer } from "./booksReducer";

export function useBooks(
  currentPage: number,
  booksPerPage: number,
  searchUrl: string,
) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchBooks = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const baseUrl: string = `${import.meta.env.VITE_REACT_APP_API}/books`;

        let url: string = "";

        if (searchUrl === "") {
          url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
        } else {
          let searchWithPage = searchUrl.replace(
            "<pageNumber>",
            `${currentPage - 1}`,
          );
          url = baseUrl + searchWithPage;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // json()读取相应体json格式的字符串，将JSON字符串解析为javascript对象
        const responseJson = await response.json();
        const responseBookData = responseJson._embedded.books;

        // api会提供 搜索书的数量 / 搜索的所有页面
        // setTotalAmountOfBooks(responseJson.page.totalElements);
        // setTotalPages(responseJson.page.totalPages);

        const loadedBooks: BookModel[] = responseBookData.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          description: book.description,
          copies: book.copies,
          copiesAvailable: book.copiesAvailable,
          category: book.category,
          img: book.img,
        }));
        // setBooks(loadedBooks);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            books: loadedBooks,
            totalAmountOfBooks: responseJson.page.totalElements,
            totalPages: responseJson.page.totalPages,
          },
        });
      } catch (err) {
        dispatch({
          type: "FETCH_FAILURE",
          payload:
            err instanceof Error ? err.message : "An unknown error occurred",
        });
        // setHttpError(
        //   err instanceof Error ? err.message : "An unknown error occurred",
        // );
      } finally {
        dispatch({ type: "FETCH_FINISH" });
      }
    };
    fetchBooks();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage, searchUrl]);

  // 从 state 中解构出需要的状态值，并返回这些值
  const { books, isLoading, httpError, totalAmountOfBooks, totalPages } = state;

  return { books, isLoading, httpError, totalAmountOfBooks, totalPages };
}
