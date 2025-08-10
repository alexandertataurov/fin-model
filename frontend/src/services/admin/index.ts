export * from './users';
export * from './system';
export * from './logs';
export * from './maintenance';
export * from './reports';

// Provide a default aggregate export for compatibility with tests that reference
// the module's default (e.g., mocked.default.cleanupFiles)
import * as users from './users';
import * as system from './system';
import * as logs from './logs';
import * as maintenance from './maintenance';
import * as reports from './reports';

const defaultExport = {
  ...users,
  ...system,
  ...logs,
  ...maintenance,
  ...reports,
};

export default defaultExport;
