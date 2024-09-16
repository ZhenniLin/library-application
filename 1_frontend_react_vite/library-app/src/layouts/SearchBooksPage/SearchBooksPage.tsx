import { useReducer } from "react";
import BookModel from "src/models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "src/components/ui/navigation-menu";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../Utils/Pagination";
import { Button } from "src/components/ui/button";
import { useBooks } from "src/hooks/useBooks";
import { initialState, reducer } from "src/hooks/booksReducer";

export const SearchBooksPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentPage, booksPerPage, search, searchUrl, categorySelection } =
    state;

  // custom hook - fetch data
  const { books, isLoading, httpError, totalAmountOfBooks, totalPages } =
    useBooks(currentPage, booksPerPage, searchUrl);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="min-w-screen min-h-screen bg-white text-center text-2xl text-cyan-700">
        <p>{httpError}</p>
      </div>
    );
  }

  const paginate = (pageNumber: number) => {
    dispatch({ type: "SET_PAGE", payload: pageNumber });
  };

  const searchHandleChange = () => {
    dispatch({ type: "SET_PAGE", payload: 1 });
    if (search === "") {
      dispatch({ type: "SET_SEARCH_URL", payload: "" });
    } else {
      const url = `/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`;
      dispatch({ type: "SET_SEARCH_URL", payload: url });
    }

    dispatch({ type: "SET_CATEGORY", payload: "Book category" });
  };

  const categoryField = (value: string) => {
    dispatch({ type: "RESET_SEARCH" });
    if (
      value.toLocaleLowerCase() === "fe" ||
      value.toLocaleLowerCase() === "be" ||
      value.toLocaleLowerCase() === "data" ||
      value.toLocaleLowerCase() === "devops"
    ) {
      const url = `/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`;
      dispatch({ type: "SET_CATEGORY", payload: value });
      dispatch({ type: "SET_SEARCH_URL", payload: url });
    } else {
      const url = `?page=<pageNumber>&size=${booksPerPage}`;
      dispatch({ type: "SET_CATEGORY", payload: "All" });
      dispatch({ type: "SET_SEARCH_URL", payload: url });
    }
  };

  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem =
    booksPerPage * currentPage <= totalAmountOfBooks
      ? booksPerPage * currentPage
      : totalAmountOfBooks;

  return (
    <div className="px-4 py-8">
      {/* search line */}
      <div className="item-center mb-6 ml-[3rem] flex space-x-2">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search"
            value={search}
            className="h-8 min-w-[40px] flex-1 rounded-md border border-gray-400 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm"
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH", payload: e.target.value })
            }
          />
          <button
            className="h-8 rounded-md bg-cyan-700 px-2 py-1 text-xs text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm"
            onClick={() => searchHandleChange()}
          >
            Search
          </button>
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-8 bg-gray-600 text-xs text-white sm:text-sm">
                {categorySelection}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="flex min-w-[150px] flex-col justify-center space-y-2 rounded-md bg-white p-4 text-xs shadow-lg sm:text-sm">
                <NavigationMenuLink
                  className="rounded-md px-2 py-1 hover:bg-gray-100"
                  onClick={() => categoryField("All")}
                >
                  All
                </NavigationMenuLink>
                <NavigationMenuLink
                  className="rounded-md px-2 py-1 hover:bg-gray-100"
                  onClick={() => categoryField("FE")}
                >
                  Front End
                </NavigationMenuLink>
                <NavigationMenuLink
                  className="rounded-md px-2 py-1 hover:bg-gray-100"
                  onClick={() => categoryField("BE")}
                >
                  Back End
                </NavigationMenuLink>
                <NavigationMenuLink
                  className="rounded-md px-2 py-1 hover:bg-gray-100"
                  onClick={() => categoryField("Data")}
                >
                  Data
                </NavigationMenuLink>
                <NavigationMenuLink
                  className="rounded-md px-2 py-1 hover:bg-gray-100"
                  onClick={() => categoryField("DevOps")}
                >
                  DevOps
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* description */}

      {totalAmountOfBooks > 0 ? (
        <>
          <div className="mb-2 ml-[3rem] mt-3 text-xs sm:text-sm">
            <h5>Number of result: ({totalAmountOfBooks})</h5>
          </div>

          <p className="mb-5 ml-[3rem] text-xs text-gray-500 sm:text-sm">
            {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
          </p>

          {/* SearchBook */}
          {books.map((book: BookModel) => (
            <SearchBook book={book} key={book.id} />
          ))}
        </>
      ) : (
        <div className="ml-[3rem] space-y-4">
          <h3 className="font-bold">Can't find what you are looking for ?</h3>
          <Button className="h-8 rounded-md bg-cyan-700 px-2 py-1 text-xs text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm">
            Library Service
          </Button>
        </div>
      )}

      {/* pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
