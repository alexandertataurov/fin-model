import { describe, it, expect } from 'vitest';
import { createAsyncResource, AsyncState } from '../utils';

describe('createAsyncResource', () => {
  interface State {
    resource: AsyncState<string>;
  }

  const createStore = (resource: AsyncState<string>) => {
    let state: State = { resource };
    const set = (fn: (s: State) => Partial<State>) => {
      state = { ...state, ...fn(state) };
    };
    const get = () => state;
    return { set, get, getState: () => state };
  };

  it('updates state on success', async () => {
    const { set, get, getState } = createStore({
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    });
    const run = createAsyncResource<State, 'resource', string>(
      set,
      get,
      'resource',
      async () => 'ok'
    );
    await run();
    const resource = getState().resource;
    expect(resource.data).toBe('ok');
    expect(resource.loading).toBe(false);
    expect(resource.error).toBeNull();
    expect(resource.lastUpdated).toBeTypeOf('number');
  });

  it('handles errors', async () => {
    const { set, get, getState } = createStore({
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    });
    const run = createAsyncResource<State, 'resource', string>(
      set,
      get,
      'resource',
      async () => {
        throw new Error('fail');
      }
    );
    await run();
    const resource = getState().resource;
    expect(resource.data).toBeNull();
    expect(resource.loading).toBe(false);
    expect(resource.error).toBe('fail');
  });
});
