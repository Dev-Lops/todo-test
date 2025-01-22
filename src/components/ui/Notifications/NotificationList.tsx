import { useNotification } from '../../../contexts/NotificationContext';

export function NotificationList() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            px-4 py-2 rounded-lg shadow-lg text-white
            ${notification.type === 'success' ? 'bg-teal-400' : ''}
            ${notification.type === 'error' ? 'bg-red-500' : ''}
            ${notification.type === 'info' ? 'bg-blue-500' : ''}
          `}
          onClick={() => removeNotification(notification.id)}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
} 