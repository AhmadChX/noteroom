import Toast, { type ToastType } from './Toast';

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

/**
 * ToastContainer Component
 * 
 * Manages and displays toast notifications in a fixed position.
 * Features:
 * - Renders multiple toasts stacked vertically
 * - Fixed position at top-right of screen
 * - Each toast auto-dismisses after 3 seconds
 * - Pointer events managed to allow interaction with toasts while not blocking page
 */
export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}

