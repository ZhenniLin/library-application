import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { Button } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import BookModel from "src/models/BookModel";

export const ChangeQuantityOfBook: React.FC<{
  book: BookModel;
  deleteBook: any;
}> = (props, key) => {
  const { authState } = useOktaAuth();
  const [quantity, setQuantity] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    const fetchBookInState = () => {
      props.book.copies ? setQuantity(props.book.copies) : setQuantity(0);
      props.book.copiesAvailable
        ? setRemaining(props.book.copiesAvailable)
        : setRemaining(0);
    };

    fetchBookInState();
  }, []);

  async function increaseQuantity() {
    const url = `${import.meta.env.VITE_REACT_APP_API}/admin/secure/increase/book/quantity/?bookId=${props.book.id}`;

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const quantityUpdateResponse = await fetch(url, requestOptions);

    if (!quantityUpdateResponse.ok) {
      throw new Error(`HTTP error! status: ${quantityUpdateResponse.status}`);
    }
    setQuantity(quantity + 1);
    setRemaining(remaining + 1);
  }

  async function decreaseQuantity() {
    const url = `${import.meta.env.VITE_REACT_APP_API}/admin/secure/decrease/book/quantity/?bookId=${props.book.id}`;

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const quantityUpdateResponse = await fetch(url, requestOptions);

    if (!quantityUpdateResponse.ok) {
      throw new Error(`HTTP error! status: ${quantityUpdateResponse.status}`);
    }
    setQuantity(quantity - 1);
    setRemaining(remaining - 1);
  }

  async function deleteBook() {
    const url = `${import.meta.env.VITE_REACT_APP_API}/admin/secure/delete/book/?bookId=${props.book.id}`;

    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const updateResponse = await fetch(url, requestOptions);

    if (!updateResponse.ok) {
      throw new Error(`HTTP error! status: ${updateResponse.status}`);
    }
    props.deleteBook();
  }

  return (
    <div className="mb-10">
      <Card className="flex flex-col space-y-5 p-5 shadow-lg sm:flex-row sm:space-x-10">
        <div className="m-auto sm:flex-shrink-0">
          {props.book.img ? (
            <img src={props.book.img} height="196" width="123" alt="Book" />
          ) : (
            <img
              src={require("./../../../Images//BooksImages/book-luv2code-1000.png")}
              height="196"
              width="123"
              alt="Book"
              className="m-atuo"
            />
          )}
        </div>
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm">{props.book.author}</p>
            <p className="font-bold">{props.book.title}</p>
            <p className="h-[10rem] overflow-scroll text-justify text-sm">
              {props.book.description}
            </p>
          </div>
          <div>
            <Button type="button" variant="outline" onClick={deleteBook}>
              Delete
            </Button>
          </div>
        </div>
        <div className="flex flex-col space-y-3 sm:justify-center">
          <div>
            <p className="text-sm">
              Total Quantity:
              <b>{quantity}</b>
            </p>
            <p className="text-sm">
              Books Remaining: <b>{remaining}</b>
            </p>
          </div>
          <Button type="button" variant="outline" onClick={increaseQuantity}>
            Add Quantity
          </Button>
          <Button type="button" variant="outline" onClick={decreaseQuantity}>
            Decrease Quantity
          </Button>
        </div>
      </Card>
    </div>
  );
};
