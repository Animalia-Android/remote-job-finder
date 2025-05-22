import { useJobItemsContext } from '../library/hooks';

export default function ResultsCount() {
  const { totalNumberOfResults } = useJobItemsContext();
  return (
    <p className="count">
      <span className="u-bold">{totalNumberOfResults}</span> results
    </p>
  );
}
