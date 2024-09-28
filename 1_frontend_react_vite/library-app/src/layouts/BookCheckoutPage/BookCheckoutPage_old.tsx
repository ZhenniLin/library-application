import { useEffect, useState } from "react";
import BookModel from "src/models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { useParams } from "react-router-dom";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "src/models/ReviewModel";
import { LatestReview } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "src/models/ReviewRequest";

export const BookCheckoutPage = () => {
  const { authState } = useOktaAuth();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<any>(null);

  // review state
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStarts, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);
  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

  // loans count state
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
    useState(true);

  // is book check out ?
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

  // payment
  const [displayError, setDisplayError] = useState(false);

  // get path parameter out of url
  // const bookId = window.location.pathname.split("/")[2];
  const { bookId } = useParams<{ bookId: string }>();

  // fetch book data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const baseUrl: string = `${import.meta.env.VITE_REACT_APP_API}/books/${bookId}`;

        const response = await fetch(baseUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseJson = await response.json();

        const loadedBooks: BookModel = {
          id: responseJson.id,
          title: responseJson.title,
          author: responseJson.author,
          description: responseJson.description,
          copies: responseJson.copies,
          copiesAvailable: responseJson.copiesAvailable,
          category: responseJson.category,
          img: responseJson.img,
        };

        setBook(loadedBooks);
      } catch (err) {
        setHttpError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [isCheckedOut]);

  // fetch reviews data
  useEffect(() => {
    const fetchBookReviews = async () => {
      try {
        const reviewUrl: string = `${import.meta.env.VITE_REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;
        const responseReviews = await fetch(reviewUrl);

        if (!responseReviews.ok) {
          throw new Error(`HTTP error! status: ${responseReviews.status}`);
        }

        const responseJsonReviews = await responseReviews.json();
        const responseData = responseJsonReviews._embedded.reviews;
        let weightedStarReviews: number = 0;

        const loadedReviews: ReviewModel[] = responseData.map((review: any) => {
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

        if (loadedReviews) {
          const round = (
            Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2
          ).toFixed(1);
          setTotalStars(Number(round));
        }

        setReviews(loadedReviews);
      } catch (err) {
        setHttpError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoadingReview(false);
      }
    };

    fetchBookReviews();
  }, [isReviewLeft]);

  // is user review left ？
  useEffect(() => {
    const fetchUserReviewBook = async () => {
      try {
        if (authState && authState.isAuthenticated) {
          const url = `${import.meta.env.VITE_REACT_APP_API}/reviews/secure/user/book/?bookId=${bookId}`;

          const requestOpetion = {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authState.accessToken?.accessToken}`,
              "Content-Type": "application/json",
            },
          };

          const userReview = await fetch(url, requestOpetion);
          if (!userReview.ok) {
            throw new Error(`HTTP error! status: ${userReview.status}`);
          }

          const userReviewResponseJson = await userReview.json();
          setIsReviewLeft(userReviewResponseJson);
        }
      } catch (err) {
        setHttpError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoadingUserReview(false);
      }
    };
    fetchUserReviewBook();
  }, [authState]);

  // fetch the number of checked book
  useEffect(() => {
    const fetchUserCurrentLoansCount = async () => {
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
          setCurrentLoansCount(currentLoansCountResponseJson);
        }
      } catch (err) {
        setHttpError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoadingCurrentLoansCount(false);
      }
    };
    fetchUserCurrentLoansCount();
  }, [authState, isCheckedOut]);

  // fetch is the book checked out ?
  useEffect(() => {
    const fetchUserCheckedOutBook = async () => {
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
          setIsCheckedOut(bookCheckedOutResponseJson);
        }
      } catch (err) {
        setHttpError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoadingBookCheckedOut(false);
      }
    };
    fetchUserCheckedOutBook();
  }, [authState]);

  if (
    isLoading ||
    isLoadingReview ||
    isLoadingCurrentLoansCount ||
    isLoadingBookCheckedOut ||
    isLoadingUserReview
  ) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="min-w-screen min-h-screen bg-white text-center text-2xl text-cyan-700">
        <p>{httpError}</p>
      </div>
    );
  }

  // perform the checkout operation of the book
  async function checkoutBook() {
    const url = `${import.meta.env.VITE_REACT_APP_API}/books/secure/checkout/?bookId=${book?.id}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const checkoutResponse = await fetch(url, requestOptions);
    if (!checkoutResponse.ok) {
      setDisplayError(true);
      throw new Error("Something went wrong!");
    }
    setDisplayError(false);
    setIsCheckedOut(true);
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }

    const reviewRequestModel = new ReviewRequestModel(
      starInput,
      bookId,
      reviewDescription,
    );
    const url = `${import.meta.env.VITE_REACT_APP_API}/reviews/secure`;
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewRequestModel),
    };
    const returnResponse = await fetch(url, requestOptions);
    if (!returnResponse.ok) {
      throw new Error("Something went wrong!");
    }
    setIsReviewLeft(true);
  }

  return (
    <div className="mb-[2rem] flex w-full flex-col items-center">
      {displayError && (
        <div className="mx-3 mt-10 rounded-sm bg-red-100 px-10 py-1 text-xs text-red-700 sm:min-w-[20rem] md:text-sm">
          {" "}
          Please pay outstanding fees and/or return late book(s).{" "}
        </div>
      )}
      <div className="mx-8 flex flex-col items-center space-y-5 p-4 lg:flex-row lg:space-x-[4rem]">
        {/* book container */}
        <div className="max-h-[349px] min-h-[349px] min-w-[226px] max-w-[226px] sm:w-1/3">
          {book?.img ? (
            <img
              src={book?.img}
              alt="Book"
              className="h-full w-full object-cover"
              // width="226"
              // height="349"
            />
          ) : (
            <img
              src={require("src/Images/BooksImages/book-luv2code-1000.png")}
              alt="Book"
              className="h-full w-full object-cover"
              // width="226"
              // height="349"
            />
          )}
        </div>
        <div className="flex flex-col space-y-1">
          {/* info */}
          <h2 className="text-lg font-bold">{book?.title}</h2>
          <h5 className="text-blue-600">{book?.author}</h5>
          <p className="text-justify text-sm lg:h-[20rem] lg:w-[25rem] lg:overflow-scroll lg:text-base">
            {book?.description}
          </p>
          <StarsReview rating={totalStarts} size={32} />
        </div>
        {/* checkout and review box */}
        <CheckoutAndReviewBox
          book={book}
          currentLoansCount={currentLoansCount}
          isAuthenticated={authState?.isAuthenticated}
          isCheckedOut={isCheckedOut}
          checkoutBook={checkoutBook}
          isReviewLeft={isReviewLeft}
          submitReview={submitReview}
        />
      </div>
      <div className="mx-auto my-[2rem] w-4/5 border-t border-gray-300"></div>

      <div className="w-full max-w-5xl px-[5rem]">
        <LatestReview reviews={reviews} bookId={book?.id} />
      </div>
    </div>
  );
};
