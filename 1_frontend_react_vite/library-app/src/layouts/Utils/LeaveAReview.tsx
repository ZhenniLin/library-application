import { useState } from "react";
import { StarsReview } from "./StarsReview";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";

export const LeaveAReview: React.FC<{ submitReview: any }> = (props) => {
  const [starInput, setStarInput] = useState(0);
  const [displayInput, setDisplayInput] = useState(false);
  const [reviewDescription, setReviewDescription] = useState("");

  function starValue(value: number) {
    setStarInput(value);
    setDisplayInput(true);
  }

  return (
    <div className="space-y-4">
      {/* <h5>Leave a review?</h5> */}
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md border-2 border-cyan-700 bg-cyan-700 px-2 py-1 text-white">
          Leave a review ?
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Rating</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => starValue(0)}>
            0 start
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => starValue(0.5)}>
            0.5 start
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => starValue(1)}>
            1 start
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => starValue(1.5)}>
            1.5 start
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => starValue(2)}>
            2 start
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => starValue(2.5)}>
            2.5 start
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => starValue(3)}>
            3 start
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => starValue(3.5)}>
            3.5 start
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => starValue(4)}>
            4 start
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => starValue(4.5)}>
            4.5 start
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => starValue(5)}>
            5 start
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <StarsReview rating={starInput} size={32} />
      {displayInput && (
        <form method="POST" action="#" className="space-y-2">
          <hr />
          <div className="space-y-2">
            <label>Description</label>
            <textarea
              id="submitReviewDescription"
              placeholder="Optional"
              className="border p-2"
              rows={3}
              onChange={(e) => setReviewDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            {/* <Button
              variant="outline"
              className="border-2 border-cyan-700 bg-cyan-700 text-white"
              onClick={() => props.submitReview(starInput, reviewDescription)}
            >
              Submit Review
            </Button> */}
            <button
              type="button"
              className="border-2 border-cyan-700 bg-cyan-700 px-2 py-1 text-white hover:bg-white hover:text-cyan-700"
              onClick={() => props.submitReview(starInput, reviewDescription)}
            >
              Submit Review
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
