"use client";

import * as React from "react";

export type ToastType = "success" | "error" | "info" | "loading" | "default" | "destructive";

export interface Toast {
  id: string;
  type?: ToastType;
  variant?: ToastType;
  title?: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

/**
 * Hook to use toast notifications
 */
export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    // Fallback for when context is not available
    return {
      toast: (props: Omit<Toast, "id">) => {
        console.log("[Toast]", props);
      },
      dismiss: (id?: string) => {
        console.log("[Toast] Dismiss", id);
      },
    };
  }

  const { addToast, removeToast } = context;

  return {
    toast: (props: Omit<Toast, "id">) => {
      addToast(props);
    },
    dismiss: (id?: string) => {
      if (id) {
        removeToast(id);
      }
    },
  };
}

/**
 * Toast function for imperative usage
 */
export function toast(props: Omit<Toast, "id">) {
  // This is a simplified version that just logs
  // In a real implementation, this would need to access the ToastContext
  console.log("[Toast]", props);
}

toast.success = (props: Omit<Toast, "id" | "type">) => {
  toast({ ...props, type: "success" });
};

toast.error = (props: Omit<Toast, "id" | "type">) => {
  toast({ ...props, type: "error" });
};

toast.info = (props: Omit<Toast, "id" | "type">) => {
  toast({ ...props, type: "info" });
};

toast.loading = (props: Omit<Toast, "id" | "type">) => {
  toast({ ...props, type: "loading" });
};
