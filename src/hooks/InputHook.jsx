import { useState } from 'react'

export const useInput = initialValue => {
  const [value, setValue] = useState(initialValue)

  return {
    value,
    setValue,
    reset: () => setValue(initialValue),
    bind: {
      value,
      onChange: event => {
        if (event.target.type === 'checkbox') {
          setValue(event.target.checked)
        } else {
          setValue(event.target.value)
        }
      }
    }
  }
}
