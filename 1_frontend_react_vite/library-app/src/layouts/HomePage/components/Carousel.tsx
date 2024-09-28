import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ReturnBook from "./ReturnBooks";
import { useEffect } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/stores/store";
import { fetchBooks } from "src/stores/booksSlice";

const BookCarousel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { books, isLoading, error, currentPage, booksPerPage, searchUrl } =
    useSelector((state: RootState) => state.books);

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
