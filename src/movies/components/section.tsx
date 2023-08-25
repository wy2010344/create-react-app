import { mergeClassName } from '../util';
import Container from './Container';
import type { FC } from 'react';

interface SectionProps {
  className?: string
  title?: string
  onTitleClick?(): void
  children?: React.ReactNode
}

const Section: FC<SectionProps> = ({
  className,
  title,
  onTitleClick,
  children
}) => {
  return (<Container className={className} >
    {title && <h1 onClick={onTitleClick}
      className={mergeClassName('text-xl px-3 py-2', onTitleClick ? 'cursor-pointer hover:text-primary' : '')}
      dangerouslySetInnerHTML={{
        __html: title
      }}
    />}
    {children}
  </Container>);
}

export default Section;
