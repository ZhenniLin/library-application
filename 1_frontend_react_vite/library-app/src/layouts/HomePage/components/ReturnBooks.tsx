import { Link } from "react-router-dom";
import { Button } from "src/components/ui/button";
import Book1 from "src/Images/BooksImages/book-luv2code-1000.png";
import BookModel from "src/models/BookModel";

const ReturnBook: React.FC<{ book: BookModel }> = (props) => {
  return (
    <>
      {props.book.img ? (
        <img
          src={props.book.img}
          alt="book_image1"
          className="h-48 w-48 rounded-lg object-cover"
        />
      ) : (
        <img
          src={Book1}
          alt="book_image1"
          className="h-48 w-48 rounded-lg object-cover"
        />
      )}

      <div>
        <h3>{props.book.title}</h3>
        <p>{props.book.author}</p>
      </div>
      <Button
        variant="outline"
        className="border-2 border-cyan-700 bg-cyan-700 text-white"
      >
        <Link to={`checkout/${props.book.id}`}>Reserve</Link>
      </Button>
    </>
  );
};

export default ReturnBook;
