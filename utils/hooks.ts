import {useEffect, useRef, useState} from 'react';
import {Alert, Platform} from 'react-native';
import KBottomSheet from '../components/KBottomSheet';

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
