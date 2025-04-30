import { toast as sonnerToast } from "sonner";

const successStyle = {
  style: {
    backgroundColor: '#547d72',
    color: 'white',
  }
};

export const toast = {
  success: (message: string, options = {}) => {
    return sonnerToast.success(message, {
      ...successStyle,
      ...options
    });
  },
  error: sonnerToast.error,
  info: sonnerToast.info,
  warning: sonnerToast.warning
}; 