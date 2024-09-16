import { Link } from "react-router-dom";
import { Button } from "src/components/ui/button";
import BookModel from "src/models/BookModel";

export const SearchBook: React.FC<{ book: BookModel }> = (props) => {
  return (
    <div className="h-30 m-10 mb-8 flex flex-col items-center justify-center rounded-md p-5 shadow-lg hover:shadow-2xl sm:flex-row sm:justify-between sm:space-x-5">
      <div className="flex flex-col items-center sm:flex-row sm:space-x-5">
        {/* image */}
        <img
          src={props.book.img}
          alt="img"
          className="mb-5 h-full max-h-48 min-h-48 w-full min-w-32 max-w-32 object-cover"
        />
        {/* content */}
        <div className="sm:max-w-45">
          <h2 className="text-sm" data-testid="book author">
            {props.book.author}
          </h2>
          <h1 className="md:text-md mb-3 text-sm font-bold">
            {props.book.title}
          </h1>
          <p
            className="mb-3 h-40 max-w-xl overflow-auto text-justify text-xs md:text-sm"
            data-testid="book description"
          >
            {props.book.description}
          </p>
        </div>
      </div>

      {/* view detail button */}
      <Button
        variant="outline"
        className="h-6 border-2 border-cyan-700 bg-cyan-700 text-xs text-white md:text-sm"
      >
        <Link to={`/checkout/${props.book.id}`}>View Details</Link>
      </Button>
    </div>
  );
};
