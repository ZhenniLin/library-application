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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/stores/store";
import {
  fetchBook,
  fetchBookReviews,
  isUserReviewBook,
  isBookCheckedOut,
  fetchUserCurrentLoansCount,
  setIsReviewLeft,
  setIsCheckedOut,
  setDisplayError,
} from "src/stores/bookCheckoutSlice";

export const BookCheckoutPage = () => {
  const { authState } = useOktaAuth();
  const { bookId } = useParams<{ bookId: string }>();

  const dispatch = useDispatch<AppDispatch>();
  const {
    book,
    reviews,
    totalStars,
    isLoading,
    error,
    isLoadingReview,
    isReviewLeft,
    isCheckedOut,
    isLoadingUserReview,
    isLoadingBookCheckedOut,
    isLoadingCurrentLoansCount,
    currentLoansCount,
    displayError,
  } = useSelector((state: RootState) => state.bookCheckout);

  // fetch single boook - redux
  useEffect(() => {
    if (bookId) {
      dispatch(fetchBook(bookId));
    }
  }, [bookId, dispatch, isCheckedOut]);

  // fetch book reviews - redux
  useEffect(() => {
    if (bookId) {
      dispatch(fetchBookReviews(bookId));
    }
  }, [bookId, dispatch, isReviewLeft]);

  // is user review left ？- redux
  useEffect(() => {
    dispatch(isUserReviewBook({ bookId, authState }));
  }, [authState, dispatch, bookId]);

  // fetch the number of checked book of users
  useEffect(() => {
    dispatch(fetchUserCurrentLoansCount({ authState }));
  }, [authState, isCheckedOut]);

  // is the book checked out ? - redux
  useEffect(() => {
    dispatch(isBookCheckedOut({ bookId, authState }));
  }, [authState, dispatch, bookId]);

  if (
    isLoading ||
    isLoadingReview ||
    isLoadingCurrentLoansCount ||
    isLoadingBookCheckedOut ||
    isLoadingUserReview
  ) {
    return <SpinnerLoading />;
  }

  if (error) {
    return (
      <div className="min-w-screen min-h-screen bg-white text-center text-2xl text-cyan-700">
        <p>{error}</p>
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
      dispatch(setDisplayError(true));
      throw new Error("Something went wrong!");
    }
    dispatch(setDisplayError(false));
    dispatch(setIsCheckedOut(true));
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
    dispatch(setIsReviewLeft(true));
  }

  console.log(displayError);

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
          <StarsReview rating={totalStars} size={32} />
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
