import { useContext, useEffect, useState } from 'react';
import { JobItem, JobItemExpanded } from './types';
import { BASE_API_URL } from './constants';
import { useQueries, useQuery } from '@tanstack/react-query';
import { handleError } from './utilities';
import { BookmarksContext } from '../context/BookmarksContextProvider';
import { ActiveIdContext } from '../context/ActiveIdContextProvider';
import { SearchTextContext } from '../context/SearchTextContextProvider';
import { JobItemsContext } from '../context/JobItemsContextProvider';

type JobItemApiResponse = {
  public: boolean;
  jobItem: JobItemExpanded;
};

// --------------------------------------------------------------------------------------------------------------------------

const fetchJobItem = async (id: number): Promise<JobItemApiResponse> => {
  const response = await fetch(`${BASE_API_URL}/${id}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }

  const data = await response.json();

  return data;
};

// --------------------------------------------------------------------------------------------------------------------------

export function useActiveId() {
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const id = +window.location.hash.slice(1);
      setActiveId(id);
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return activeId;
}

// --------------------------------------------------------------------------------------------------------------------------

export function useJobItem(id: number | null) {
  const { data, isInitialLoading } = useQuery(
    ['job-item', id],
    () => (id ? fetchJobItem(id) : null),

    {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(id),
      onError: handleError,
    }
  );

  const jobItem = data?.jobItem;
  const isLoading = isInitialLoading;

  return { jobItem, isLoading } as const;

  // const [jobItem, setJobItem] = useState<JobItemExpanded | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  // useEffect(() => {
  //   if (!id) return;
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     const response = await fetch(`${BASE_API_URL}/${id}`);
  //     const data = await response.json();
  //     setIsLoading(false);
  //     setJobItem(data.jobItem);
  //   };
  //   fetchData();
  // }, [id]);
  // return { jobItem, isLoading };
}

// --------------------------------------------------------------------------------------------------------------------------

export function useJobItems(ids: number[]) {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['job-item', id],
      queryFn: () => fetchJobItem(id),

      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(id),
      onError: handleError,
    })),
  });

  const jobItems = results
    .map((result) => result.data?.jobItem)
    .filter((jobItem) => jobItem !== undefined) as JobItemExpanded[];

  const isLoading = results.some((result) => result.isLoading);

  return {
    jobItems,
    isLoading,
  };
}

// --------------------------------------------------------------------------------------------------------------------------

type JobItemsApiResponse = {
  public: boolean;
  sorted: boolean;
  jobItems: JobItem[];
};

const fetchJobItems = async (
  searchText: string
): Promise<JobItemsApiResponse> => {
  const response = await fetch(`${BASE_API_URL}?search=${searchText}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }
  const data = await response.json();
  return data;
};

// --------------------------------------------------------------------------------------------------------------------------

export function useSearchQuery(searchText: string) {
  const { data, isInitialLoading } = useQuery(
    ['job-items', searchText],
    () => fetchJobItems(searchText),
    {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(searchText),
      onError: handleError,
    }
  );
  const jobItems = data?.jobItems;
  const isLoading = isInitialLoading;

  return { jobItems, isLoading } as const;

  // const [jobItems, setJobItems] = useState<JobItem[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // useEffect(() => {
  //   if (!searchText) return;
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     const response = await fetch(`${BASE_API_URL}?search=${searchText}`);
  //     const data = await response.json();
  //     setJobItems(data.jobItems);
  //     setIsLoading(false);
  //   };
  //   fetchData();
  // }, [searchText]);
  // return { jobItems, isLoading } as const;
}

// --------------------------------------------------------------------------------------------------------------------------

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
  }, [value, delay]);

  return debouncedValue;
}

// --------------------------------------------------------------------------------------------------------------------------

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(() =>
    JSON.parse(localStorage.getItem(key) || JSON.stringify(initialValue))
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as const;
}

// --------------------------------------------------------------------------------------------------------------------------

export function useOnClickOutside(
  refs: React.RefObject<HTMLElement>[],
  handler: () => void
) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.target instanceof HTMLElement &&
        refs.every((ref) => !ref.current?.contains(event.target as Node))
      ) {
        handler();
      }
    };
    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
  }, [refs, handler]);
}

// --------------------------------------------------------------------------------------------------------------------------

export function useBookmarksContext() {
  const context = useContext(BookmarksContext);

  if (!context) {
    throw new Error(
      'useBookmarksContext must be used within a BookmarksContextProvider'
    );
  }
  return context;
}

// --------------------------------------------------------------------------------------------------------------------------

export function useActiveIdContext() {
  const context = useContext(ActiveIdContext);

  if (!context) {
    throw new Error(
      'useActiveIdContext must be used within a ActiveIdContextProvider'
    );
  }
  return context;
}

// --------------------------------------------------------------------------------------------------------------------------

export function useSearchTextContext() {
  const context = useContext(SearchTextContext);

  if (!context) {
    throw new Error(
      'useSearchTextContext must be used within a SearchTextContextProvider'
    );
  }
  return context;
}

// --------------------------------------------------------------------------------------------------------------------------

export function useJobItemsContext() {
  const context = useContext(JobItemsContext);

  if (!context) {
    throw new Error(
      'useJobItemsContext must be used within a JobItemsContextProvider'
    );
  }
  return context;
}
