import { useContext, type FC } from 'react';
import Section from '../components/section';
import Card from '../components/Card';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Catelog from '../components/catelog';
import { GlobalContext } from '../GlobalContext';
import { movieTopRated } from '../api';
import { useMemoAutoLoadMore } from '@wangyang2010344/react-helper';
import LoadMoreView from '../components/LoadMoreView';

interface CatalogTopRatedMovieProps { }

const CatalogTopRatedMovie: FC<CatalogTopRatedMovieProps> = () => {
  const location = useLocation()
  const { language } = useContext(GlobalContext)
  const { list, hasMore, loadMore, loadMoreVersion } = useMemoAutoLoadMore({
    initKey: 1,
    async body(page) {
      const resp = await movieTopRated({
        language,
        page
      })

      return {
        list: resp.results,
        nextKey: page + 1,
        hasMore: resp.page != resp.total_pages
      }
    },
  }, [language])
  return (<Catelog
    title='top-rated-movie'
    mediaType='movie'
    films={list}
    getTitle={getTitle}
  >

    {hasMore && <LoadMoreView loadMoreVersion={loadMoreVersion} loadMore={loadMore} />}
  </Catelog>)
}

function getTitle(n: { title: string }) {
  return n.title
}
export default CatalogTopRatedMovie;
