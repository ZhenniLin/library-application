import { Dialog, DialogContent, DialogTrigger } from "src/components/ui/dialog";
import ShelfCurrentLoans from "src/models/ShelfCurrentLoans";

export const LoansModal: React.FC<{
  shelfCurrentLoan: ShelfCurrentLoans;
  returnBook: any;
  renewLoan: any;
}> = (props) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>Manage Loan</DialogTrigger>
        <DialogContent>
          {/* <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader> */}
          <p>Loan options</p>
          <hr className="mb-2" />
          <div className="mb-2 flex flex-col items-center sm:flex-row sm:justify-between">
            <div>
              {props.shelfCurrentLoan.book?.img ? (
                <img
                  src={props.shelfCurrentLoan.book?.img}
                  alt="Book"
                  className="mb-5 h-40 w-28 rounded-md object-cover"
                />
              ) : (
                <img
                  src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                  alt="Book"
                  className="mb-5 h-40 w-28 rounded-md object-cover"
                />
              )}
            </div>
            <div className="sm:flex-grow sm:pl-8">
              <p className="text-sm">{props.shelfCurrentLoan.book?.author}</p>
              <p className="text-md font-bold">
                {props.shelfCurrentLoan.book?.title}
              </p>
              <hr />
              <div className="mt-2">
                {props.shelfCurrentLoan.daysLeft > 0 && (
                  <p className="text-sm text-gray-700">
                    Due in {props.shelfCurrentLoan.daysLeft} days.
                  </p>
                )}
                {props.shelfCurrentLoan.daysLeft === 0 && (
                  <p className="text-sm">Due Today</p>
                )}
                {props.shelfCurrentLoan.daysLeft < 0 && (
                  <p className="text-sm">
                    Pass due by {props.shelfCurrentLoan.daysLeft} days.
                  </p>
                )}
              </div>
              <div className="mt-4 flex flex-col space-y-2">
                <div>
                  <button
                    className="rounded-lg border-2 border-cyan-700 bg-cyan-700 px-2 text-sm text-white"
                    onClick={() =>
                      props.returnBook(props.shelfCurrentLoan.book.id)
                    }
                  >
                    Return Book
                  </button>
                </div>
                <div>
                  <button
                    className={`rounded-lg border-2 border-cyan-700 bg-cyan-700 px-2 text-sm text-white ${props.shelfCurrentLoan.daysLeft < 0 ? "" : ""}`}
                    onClick={
                      props.shelfCurrentLoan.daysLeft < 0
                        ? (event) => event.preventDefault
                        : () => props.renewLoan(props.shelfCurrentLoan.book.id)
                    }
                  >
                    {/* <Link to={`search`}>Search more books</Link> */}

                    {props.shelfCurrentLoan.daysLeft < 0
                      ? "Late due cannot be renewed"
                      : "Renew loan for 7 days"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
