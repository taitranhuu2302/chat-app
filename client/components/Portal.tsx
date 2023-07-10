import React, { PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

const Portal: React.FC<PropsWithChildren> = ({ children }) => {
  return createPortal(children, document.body)
}

export default Portal