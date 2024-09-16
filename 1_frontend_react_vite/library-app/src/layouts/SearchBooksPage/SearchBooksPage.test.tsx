import { describe } from "node:test";
import { SearchBooksPage } from "./SearchBooksPage";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/";

import { BrowserRouter } from "react-router-dom";

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        _embedded: {
          books: [
            {
              id: 1,
              title: "Test Book",
              author: "Test Author",
              description: "Test Description",
              copies: 5,
              copiesAvailable: 3,
              category: "FE",
              img: null,
            },
            {
              id: 2,
              title: "Test Book 2",
              author: "Test Author 2",
              description: "Test Description 2",
              copies: 3,
              copiesAvailable: 1,
              category: "BE",
              img: null,
            },
            {
              id: 3,
              title: "Test Book 3",
              author: "Test Author 3",
              description: "Test Description 3",
              copies: 4,
              copiesAvailable: 2,
              category: "Data",
              img: null,
            },
            {
              id: 4,
              title: "Test Book 4",
              author: "Test Author 4",
              description: "Test Description 4",
              copies: 2,
              copiesAvailable: 1,
              category: "DevOps",
              img: null,
            },
            {
              id: 5,
              title: "Test Book 5",
              author: "Test Author 5",
              description: "Test Description 5",
              copies: 3,
              copiesAvailable: 2,
              category: "FE",
              img: null,
            },
          ],
        },
        page: {
          totalElements: 6, // total 6 books
          totalPages: 2, // 2 pages given 5 books per page
        },
      }),
  }),
) as jest.Mock;

describe("SearchBooksPage - Integration Testing", () => {
  beforeEach(() => {
    // 清除之前的 mock 数据
    (fetch as jest.Mock).mockClear();
  });

  test("renders and loads books successfully", async () => {
    render(
      <BrowserRouter>
        <SearchBooksPage />
      </BrowserRouter>,
    );

    // Check initial loading spinner
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    // Wait for books data to load
    const bookTitle = await screen.findByText("Test Book");
    expect(bookTitle).toBeInTheDocument();

    const bookAuthor = screen.getByText("Test Author");
    expect(bookAuthor).toBeInTheDocument();

    const bookDescription = screen.getByText("Test Description");
    expect(bookDescription).toBeInTheDocument();
  });

  test("handles pagination correctly", async () => {
    render(
      <BrowserRouter>
        <SearchBooksPage />
      </BrowserRouter>,
    );

    // Wait for first page books data to load
    await waitFor(() => {
      expect(screen.getByText("Test Book")).toBeInTheDocument();
    });

    // Mock API response for the second page
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            _embedded: {
              books: [
                {
                  id: 6,
                  title: "Test Book 6",
                  author: "Test Author 6",
                  description: "Test Description 6",
                  copies: 1,
                  copiesAvailable: 1,
                  category: "BE",
                  img: null,
                },
              ],
            },
            page: {
              totalElements: 6, // total 6 books
              totalPages: 2, // 2 pages given 5 books per page
            },
          }),
      }),
    ) as jest.Mock;

    // Simulate clicking on the next page button
    const nextPageButton = screen.getByTestId("pagination-next");
    fireEvent.click(nextPageButton);

    // Wait for second page books data to load
    const newBookTitle = await screen.findByText("Test Book 6");
    expect(newBookTitle).toBeInTheDocument();

    // Ensure the first page book is no longer in the document
    expect(screen.queryByText("Test Book")).not.toBeInTheDocument();
  });
});
