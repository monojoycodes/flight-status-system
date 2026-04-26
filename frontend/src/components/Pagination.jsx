import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

const Pagination = ({ page, totalPages, total, limit, onPageChange, onLimitChange }) => {
  if (totalPages <= 0) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing <strong>{from}–{to}</strong> of <strong>{total}</strong> flights
      </div>

      <div className="pagination-controls">
        <select
          className="input pagination-limit"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={25}>25 / page</option>
          <option value={50}>50 / page</option>
        </select>

        <div className="pagination-pages">
          <button
            className="page-btn"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft size={16} />
          </button>

          {start > 1 && (
            <>
              <button className="page-btn" onClick={() => onPageChange(1)}>1</button>
              {start > 2 && <span className="page-dots">…</span>}
            </>
          )}

          {pages.map((p) => (
            <button
              key={p}
              className={`page-btn ${p === page ? "active" : ""}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ))}

          {end < totalPages && (
            <>
              {end < totalPages - 1 && <span className="page-dots">…</span>}
              <button className="page-btn" onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </button>
            </>
          )}

          <button
            className="page-btn"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
