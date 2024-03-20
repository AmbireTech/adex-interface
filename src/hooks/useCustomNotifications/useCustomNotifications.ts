import { notifications } from '@mantine/notifications'

const useCustomNotifications = () => {
  const showWarningNotification = (message: string, title = 'Warning') => {
    notifications.show({
      title,
      message,
      color: 'orange'
    })
  }

  const showDangerNotification = (message: string, title = 'Error') => {
    notifications.show({
      title,
      message,
      color: 'red'
    })
  }

  const showInfoNotification = (message: string, title = 'Information') => {
    notifications.show({
      title,
      message,
      color: 'blue'
    })
  }

  return {
    showWarningNotification,
    showDangerNotification,
    showInfoNotification
  }
}

export default useCustomNotifications
