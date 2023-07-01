import React, { useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  selector: string;
}

function Portal({ children, selector }: PortalProps) {
  const portalRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const existingElement = document.querySelector(selector);

    if (existingElement) {
      portalRef.current = existingElement as HTMLElement;
    } else {
      const newElement = document.createElement('div');
      newElement.id = selector.substring(1); // Bỏ ký tự '#' trong selector
      document.body.appendChild(newElement);
      portalRef.current = newElement;
    }

    return () => {
      if (!document.querySelector(selector)) {
        document.body.removeChild(portalRef.current!);
      }
    };
  }, [selector]);

  return portalRef.current ? createPortal(children, portalRef.current) : null;
}

export default Portal;
