/**
 * Enhanced P&L Tab - Temporarily Disabled
 * 
 * This component is temporarily disabled during the dashboard API migration.
 * Use the main PLDashboard page instead.
 */

import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

export interface PLTabEnhancedProps {
  period?: 'mtd' | 'qtd' | 'ytd' | 'last_30_days' | 'last_90_days' | 'last_12_months';
}

export function PLTabEnhanced() {
  // Component temporarily disabled during dashboard API migration
  return (
    <div className="p-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          P&L Tab Enhanced is temporarily unavailable during API migration. 
          Please use the main P&L Dashboard page instead.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default PLTabEnhanced;