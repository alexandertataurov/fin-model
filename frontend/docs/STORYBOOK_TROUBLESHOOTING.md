# Storybook Troubleshooting Guide

## RefreshRuntime Conflicts

### Problem

```
Identifier 'RefreshRuntime' has already been declared
```

This error occurs when there are conflicts between React Refresh and Storybook's refresh mechanism.

### Solutions

#### 1. Clear Cache and Reinstall Dependencies

```bash
# Clear Storybook cache
npm run storybook:clean

# Reinstall dependencies
npm install

# Start Storybook
npm run storybook
```

#### 2. Manual Cache Clearing

If the script doesn't work, manually remove these directories:

```bash
rm -rf node_modules/.cache
rm -rf node_modules/.vite
rm -rf .storybook-static
rm -rf storybook-static
```

#### 3. Check for Duplicate React Versions

Ensure you have consistent React versions:

```bash
npm ls react react-dom
```

#### 4. Verify Storybook Configuration

The `.storybook/main.ts` file should include:

- React Refresh plugin filtering
- Proper module resolution
- Disabled HMR

#### 5. Environment Variables

Set these environment variables:

```bash
export STORYBOOK_DISABLE_REACT_REFRESH=true
export STORYBOOK_DISABLE_HMR=true
```

#### 6. Alternative: Use Different Port

If port conflicts occur:

```bash
npm run storybook -- --port 6007
```

### Prevention

1. **Keep Dependencies Updated**: Regularly update Storybook and related packages
2. **Use Consistent React Versions**: Ensure React and React-DOM versions match
3. **Avoid Mixing Build Tools**: Don't mix Vite and Webpack configurations
4. **Clear Cache Regularly**: Run `npm run storybook:clean` before major changes

### Common Causes

1. **Multiple React Refresh Instances**: Vite and Storybook both trying to handle refresh
2. **Conflicting Plugin Configurations**: React plugins not properly filtered
3. **Cache Corruption**: Stale cache files causing conflicts
4. **Version Mismatches**: Incompatible versions of React, Vite, or Storybook

### Debug Steps

1. Check browser console for additional error messages
2. Verify all imports in story files
3. Ensure no duplicate React imports
4. Check for circular dependencies
5. Verify TypeScript configuration

### Fallback Solutions

If all else fails:

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install`
3. Clear all caches
4. Restart development server
