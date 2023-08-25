import type { FC } from 'react';
import { mergeClassName } from '../util';
import { MdPlayCircleFilled } from 'react-icons/md';
import Image from './Image';

interface CardProps {
  className?: string
  imageSrc: string
  title?: string
  onClick?(): void
  withPlay?: boolean
}

const Card: FC<CardProps> = ({
  className,
  imageSrc,
  title,
  onClick,
  withPlay
}) => {
  return (<div onClick={onClick} className={mergeClassName(
    'group mx-3 my-1.5 cursor-pointer'
  )}>
    <div className='h-[200px] relative rounded-lg overflow-hidden'>
      {withPlay && <div className="absolute hidden group-hover:flex items-center justify-center inset-0 before:absolute before:content-[''] before:bg-black before:opacity-70 before:inset-0" >
        <button className='relative z-10'>
          <MdPlayCircleFilled size={32} />
        </button>
      </div>}
      <Image src={imageSrc} />
    </div>
    <p className='py-1.5 line-clamp-2'>{title}</p>
  </div>);
}

export default Card;
