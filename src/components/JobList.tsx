import { useActiveIdContext } from '../library/hooks';
import { JobItem } from '../library/types';
import JobListItem from './JobListItem';
import Spinner from './Spinner';

type JobListProps = {
  jobItems: JobItem[];
  isLoading: boolean;
};

export function JobList({ jobItems, isLoading }: JobListProps) {
  const { activeId } = useActiveIdContext();

  const jobsList = jobItems?.map((jobItem) => {
    return (
      <JobListItem
        key={jobItem.id}
        jobItem={jobItem}
        isActive={activeId === jobItem.id}
      />
    );
  });

  return <ul className="job-list">{isLoading ? <Spinner /> : jobsList}</ul>;
}

export default JobList;
