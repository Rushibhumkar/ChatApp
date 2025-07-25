import {
  useInfiniteQuery,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';
import {myConsole} from '../utils/myConsole';
import {useMemo} from 'react';

interface TUseMyInfiniteQuery {
  queryKey: any[];
  queryFn: any;
}

export const useMyInfiniteQuery = ({
  queryKey,
  queryFn,
}: TUseMyInfiniteQuery) => {
  const res = useInfiniteQuery<any>({
    queryKey,
    queryFn,
    getNextPageParam: lastPage => {
      return lastPage?.pagination?.hasNext
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const data = useMemo(
    () => res?.data?.pages?.flatMap(page => page?.data) || [],
    [res?.data?.pages],
  );

  const pageInfo = useMemo(() => {
    return res?.data?.pages?.[res.data?.pages?.length - 1]?.pagination;
  }, [res?.data?.pages]);

  return {...res, data, pageInfo};
};
