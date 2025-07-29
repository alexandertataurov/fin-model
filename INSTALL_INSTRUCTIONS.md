# Installation Instructions

To properly install all dependencies for the fin-model project, follow these steps:

## Install Dependencies

```bash
# Navigate to the project root
cd "c:\Python Dev Folder\fin-model\fin-model"

# Install dependencies with legacy peer deps flag to handle conflicts
npm install --legacy-peer-deps
```

If you still encounter errors, you can try the following alternative approaches:

### Alternative 1: Force Install

```bash
npm install --force
```

### Alternative 2: Clean Install

```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install --legacy-peer-deps
```

## Post-Installation Setup

After successfully installing dependencies:

1. Start the development server:

   ```bash
   npm run dev
   ```

2. In a separate terminal, run the backend:
   ```bash
   cd backend
   python main.py
   ```

## Potential Issues and Solutions

### Prettier Plugin Conflict

If you encounter issues with Prettier plugins, make sure your `.prettierrc.js` file properly configures the plugin order:

```js
plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
```

The order is important - the tailwindcss plugin must be last.

### TypeScript Errors

If you encounter TypeScript errors about missing types:

```bash
npm install --save-dev @types/node
```

### React Hook Form Resolver Error

If you see errors related to @hookform/resolvers:

```bash
npm install @hookform/resolvers@latest --legacy-peer-deps
```
