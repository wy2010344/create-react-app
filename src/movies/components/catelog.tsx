import { useEffect, type FC } from 'react';
import Section from './section';
import Card from './Card';
import { useNavigate } from 'react-router-dom';
import { MediaType, tmdbImageSrc } from '../api';
import { useAutoLoadMore } from '@wangyang2010344/react-helper';

interface CatelogProps<T extends {
  id: number
  poster_path: string
}> {
  title: string
  mediaType: MediaType
  getTitle(n: T): string
  films: T[]
  children?: React.ReactNode
}

const Catelog: FC<CatelogProps<any>> = ({
  title,
  mediaType,
  films,
  children,
  getTitle
}) => {
  const navigate = useNavigate()
  return (<>
    {/* background */}
    <div className="h-[120px] left-0 right-0 top-0 relative">
      <div className="overlay-film-cover"></div>
      <div className="h-full w-full bg-primary"></div>
    </div>
    {/* PAGE TITLE */}
    <Section
      className="-mt-[90px] flex items-center relative z-10"
      title={title}
    ></Section>
    {/* Films */}
    <Section>
      <div className="grid lg:grid-cols-5 sm:grid-cols-4 mobile:grid-cols-3 relative z-[11]">
        {films.map((film, i) => (
          <div key={i}>
            <Card
              onClick={() => navigate(`/${mediaType}/${film.id}`)}
              imageSrc={tmdbImageSrc(film.poster_path)}
              title={getTitle(film)}
              key={i}
            ></Card>
          </div>
        ))}
      </div>
    </Section>
    {children}
  </>);
}

export default Catelog;
