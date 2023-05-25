import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  visiblePages,
  handlePageChange,
  styles,
}) => {
  return (
    <div className={styles['pagination']}>
      {currentPage > 1 && (
        <button
          className={styles['page-button']}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Ant
        </button>
      )}

      {visiblePages.map((page, index) => (
        <button
          key={index}
          className={page === currentPage ? styles['active-page-button'] : styles['page-button']}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          className={styles['page-button']}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Sig
        </button>
      )}
    </div>
  );
};

export default Pagination;
