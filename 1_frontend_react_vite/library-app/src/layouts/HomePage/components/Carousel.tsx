import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ReturnBook from "./ReturnBooks";
import { useEffect, useState } from "react";
import BookModel from "src/models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

const BookCarousel = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const baseUrl: string = `${import.meta.env.VITE_REACT_APP_API}/books`;
        // const baseUrl: string = "${import.meta.env.VITE_REACT_APP_API}/books";
        const url: string = `${baseUrl}?page=0&size=9`;
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
        setBooks(loadedBooks);
      } catch (err) {
        setHttpError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

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

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3, // 每次滑动3个项目
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // 每次滑动3个项目
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="px-5 py-10">
      <h2 className="text-md mb-10 text-center font-bold sm:text-lg">
        Find your next "I stayed up too late reading" book.
      </h2>
      <Carousel
        responsive={responsive}
        swipeable={true}
        draggable={true}
        showDots={true}
        infinite={true}
        ssr={true}
      >
        {books.map((book) => (
          <div
            key={book.id}
            className="flex flex-col items-center justify-center space-y-2"
          >
            <ReturnBook book={book} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default BookCarousel;
