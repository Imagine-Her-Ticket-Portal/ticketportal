import React from "react";
import "./pagenavigation.css";

export default function Pagenavigation({ ticketsPerPage, totalTickets, currentPage, paginate }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalTickets / ticketsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="center">
      <div className="page-navigation">
        {pageNumbers.map((pageNumber) => (
          <div
            key={pageNumber}
            className={`circle ${currentPage === pageNumber ? "active" : ""}`}
            onClick={() => paginate(pageNumber)}
          >
            {pageNumber}
          </div>
        ))}
        <div
          className={`next center ${currentPage === pageNumbers.length ? "disabled" : ""}`}
          onClick={() => paginate(currentPage + 1)}
        >
          Next
        </div>
      </div>
    </div>
  );
}
