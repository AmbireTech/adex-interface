import { useState } from 'react'

export default function useMap<K, V>(): [
  Map<K, V>,
  {
    set: (key: K, value: V) => void
    unset: (key: K) => void
    clear: () => void
  }
] {
  const [state, setState] = useState<Map<K, V>>(new Map())

  const set = (key: K, value: V) => {
    setState((prev) => {
      const clone = new Map(prev)
      clone.set(key, value)
      return clone
    })
  }

  const unset = (key: K) => {
    setState((prev) => {
      const clone = new Map(prev)
      clone.delete(key)
      return clone
    })
  }

  const clear = () => {
    setState((prev) => {
      const clone = new Map(prev)
      clone.clear()
      return clone
    })
  }

  return [state, { set, unset, clear }]
}
