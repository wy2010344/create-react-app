import type { FC } from 'react';
import { mergeClassName } from '../util';

interface ContainerProps {
  className?: string
  children?: React.ReactNode
}

const Container: FC<ContainerProps> = ({ className, children }) => {
  return (<div className={mergeClassName(
    'px-6 py-3 max-w-screen-lg mx-auto',
    className,
  )}>
    {children}
  </div>);
}

export default Container;
