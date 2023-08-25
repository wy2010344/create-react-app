import type { FC } from 'react';
import { mergeClassName } from '../util';
import Container from './Container';
import { IoIosClose } from 'react-icons/io';

interface TrailerModalProps {
  src: string | false
  onClose(): void
}

const TrailerModal: FC<TrailerModalProps> = ({
  src,
  onClose
}) => {
  return (<div onClick={onClose} className={mergeClassName(
    "ease-in-out duration-300 fixed z-[1080] inset-0 after:fixed after:content-[''] after:inset-0 after:bg-black after:opacity-0.9",
    src ? 'opacity-100' : 'opacity-0 pointer-events-none'
  )}>
    <Container className={mergeClassName(
      'relative z-10 transition-[margin,opacity] ease-in-out duration-300',
      src ? 'mt-0 opacity-100' : '-mt-[200px] opacity-0'
    )}>
      <div className="bg-header rounded-lg" onClick={e => {
        e.stopPropagation()
      }}>
        <div className="p-3 text-right">
          <button onClick={onClose}>
            <IoIosClose size={18} />
          </button>
        </div>
        {src && <iframe src={src} className='w-full h-[500px]' />}
      </div>
    </Container>
  </div>);
}

export default TrailerModal;
