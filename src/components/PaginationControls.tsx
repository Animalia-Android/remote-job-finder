import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { PageDirection } from '../library/types';
import { useJobItemsContext } from '../library/hooks';

export default function PaginationControls() {
  const {
    currentPage,
    totalNumberOfPages,
    handleChangePage: onClick,
  } = useJobItemsContext();

  return (
    <section className="pagination">
      {currentPage > 1 && (
        <PaginationButton
          direction="previous"
          currentPage={currentPage}
          onClick={() => onClick('previous')}
        />
      )}
      {currentPage < totalNumberOfPages && (
        <PaginationButton
          direction="next"
          currentPage={currentPage}
          onClick={() => onClick('next')}
        />
      )}
    </section>
  );
}

type PaginationButtonProps = {
  direction: PageDirection;
  currentPage: number;
  onClick: () => void;
};

function PaginationButton({
  currentPage,
  direction,
  onClick,
}: PaginationButtonProps) {
  return (
    <button
      className={`pagination__button pagination__button--${direction}`}
      onClick={(e) => {
        onClick();
        e.currentTarget.blur();
      }}
    >
      {direction === 'previous' && (
        <>
          <ArrowLeftIcon /> Page {currentPage - 1}
        </>
      )}

      {direction === 'next' && (
        <>
          Page {currentPage + 1} <ArrowRightIcon />
        </>
      )}
    </button>
  );
}
