import ReviewModel from "src/models/ReviewModel";
import { StarsReview } from "./StarsReview";
import { format } from "date-fns";

export const Review: React.FC<{ review: ReviewModel }> = (props) => {
  const dateRender = format(new Date(props.review.date), "MMMM d, yyyy");

  return (
    <div className="mt-2 flex flex-col space-y-3">
      <h5 className="font-bold">{props.review.userEmail}</h5>
      <div className="flex flex-row justify-between">
        <div className="text-sm">{dateRender}</div>
        <div>
          <StarsReview rating={props.review.rating} size={16} />
        </div>
      </div>
      <div>
        <p className="text-sm italic">{props.review.reviewDescription}</p>
      </div>
      <hr />
    </div>
  );
};
