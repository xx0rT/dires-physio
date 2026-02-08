import { useEffect, type ReactNode } from 'react';

interface VerticalScrollLockProps {
  children: ReactNode;
}

export function VerticalScrollLock({ children }: VerticalScrollLockProps) {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      html, body {
        overflow-x: hidden !important;
        max-width: 100vw !important;
      }
      * {
        overscroll-behavior-x: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return <>{children}</>;
}
