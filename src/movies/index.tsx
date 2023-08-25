import { useChange, useCallbackPromiseState } from '@wangyang2010344/react-helper';
import { useEffect, type FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { genreMovieList, genreTvList } from './api';
import Loading from './components/Loading';
import { GlobalContext } from './GlobalContext';
import Header from './layouts/Header';
import Body from './layouts/Body';
import Footer from './layouts/Footer';

interface MovieAppProps { }

const MovieApp: FC<MovieAppProps> = () => {
  const [language, setLanguage] = useChange('en');
  const [genre] = useCallbackPromiseState(() => {
    return Promise.all([
      genreMovieList({
        language
      }),
      genreTvList({
        language
      })
    ]).then(function ([movie, tv]) {
      return {
        genreMovieList: movie.genres,
        genreTvList: tv.genres
      }
    })
  }, [language])
  if (genre) {
    if (genre.type == 'success') {
      return (<BrowserRouter>
        <GlobalContext.Provider value={{
          language,
          ...genre.value
        }}>
          <Header />
          <Body />
          <Footer />
        </GlobalContext.Provider>
      </BrowserRouter>);
    }
    return <div>
      Error loading {genre.value}
    </div>

  }
  return <div className="fixed left-0 top-0 right-0 bottom-0 flex items-center justify-center">
    <Loading />
  </div>
}

export default MovieApp;
