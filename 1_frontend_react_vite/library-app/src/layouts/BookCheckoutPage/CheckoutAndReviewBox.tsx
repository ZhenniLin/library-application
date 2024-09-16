import { Link } from "react-router-dom";
import { Button } from "src/components/ui/button";
import BookModel from "src/models/BookModel";
import { LeaveAReview } from "../Utils/LeaveAReview";

export const CheckoutAndReviewBox: React.FC<{
  book: BookModel | undefined;
  currentLoansCount: number;
  isAuthenticated: any;
  isCheckedOut: boolean;
  checkoutBook: any;
  isReviewLeft: boolean;
  submitReview: any;
}> = (props) => {
  function buttonRender() {
    if (props.isAuthenticated) {
      if (!props.isCheckedOut && props.currentLoansCount < 5) {
        return (
          <Button
            asChild
            variant="outline"
            className="border-2 border-cyan-700 bg-cyan-700 text-white"
            onClick={() => props.checkoutBook()}
          >
            <Link to="#">Checkout</Link>
          </Button>
        );
      } else if (props.isCheckedOut) {
        return (
          <p>
            <b>Book checked out. Enjoy!</b>
          </p>
        );
      } else if (!props.isCheckedOut) {
        return <p>Too many books checked out.</p>;
      }
    }
    return (
      <Button
        asChild
        variant="outline"
        className="border-2 border-cyan-700 bg-cyan-700 text-white"
      >
        <Link to="/login">Sign in</Link>
      </Button>
    );
  }

  function reviewRender() {
    if (props.isAuthenticated && !props.isReviewLeft) {
      return (
        <p>
          {/* Leave a review component here. */}
          <LeaveAReview submitReview={props.submitReview} />
        </p>
      );
    } else if (props.isAuthenticated && props.isAuthenticated) {
      return (
        <p>
          <b>Thank you for your review!</b>
        </p>
      );
    }
    return (
      <div>
        <hr />
        <p>Sign in to be able to leave a review.</p>
      </div>
    );
  }

  return (
    <div className="flex max-w-[20rem] flex-col space-y-5 rounded-md border p-8">
      <div>
        {/* 0/5 books checked out */}
        <p className="text-sm">
          <b>{props.currentLoansCount}/5</b> books checked out
        </p>
      </div>
      <hr />
      <div className="flex flex-col space-y-4">
        {/* available */}
        {props.book &&
        props.book.copiesAvailable &&
        props.book.copiesAvailable > 0 ? (
          <h4 className="text-lg font-bold text-cyan-700">Available</h4>
        ) : (
          <h4 className="font-bold text-cyan-700">Wait list</h4>
        )}
        <div className="flex flex-row space-x-5">
          <p>
            <b>{props.book?.copies} </b>copies
          </p>
          <p>
            <b>{props.book?.copiesAvailable} </b>available
          </p>
        </div>
        {/* <Button
          asChild
          variant="outline"
          className="border-2 border-cyan-700 bg-cyan-700 text-white"
        >
          <Link to="/#">Sign in</Link>
        </Button> */}
        {buttonRender()}
      </div>
      <hr />
      <div className="flex flex-col space-y-4 text-sm">
        <p>This number can change until placing order has been complete.</p>
        {/* <p>Sign in be able to leave a review </p> */}
        {reviewRender()}
      </div>
    </div>
  );
};
