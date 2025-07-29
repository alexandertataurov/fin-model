export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
export function ToastViewport() { return null; }
export function Toast({ children }: { children: React.ReactNode }) { return <div>{children}</div>; }
export function ToastTitle({ children }: { children: React.ReactNode }) { return <h6>{children}</h6>; }
export function ToastDescription({ children }: { children: React.ReactNode }) { return <p>{children}</p>; }
export function ToastClose() { return null; }
export function ToastAction() { return null; }
