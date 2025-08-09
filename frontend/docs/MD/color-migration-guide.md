# Color Migration Guide - WCAG 2.1 AA Compliance

## Critical Issues Found in Application

### 🔴 High Priority Fixes Required

The following files contain non-compliant color combinations that need immediate attention:

### 1. **500-Series Colors (Poor Contrast)**

These need to be updated to 600/700 series for proper contrast:

```typescript
// ❌ BEFORE - Poor contrast (< 3:1 ratio)
bg - green - 500; // 2.6:1 contrast
bg - yellow - 500; // 1.9:1 contrast
bg - red - 500; // 3.1:1 contrast

// ✅ AFTER - WCAG compliant
bg - green - 700; // 4.6:1 contrast
bg - amber - 600; // 4.5:1 contrast
bg - red - 700; // 4.8:1 contrast
```

### 2. **Files Requiring Updates**

#### **Register.tsx** (Lines 367-370)

```typescript
// ❌ Current
? 'bg-green-500'
? 'bg-yellow-500'
: 'bg-red-500'

// ✅ Fixed
? 'bg-green-700 text-white'
? 'bg-amber-600 text-white'
: 'bg-red-700 text-white'
```

#### **password-input.tsx** (Lines 43-44)

```typescript
// ❌ Current
if (strength < 75) return 'bg-yellow-500';
return 'bg-green-500';

// ✅ Fixed
if (strength < 75) return 'bg-amber-600';
return 'bg-green-700';
```

#### **variants.ts** (Lines 62-64)

```typescript
// ❌ Current
'border-transparent bg-green-500 text-white shadow hover:bg-green-500/80';
'border-transparent bg-yellow-500 text-white shadow hover:bg-yellow-500/80';

// ✅ Fixed
'border-transparent bg-green-700 text-white shadow hover:bg-green-800';
'border-transparent bg-amber-600 text-white shadow hover:bg-amber-700';
```

#### **TornadoChart.tsx** (Lines 61-197)

```typescript
// ❌ Current
if (rank <= 3) return 'bg-red-500';
if (rank <= 9) return 'bg-yellow-500';

// ✅ Fixed
if (rank <= 3) return 'bg-red-700';
if (rank <= 9) return 'bg-amber-600';
```

#### **DashboardOverview.tsx** (Lines 471-473)

```typescript
// ❌ Current
overview.data_quality_score >= 0.8
  ? 'bg-green-500'
  : overview.data_quality_score >= 0.6
    ? 'bg-yellow-500'
    : 'bg-red-500';

// ✅ Fixed
overview.data_quality_score >= 0.8
  ? 'bg-green-700'
  : overview.data_quality_score >= 0.6
    ? 'bg-amber-600'
    : 'bg-red-700';
```

### 3. **Text Color Requirements**

When using colored backgrounds, always specify text color:

```typescript
// ❌ Missing text color
<div className="bg-green-700">Success</div>

// ✅ Explicit text color
<div className="bg-green-700 text-white">Success</div>
```

### 4. **Opacity Issues**

The toast component uses `opacity-90` which can reduce contrast:

```typescript
// ❌ In toast.tsx line 110
className={cn('text-sm opacity-90', className)}

// ✅ Consider using proper text color instead
className={cn('text-sm text-muted-foreground', className)}
```

## Implementation Checklist

- [ ] Update all `bg-green-500` → `bg-green-700`
- [ ] Update all `bg-yellow-500` → `bg-amber-600`
- [ ] Update all `bg-red-500` → `bg-red-700`
- [ ] Add explicit `text-white` classes
- [ ] Review opacity usage on colored backgrounds
- [ ] Test with accessibility tools
- [ ] Validate contrast ratios

## Standard Color Tokens

Use these approved combinations consistently:

```typescript
// Status Colors
const statusColors = {
  success: 'bg-green-700 text-white',
  warning: 'bg-amber-600 text-white',
  error: 'bg-red-700 text-white',
  info: 'bg-blue-700 text-white',
};

// Light Variants
const lightVariants = {
  success: 'bg-green-50 text-green-800 border-green-700',
  warning: 'bg-amber-50 text-amber-800 border-amber-600',
  error: 'bg-red-50 text-red-800 border-red-700',
  info: 'bg-blue-50 text-blue-800 border-blue-700',
};
```

## Testing

After implementing changes, test with:

1. **Automated Tools**
   - Chrome DevTools Lighthouse
   - axe-core browser extension
   - WAVE accessibility checker

2. **Manual Testing**
   - High contrast mode
   - Color blindness simulation
   - Keyboard navigation
   - Screen reader testing

## Next Steps

1. Apply fixes to identified files
2. Run accessibility audit
3. Update Storybook documentation
4. Add automated contrast testing to CI/CD
