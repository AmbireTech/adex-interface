import { notifications } from '@mantine/notifications'
import { useCallback } from 'react'

type NotificationSeverity = 'error' | 'warning' | 'info'

const useCustomNotifications = () => {
  const showNotification = useCallback(
    (severity: NotificationSeverity, message: string, title?: string) => {
      let color = ''
      let notificationTitle = ''
      // eslint-disable-next-line default-case
      switch (severity) {
        case 'warning':
          color = 'orange'
          notificationTitle = title || 'Warning'
          break
        case 'error':
          color = 'red'
          notificationTitle = title || 'Error'
          break
        case 'info':
          color = 'blue'
          notificationTitle = title || 'Info'
          break
      }
      // console.log({ notificationTitle })
      notifications.show({
        // NOTE: just in case if somewhere is passed error objet
        title: notificationTitle.toString(),
        message: message.toString(),
        color
      })
    },
    []
  )

  return {
    showNotification
  }
}

export default useCustomNotifications
