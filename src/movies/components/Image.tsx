import type { FC } from 'react';
import { mergeClassName } from '../util';

interface ImageProps {
  className?: string
  src: string
}

const Image: FC<ImageProps> = ({
  className,
  src
}) => {
  return (<div className={mergeClassName(
    'bg-primary h-full w-full rounded-md overflow-hidden',
    className
  )}>
    <img src={src} className='min-h-[240px] w-full h-full object-cover' />
  </div>);
}

export default Image;
