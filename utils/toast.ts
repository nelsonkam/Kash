import {Notifier, NotifierComponents} from 'react-native-notifier';

export default {
  error(title: string, description: string) {
    Notifier.showNotification({
      title,
      description,
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: 'error',
      },
    });
  },
  success(title: string, description: string) {
    Notifier.showNotification({
      title,
      description,
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: 'success',
      },
    });
  },
};
