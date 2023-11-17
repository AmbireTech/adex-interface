import { formatTimeShort } from 'helpers/formatters'
import { useCallback, useEffect, useState } from 'react'

const Clock = () => {
  const [currentTime, setCurrentTime] = useState('')

  const updateTime = useCallback(() => setCurrentTime(() => formatTimeShort()), [])

  useEffect(() => {
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [updateTime])
  return <span>{currentTime}</span>
}

export default Clock
