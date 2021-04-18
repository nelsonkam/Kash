import {useEffect, useRef, useState} from 'react';
import {Alert, Platform} from 'react-native';
import KBottomSheet from '../components/KBottomSheet';
import {useSWRInfinite} from 'swr/esm';
import {fetcherInfinite} from './api';
import {useSWRNativeRevalidate} from '@nandorojo/swr-react-native';

export type AsyncHook<T> = {
  execute: (...args: any) => Promise<T>;
  loading: boolean;
  value: T | null;
  error: Error | null;
};

export function useAsync<T>(
  asyncFn: (...args: any) => Promise<T>,
  alert = true,
): AsyncHook<T> {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState(null);
  const execute = (...args: any) => {
    setLoading(true);
    setError(null);
    setValue(null);

    return asyncFn(...args)
      .then((data: T) => {
        setLoading(false);
        setValue(data || <T>{});
        return data;
      })
      .catch(err => {
        setLoading(false);
        setError(err);

        console.warn(
          '[Request Error]',
          err.response ? err.response.data : err,
          err.response ? err.response.status : err.request.url,
        );
        throw err;
      });
  };

  return {execute, loading, value, error};
}

export const usePayment = () => {
  const viewRef = useRef<KBottomSheet>(null);
  const [reference, setReference] = useState(null);

  return {viewRef, reference, setReference};
};

export type InfiniteHook<T> = {
  data: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isEmpty: boolean;
  hasReachedEnd: boolean;
  isRefreshing: boolean;
  loadMore: () => void;
  refresh: () => void;
  error: Error;
};

export function useInfinite<T>(key: string, pageSize = 10): InfiniteHook<T> {
  const {
    size,
    data,
    error,
    isValidating,
    mutate,
    revalidate,
    setSize,
  } = useSWRInfinite((index, prevPage) => {
    if (prevPage && prevPage.length === 0) return null;
    if (index === 0) return `${key}?paginate=1&limit=${pageSize}`;
    return `${key}?paginate=1&limit=${pageSize}&offset=${pageSize * index}`;
  }, fetcherInfinite);

  useSWRNativeRevalidate({revalidate});

  return {
    data: data ? [].concat(...data) : [],
    isLoading: !data && !error,
    isLoadingMore:
      (!data && !error) ||
      (size > 0 && !!data && typeof data[size - 1] === 'undefined'),
    isEmpty: data?.[0]?.length === 0,
    hasReachedEnd:
      data?.[0]?.length === 0 ||
      (!!data && data[data.length - 1]?.length < pageSize),
    isRefreshing: isValidating && !!data && data.length === size,
    loadMore: () => setSize(size + 1),
    refresh: mutate,
    error,
  };
}
