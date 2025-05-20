import React from "react";
import { CPagination, CPaginationItem } from "@coreui/react";
import "./pagination.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getPages = (current: number, total: number) => {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }
  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = getPages(currentPage, totalPages);

  return (
    <CPagination className="custom-pagination">
      <CPaginationItem
        disabled={currentPage === 1}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      >
        &lt;
      </CPaginationItem>
      {pages.map((page, idx) =>
        page === "..." ? (
          <CPaginationItem key={"ellipsis-" + idx} disabled>
            ...
          </CPaginationItem>
        ) : (
          <CPaginationItem
            key={page}
            active={page === currentPage}
            onClick={() => typeof page === "number" && onPageChange(page)}
          >
            {page}
          </CPaginationItem>
        )
      )}
      <CPaginationItem
        disabled={currentPage === totalPages}
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
      >
        &gt;
      </CPaginationItem>
    </CPagination>
  );
};

export default Pagination;
