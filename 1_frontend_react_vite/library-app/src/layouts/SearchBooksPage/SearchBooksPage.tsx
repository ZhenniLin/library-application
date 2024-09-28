import { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/stores/store";
import {
  fetchBooks,
  setPage,
  setSearch,
  setSearchUrl,
  setCategory,
  resetSearch,
} from "src/stores/booksSlice";

export const SearchBooksPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    books,
    isLoading,
    error,
    currentPage,
    booksPerPage,
    totalAmountOfBooks,
    totalPages,
    search,
    searchUrl,
    categorySelection,
  } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    dispatch(fetchBooks({ currentPage, booksPerPage, searchUrl }));
  }, [dispatch, currentPage, booksPerPage, searchUrl]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (error) {
    return (
      <div className="min-w-screen min-h-screen bg-white text-center text-2xl text-cyan-700">
        <p>{error}</p>
      </div>
    );
  }

  const handleSearch = () => {
    dispatch(setPage(1));
    if (search === "") {
      dispatch(setSearchUrl(""));
    } else {
      const url = `/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`;
      dispatch(setSearchUrl(url));
    }
    dispatch(setCategory("Book category"));
  };

  const handleCategorySelection = (value: string) => {
    dispatch(resetSearch());
    if (["fe", "be", "data", "devops"].includes(value.toLowerCase())) {
      const url = `/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`;
      dispatch(setCategory(value));
      dispatch(setSearchUrl(url));
    } else {
      const url = `?page=<pageNumber>&size=${booksPerPage}`;
      dispatch(setCategory("All"));
      dispatch(setSearchUrl(url));
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
            onChange={(e) => dispatch(setSearch(e.target.value))}
          />
          <button
            className="h-8 rounded-md bg-cyan-700 px-2 py-1 text-xs text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm"
            onClick={handleSearch}
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
                  onClick={() => handleCategorySelection("All")}
                >
                  All
                </NavigationMenuLink>
                <NavigationMenuLink
                  className="rounded-md px-2 py-1 hover:bg-gray-100"
                  onClick={() => handleCategorySelection("FE")}
                >
                  Front End
                </NavigationMenuLink>
                <NavigationMenuLink
                  className="rounded-md px-2 py-1 hover:bg-gray-100"
                  onClick={() => handleCategorySelection("BE")}
                >
                  Back End
                </NavigationMenuLink>
                <NavigationMenuLink
                  className="rounded-md px-2 py-1 hover:bg-gray-100"
                  onClick={() => handleCategorySelection("Data")}
                >
                  Data
                </NavigationMenuLink>
                <NavigationMenuLink
                  className="rounded-md px-2 py-1 hover:bg-gray-100"
                  onClick={() => handleCategorySelection("DevOps")}
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
          paginate={(pageNumber: number) => dispatch(setPage(pageNumber))}
        />
      )}
    </div>
  );
};
