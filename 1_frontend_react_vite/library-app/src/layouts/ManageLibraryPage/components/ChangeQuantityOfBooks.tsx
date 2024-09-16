import { useEffect, useState } from "react";
import { SpinnerLoading } from "src/layouts/Utils/SpinnerLoading";
import BookModel from "src/models/BookModel";
import { Pagination } from "../../Utils/Pagination";
import { ChangeQuantityOfBook } from "./ChangeQuantityOfBook";

export const ChangeQuantityOfBooks = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [bookDelete, setBookDelete] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const baseUrl: string = `${import.meta.env.VITE_REACT_APP_API}/books?page=${currentPage - 1}&size=${booksPerPage}`;

        const response = await fetch(baseUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseJson = await response.json();
        const responseDate = responseJson._embedded.books;
        setTotalAmountOfBooks(responseJson.page.totalElements);
        setTotalPages(responseJson.page.totalPages);

        console.log(responseDate);

        const loadedBooks: BookModel[] = responseDate.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          description: book.description,
          copies: book.copies,
          copiesAvailable: book.copiesAvailable,
          category: book.category,
          img: book.img,
        }));
        console.log(loadedBooks);
        setBooks(loadedBooks);
        console.log(books);
      } catch (err) {
        setHttpError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
    // window.scrollTo({
    //   top: 0,
    //   behavior: "smooth",
    // });
  }, [currentPage, bookDelete]);

  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem =
    booksPerPage * currentPage <= totalAmountOfBooks
      ? booksPerPage * currentPage
      : totalAmountOfBooks;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const deleteBook = () => setBookDelete(!bookDelete);

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

  return (
    <div>
      {totalAmountOfBooks > 0 ? (
        <>
          <div>
            <p>Number of results: {totalAmountOfBooks}</p>
          </div>
          <p className="mb-3">
            {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items
          </p>
          {books.map((book) => (
            <ChangeQuantityOfBook
              book={book}
              key={book.id}
              deleteBook={deleteBook}
            />
          ))}
        </>
      ) : (
        <h5>Add a book before changing quantity</h5>
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
