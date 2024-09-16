import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pagination } from "../../Utils/Pagination";
import { SpinnerLoading } from "src/layouts/Utils/SpinnerLoading";
import ReviewModel from "src/models/ReviewModel";
import { Review } from "src/layouts/Utils/Review";

export const ReviewListPage = () => {
  const [reviews, setReviews] = useState<ReviewModel[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<any>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { bookId } = useParams<{ bookId: string }>();
  console.log(bookId);
  // const bookId = window.location.pathname.split("/")[2];

  // fetch review data
  useEffect(() => {
    const fetchBookReviews = async () => {
      try {
        // const reviewUrl: string = `${process.env.VITE_REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;

        const reviewUrl: string = `${import.meta.env.VITE_REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;

        const responseReviews = await fetch(reviewUrl);

        if (!responseReviews.ok) {
          throw new Error(`HTTP error! status: ${responseReviews.status}`);
        }

        const responseJsonReviews = await responseReviews.json();
        const responseData = responseJsonReviews._embedded.reviews;

        setTotalAmountOfReviews(responseJsonReviews.page.totalElements);
        setTotalPages(responseJsonReviews.page.totalPages);

        const loadedReviews: ReviewModel[] = responseData.map((review: any) => {
          return {
            id: review.id,
            userEmail: review.userEmail,
            date: review.date,
            rating: review.rating,
            book_id: review.bookId,
            reviewDescription: review.reviewDescription,
          };
        });

        setReviews(loadedReviews);
      } catch (err) {
        setHttpError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookReviews();
  }, [currentPage]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    <div className="m-5">
      <p>{httpError}</p>
    </div>;
  }

  const indexOfLastReview: number = currentPage * reviewsPerPage;
  const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

  let lastItem =
    reviewsPerPage * currentPage <= totalAmountOfReviews
      ? reviewsPerPage * currentPage
      : totalAmountOfReviews;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="m-8">
      <div>
        <h3 className="text-lg font-bold sm:text-xl">
          Commment:({reviews?.length})
        </h3>
      </div>
      <p className="text-sm text-gray-600">
        {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
      </p>
      <div className="mt-5">
        {reviews?.map((review) => <Review review={review} key={review.id} />)}
      </div>
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
