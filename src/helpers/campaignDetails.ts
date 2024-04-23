import React from 'react'

export const countNestedElements = (value: React.ReactNode[] | React.ReactNode) => {
  let count = 0

  if (Array.isArray(value)) {
    value.forEach((child: React.ReactNode) => {
      if (React.isValidElement(child)) {
        count++

        if (child.props.children) {
          count += countNestedElements(child.props.children)
        }
      }
    })
  } else if (React.isValidElement(value)) {
    count++

    if (value.props.children) {
      count += countNestedElements(value.props.children)
    }
  }

  return count
}
