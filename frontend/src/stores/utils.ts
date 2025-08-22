export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated?: number | null;
}

/**
 * Utility to handle async resources in Zustand stores.
 * Wraps an API call and manages loading, data and error states.
 */
export const createAsyncResource = <S, K extends keyof S, T>(
  set: (fn: (state: S) => Partial<S>) => void,
  get: () => S,
  key: K,
  fetcher: (state: S) => Promise<T>,
  transform?: (result: T, state: S) => Partial<S[K]>
) => {
  return async () => {
    set(
      state =>
        ({
          [key]: {
            ...(state as any)[key],
            loading: true,
            error: null,
          },
        }) as any
    );

    try {
      const result = await fetcher(get());
      set(
        state =>
          ({
            [key]: {
              ...(state as any)[key],
              loading: false,
              error: null,
              lastUpdated: Date.now(),
              ...(transform ? transform(result, state as S) : { data: result }),
            },
          }) as any
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      set(
        state =>
          ({
            [key]: {
              ...(state as any)[key],
              loading: false,
              error: message,
            },
          }) as any
      );
    }
  };
};
