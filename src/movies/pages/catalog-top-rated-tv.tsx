import { useContext, type FC } from 'react';
import Section from '../components/section';
import Card from '../components/Card';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Catelog from '../components/catelog';
import { useAutoLoadMore, useMemoAutoLoadMore } from '@wangyang2010344/react-helper';
import { tvTopRated } from '../api';
import { GlobalContext } from '../GlobalContext';
import LoadMoreView from '../components/LoadMoreView';

interface CatalogTopRatedTvProps { }

const CatalogTopRatedTv: FC<CatalogTopRatedTvProps> = () => {
  const location = useLocation()
  const { language } = useContext(GlobalContext)


  const { list, hasMore, loadMore, loadMoreVersion } = useMemoAutoLoadMore({
    initKey: 1,
    async body(page) {
      const resp = await tvTopRated({
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
    title='top-rated-tv'
    mediaType='tv'
    films={list}
    getTitle={getTitle}
  >

    {hasMore && <LoadMoreView loadMoreVersion={loadMoreVersion} loadMore={loadMore} />}
  </Catelog>)
}

function getTitle(n: { name: string }) {
  return n.name
}
export default CatalogTopRatedTv;
