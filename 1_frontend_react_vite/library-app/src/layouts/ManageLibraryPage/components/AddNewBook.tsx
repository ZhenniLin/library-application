import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { Card } from "src/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { Button } from "src/components/ui/button";
import AddBookRequest from "src/models/AddBookRequest";

export const AddNewBook = () => {
  const { authState } = useOktaAuth();

  // add book
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [copies, setCopies] = useState(0);
  const [category, setCategory] = useState("Category");
  const [selectedImage, setSlectedImage] = useState<any>(null);

  // displays
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  function categoryField(value: string) {
    setCategory(value);
  }

  async function base64ConversionForImages(e: any) {
    // console.log(e);
    if (e.target.files[0]) {
      getBase64(e.target.files[0]);
    }
  }

  function getBase64(file: any) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setSlectedImage(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error", error);
    };
  }

  async function submitNewBook() {
    const url = `${import.meta.env.VITE_REACT_APP_API}/admin/secure/add/book`;
    if (
      authState?.isAuthenticated &&
      title !== "" &&
      author !== "" &&
      category !== "Category" &&
      description !== "" &&
      copies >= 0
    ) {
      const book: AddBookRequest = new AddBookRequest(
        title,
        author,
        description,
        copies,
        category,
      );
      book.img = selectedImage;
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      };

      const submitNewBookResponse = await fetch(url, requestOptions);
      if (!submitNewBookResponse.ok) {
        throw new Error(`HTTP error! status: ${submitNewBookResponse.status}`);
      }

      setTitle("");
      setAuthor("");
      setDescription("");
      setCopies(0);
      setCategory("Category");
      setSlectedImage(null);
      setDisplayWarning(false);
      setDisplaySuccess(true);
    } else {
      setDisplayWarning(true);
      setDisplaySuccess(false);
    }
  }

  return (
    <>
      {displaySuccess && (
        <div className="mb-3 rounded-sm bg-green-200 px-2 py-1 text-sm text-green-700">
          Book added successfully
        </div>
      )}
      {displayWarning && (
        <div className="mb-3 rounded-sm bg-red-200 px-2 py-1 text-sm text-red-700">
          All fields must be filled out
        </div>
      )}
      <Card>
        <div>
          <div className="bg-gray-200 px-2 py-1 text-center">
            Add a new book
          </div>
        </div>
        <div className="px-5 py-3">
          <form method="POST" className="flex flex-col space-y-3">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex flex-col space-y-2">
                <label className="text-sm">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  className="rounded-sm border px-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm">Author</label>
                <input
                  type="text"
                  name="author"
                  required
                  onChange={(e) => setAuthor(e.target.value)}
                  value={author}
                  className="rounded-sm border px-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm">Category</label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex justify-center rounded-md border-2 border-cyan-700 bg-cyan-700 px-2 text-sm text-white focus:outline-none">
                    {category}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => categoryField("FE")}>
                      FE
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => categoryField("BE")}>
                      BE
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => categoryField("Data")}>
                      Data
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => categoryField("DevOps")}>
                      DevOps
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm">Description</label>
              <textarea
                id="exampleFormControlTextarea1"
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="rounded-sm border px-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              ></textarea>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm">Copies</label>
              <input
                type="number"
                name="copies"
                required
                onChange={(e) => setCopies(Number(e.target.value))}
                value={copies}
                className="w-[10rem] rounded-sm border px-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:w-[20rem]"
              />
            </div>
            <input
              type="file"
              className="text-sm"
              onChange={(e) => base64ConversionForImages(e)}
            />
            <div>
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={submitNewBook}
              >
                Add Book
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </>
  );
};
