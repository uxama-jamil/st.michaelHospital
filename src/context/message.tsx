import { createContext, useContext, useMemo } from 'react';
import { notification } from 'antd';

type MessageContextType = {
  success: (description: string, duration?: number) => void;
  error: (description: string, duration?: number) => void;
  info: (description: string, duration?: number) => void;
  warning: (description: string, duration?: number) => void;
  showError: (err: unknown, fallback?: string, duration?: number) => void;
};

enum NotificationType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}

notification.config({
  duration: 3, // default duration in seconds
});

const MessageContext = createContext<MessageContextType>({} as MessageContextType);

function MessageProvider({ children }: { children: React.ReactNode }) {
  const [api, contextHolder] = notification.useNotification();

  const NOTIFICATION_KEY = 'global_toast';

  const success = (description: string, duration?: number) =>
    api.open({
      key: NOTIFICATION_KEY,
      type: NotificationType.Success,
      message: NotificationType.Success,
      description,
      duration,
    });

  const error = (description: string, duration?: number) =>
    api.open({
      key: NOTIFICATION_KEY,
      type: NotificationType.Error,
      message: NotificationType.Error,
      description,
      duration,
    });

  const info = (description: string, duration?: number) =>
    api.open({
      key: NOTIFICATION_KEY,
      type: NotificationType.Info,
      message: NotificationType.Info,
      description,
      duration,
    });

  const warning = (description: string, duration?: number) =>
    api.open({
      key: NOTIFICATION_KEY,
      type: NotificationType.Warning,
      message: NotificationType.Warning,
      description,
      duration,
    });

  // Helper to extract error message
  const showError = (err: unknown, fallback = 'An error occurred', duration?: number) => {
    let msg = fallback;

    if (typeof err === 'string') {
      msg = err;
    } else if (err && typeof err === 'object') {
      // Handle API error with array of messages (e.g., NestJS validation error)
      if (
        'statusCode' in err &&
        (err as any).statusCode === 422 &&
        Array.isArray((err as any).message)
      ) {
        msg = (err as any).message
          .map((item: any) =>
            item.constraints ? Object.values(item.constraints).join(', ') : item.value || '',
          )
          .join('; ');
      }
      // Handle error with message property as string
      else if ('message' in err && typeof (err as any).message === 'string') {
        msg = (err as any).message || fallback;
      }
      // Handle error with message property as array of strings
      else if ('message' in err && Array.isArray((err as any).message)) {
        msg = (err as any).message.join('; ');
      }
    }

    error(msg, duration);
  };

  const value = useMemo(() => ({ success, error, info, warning, showError }), [api]);

  return (
    <MessageContext.Provider value={value}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
}

export default MessageProvider;

export const useMessage = () => useContext(MessageContext);
