import { computed, reactive } from '@vue/composition-api';

interface UseUiNotification {
  message: string;
  type: 'danger' | 'success' | 'info';
  action?: { text: string; onClick: Function };
  icon?: string;
  persist?: boolean;
  id?: symbol;
  dismiss?: () => void;
}

type SendUiNotificationParams = Omit<UseUiNotification, 'id'>;

interface Notifications {
  notifications: Array<UseUiNotification>;
}

const state = reactive<Notifications>({
  notifications: []
});
const maxVisibleNotifications = 3;
const timeToLive = 3000;

const useUiNotification = () => {
  const send = (notification: SendUiNotificationParams) => {
    const id = Symbol();

    const dismiss = () => {
      const index = state.notifications.findIndex(notification => notification.id === id);

      if (index !== -1) state.notifications.splice(index, 1);
    };

    const newNotification = {
      ...notification,
      id,
      dismiss
    };

    state.notifications.push(newNotification);
    if (state.notifications.length > maxVisibleNotifications) state.notifications.shift();

    if (!notification.persist) {
      setTimeout(dismiss, timeToLive);
    }
  };

  return {
    send,
    notifications: computed(() => state.notifications)
  };
};

export default useUiNotification;
