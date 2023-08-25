import { useContext, type FC } from 'react';
import Section from '../components/section';
import { useCallbackPromiseState, useChange, useMemoPromiseState } from '@wangyang2010344/react-helper';
import { MediaType, movieNowPlaying, moviePopular, movieSeriesVideo, movieTopRated, tmdbImageSrc, tredingAll, tvPopular, tvSeriesVideos, tvTopRated } from '../api';
import { GlobalContext } from '../GlobalContext';
import Slider from '../components/slider';
import Image from '../components/Image';
import { MdPlayCircleOutline } from 'react-icons/md'
import { useNavigate } from 'react-router-dom';
import TrailerModal from '../components/trailler-modal';
import Card from '../components/Card';

interface HomeProps { }

const Home: FC<HomeProps> = () => {
  const { language } = useContext(GlobalContext)
  const [trending] = useCallbackPromiseState(function () {
    return tredingAll("week", {
      language
    })
  }, [language])
  const navigate = useNavigate()

  const [trailer, setTrailer] = useChange<{
    id: number
    media_type: MediaType
  }>();

  const [trailerSrc] = useMemoPromiseState(function () {
    if (trailer) {
      return async function () {
        if (trailer.media_type == 'tv') {
          const data = await tvSeriesVideos(trailer.id, {
            language
          })
          if (data.results.length) {
            return `https://www.youtube.com/embed/${data.results[0].key}?autoplay=0`
          }
        } else if (trailer.media_type == 'movie') {
          const data = await movieSeriesVideo(trailer.id, {
            language
          })
          if (data.results.length) {
            return `https://www.youtube.com/embed/${data.results[0].key}?autoplay=0`
          }
        }
        return ""
      }
    }
  }, [trailer, language])
  function goToDetailPage(mediaType: MediaType,
    id: number
  ) {
    navigate(`/${mediaType}/${id}`)
  }



  const [inTheaters] = useCallbackPromiseState(function () {
    return movieNowPlaying({
      language,
      page: 1
    })

  }, [language])
  // const [populars]=useCallbackPromiseState(async function(){
  //   const movies=await moviePopular({language,page:1})
  //   const tvs=await tvPopular({language,page:1})
  // },[language])

  const [topRatedTv] = useCallbackPromiseState(function () {
    return tvTopRated({
      language,
      page: 1
    })
  }, [language])
  const [topRatedMovie] = useCallbackPromiseState(function () {
    return movieTopRated({
      language,
      page: 1
    })
  }, [language])
  return (<>
    <TrailerModal
      src={trailerSrc?.type == 'success' && trailerSrc.value}
      onClose={() => {
        setTrailer(undefined)
      }}
    />
    {trending?.type == 'success' && trending.value.results.length > 0 && <Section className='py-0'>
      <Slider className='slick-hero' autoplay slidesToShow={1} slidesToScroll={1} children={onSwipe => {
        return trending?.value.results.map((result, i) => {
          return <div key={result.id} className='h-[300px] relative flex items-center cursor-pointer' onClick={e => {
            if (onSwipe) {
              return
            }
            navigate(`/${result.media_type}/${result.id}`)
          }} >
            <div className="absolute inset-0">
              <div className="overlay-slick-hero"></div>
              <Image src={tmdbImageSrc(result.backdrop_path)} className='rounded-0 rounded-none' />
              <div className="overlay-file-cover"></div>
            </div>
            <div className="flex flex-col gap-3 items-start relative z-10 mx-[55px] max-w-[50%] mobile:max-w-full">
              <p className="text-xl line-clamp-1">{result.title}</p>
              <p className="text-sm line-clamp-3">{result.overview}</p>
              <button className="px-3 py-5 flex items-center gap-3 bg-primary rounded-md" onClick={e => {
                e.stopPropagation()
                //  onPlayTrailer()
                setTrailer(result)
              }}>
                <MdPlayCircleOutline size={18} />
                <span>Play trailer</span>
              </button>
            </div>
          </div>
        })
      }} />
    </Section>}
    {/* in theaters */}
    {inTheaters?.type == 'success' && inTheaters.value.results.length > 0 && <Section title="In Theaters">
      <Slider isMovieCard={true}>
        {(_) =>
          inTheaters.value.results.map((film, i) => (
            <Card
              key={film.id}
              onClick={() => goToDetailPage('movie', film.id)}
              title={film.title}
              imageSrc={tmdbImageSrc(film.poster_path)}
            />
          ))
        }
      </Slider>
    </Section>}
    {/* <Section title="What's Popular" hidden={populars.length === 0}>
      <Slider isMovieCard={true}>
        {(_) =>
          populars.map((film, i) => (
            <Card
              onClick={() => goToDetailPage(film)}
              title={film.title}
              imageSrc={tmdbImageSrc(film.posterPath)}
              key={i}
            ></Card>
          ))
        }
      </Slider>
    </Section> */}
    {topRatedTv?.type == 'success' && topRatedTv.value.results.length > 0 && <Section
      title="Top Rated TV"
      onTitleClick={() => navigate(`/list/top-rated-tv`)}
    >
      <Slider isMovieCard={true}>
        {(_) =>
          topRatedTv.value.results.map((film, i) => (
            <Card
              onClick={() => goToDetailPage('tv', film.id)}
              title={film.name}
              imageSrc={tmdbImageSrc(film.poster_path)}
              key={i}
            ></Card>
          ))
        }
      </Slider>
    </Section>}
    {/* to rated movies*/}
    {topRatedMovie?.type == 'success' && topRatedMovie.value.results.length > 0 && <Section
      title="Top Rated Movies"
      onTitleClick={() => navigate(`/list/top-rated-movies`)}
    >
      <Slider isMovieCard={true}>
        {(_) =>
          topRatedMovie.value.results.map((film, i) => (
            <Card
              onClick={() => goToDetailPage('movie', film.id)}
              title={film.title}
              imageSrc={tmdbImageSrc(film.poster_path)}
              key={i}
            ></Card>
          ))
        }
      </Slider>
    </Section>}

  </>);
}

export default Home;
