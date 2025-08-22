import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as AdminApi from '../admin';
import apiClient from '../api';

vi.mock('../api', () => {
  const mock = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: { request: { handlers: [] }, response: { handlers: [] } },
  };
  return { default: mock };
});

const api = apiClient as unknown as {
  get: any;
  post: any;
  put: any;
  delete: any;
};

const ok = (data: any) => Promise.resolve({ data });

describe('AdminApi contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getSystemStats GET /admin/stats', async () => {
    api.get.mockResolvedValueOnce(ok({}));
    await AdminApi.getSystemStats();
    expect(api.get).toHaveBeenCalledWith('/admin/stats');
  });

  it('getUserActivity GET /admin/users/activity-list with params', async () => {
    api.get.mockResolvedValueOnce(ok([]));
    await AdminApi.getUserActivity(20, true);
    expect(api.get).toHaveBeenCalledWith('/admin/users/activity-list', {
      params: { limit: 20, active_only: true },
    });
  });

  it('getSecurityAudit maps from/to to from_ts/to_ts', async () => {
    api.get.mockResolvedValueOnce(ok({}));
    await AdminApi.getSecurityAudit({ from: '2024-01-01', to: '2024-02-01' });
    expect(api.get).toHaveBeenCalledWith('/admin/security/audit', {
      params: { from_ts: '2024-01-01', to_ts: '2024-02-01' },
    });
  });

  it('getSystemLogs maps options and envelope default', async () => {
    api.get.mockResolvedValueOnce(ok([]));
    await AdminApi.getSystemLogs('ERROR', 50, {
      skip: 10,
      from: 'a',
      to: 'b',
      search: 'q',
      envelope: true,
    });
    expect(api.get).toHaveBeenCalledWith('/admin/system/logs', {
      params: {
        level: 'ERROR',
        limit: 50,
        skip: 10,
        from_ts: 'a',
        to_ts: 'b',
        search: 'q',
        envelope: true,
      },
    });
  });

  it('getAuditLogs maps filters and envelope', async () => {
    api.get.mockResolvedValueOnce(ok([]));
    await AdminApi.getAuditLogs(5, 25, 123, 'LOGIN', {
      from: 'a',
      to: 'b',
      envelope: true,
    });
    expect(api.get).toHaveBeenCalledWith('/admin/audit-logs', {
      params: {
        skip: 5,
        limit: 25,
        user_id: 123,
        action: 'LOGIN',
        from_ts: 'a',
        to_ts: 'b',
        envelope: true,
      },
    });
  });

  it('cleanupFiles POST with dry_run param', async () => {
    api.post.mockResolvedValueOnce(ok({}));
    await AdminApi.cleanupFiles(false);
    expect(api.post).toHaveBeenCalledWith('/admin/files/cleanup', null, {
      params: { dry_run: false },
    });
  });

  it('clearRateLimits POST no body', async () => {
    api.post.mockResolvedValueOnce(ok({}));
    await AdminApi.clearRateLimits();
    expect(api.post).toHaveBeenCalledWith('/admin/rate-limits/clear');
  });

  it('listUsers GET with pagination and envelope', async () => {
    api.get.mockResolvedValueOnce(ok({}));
    await AdminApi.listUsers(2, 10, true);
    expect(api.get).toHaveBeenCalledWith('/admin/users', {
      params: { skip: 2, limit: 10, envelope: true },
    });
  });

  it('updateUser PUT with body', async () => {
    api.put.mockResolvedValueOnce(ok({}));
    await AdminApi.updateUser(7, { is_active: false });
    expect(api.put).toHaveBeenCalledWith('/admin/users/7', {
      is_active: false,
    });
  });

  it('bulkUserAction POST with payload', async () => {
    api.post.mockResolvedValueOnce(ok({}));
    await AdminApi.bulkUserAction([1, 2, 3], 'activate');
    expect(api.post).toHaveBeenCalledWith('/admin/users/bulk-action', {
      user_ids: [1, 2, 3],
      action: 'activate',
    });
  });
});
