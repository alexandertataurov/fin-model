#!/usr/bin/env node

/**
 * Token validation script
 * Usage: node scripts/validate-tokens.ts
 */

import { validateTokens } from '../src/design-system/tokens/tokenValidator.ts';

function main() {
  console.log('🔍 Validating design system tokens...\n');

  // Validate tokens
  const validationResult = validateTokens();
  
  if (validationResult.isValid) {
    console.log('✅ Token validation passed!');
  } else {
    console.log('❌ Token validation failed!');
    console.log('\nErrors:');
    validationResult.errors.forEach(error => {
      console.log(`  • ${error}`);
    });
  }

  if (validationResult.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    validationResult.warnings.forEach(warning => {
      console.log(`  • ${warning}`);
    });
  }

  // Exit with appropriate code
  process.exit(validationResult.isValid ? 0 : 1);
}

main();
