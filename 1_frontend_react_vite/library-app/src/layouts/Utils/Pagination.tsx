import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "src/components/ui/pagination";

export const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  paginate: (page: number) => void;
}> = (props) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, props.currentPage - 2);
    let endPage = Math.min(props.totalPages, props.currentPage + 2);

    if (endPage - startPage + 1 > maxPagesToShow) {
      if (props.currentPage <= 3) {
        endPage = 5;
      } else if (props.currentPage >= props.totalPages - 2) {
        startPage = props.totalPages - 4;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <PaginationRoot>
      <PaginationContent>
        {props.currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              className="text-xs sm:text-sm"
              size="lg"
              onClick={() => props.paginate(props.currentPage - 1)}
            />
          </PaginationItem>
        )}

        {pageNumbers.map((number) => (
          <PaginationItem key={number}>
            <PaginationLink
              className="text-xs sm:text-sm"
              isActive={props.currentPage === number}
              onClick={() => props.paginate(number)}
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}

        {props.currentPage < props.totalPages && (
          <PaginationItem>
            <PaginationNext
              className="text-xs sm:text-sm"
              size="lg"
              onClick={() => props.paginate(props.currentPage + 1)}
              data-testid="pagination-next"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationRoot>
  );
};
