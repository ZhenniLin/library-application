import { Link } from "react-router-dom";
import { Button } from "src/components/ui/button";
import ReviewModel from "src/models/ReviewModel";
import { Review } from "../Utils/Review";

export const LatestReview: React.FC<{
  reviews: ReviewModel[];
  bookId: number | undefined;
}> = (props) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="text-lg font-bold">
        <h2>Latest Reviews:</h2>
      </div>
      <div>
        {props.reviews.length > 0 ? (
          <div className="flex flex-col space-y-5">
            {props.reviews.slice(0, 3).map((eachReview) => (
              <Review review={eachReview} key={eachReview.id} />
            ))}
            <div>
              <Button
                asChild
                variant="outline"
                className="border-2 border-cyan-700 bg-cyan-700 text-white"
              >
                <Link to={`/reviewlist/${props.bookId}`}>
                  Reach all reviews
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p>Currently there are no review for this book</p>
          </div>
        )}
      </div>
    </div>
  );
};
