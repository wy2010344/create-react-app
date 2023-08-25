import { useCallbackPromiseState } from '@wangyang2010344/react-helper';
import { useContext, type FC } from 'react';
import { searchMulti, tmdbImageSrc } from '../api';
import { GlobalContext } from '../GlobalContext';
import Image from './Image';
interface SearchResultProps {
  search: string
  goToSearchPage(): void
}

const SearchResult: FC<SearchResultProps> = ({
  search,
  goToSearchPage
}) => {
  const { language, genreMovieList, genreTvList } = useContext(GlobalContext)
  const [result] = useCallbackPromiseState(() => {
    return searchMulti({
      query: search,
      page: 1,
      language
    })
  }, [search, language])
  if (result?.type == 'success') {
    return (<div className='absolute top-[48px] left-0 right-0 rounded-md bg-header shadow-lg'>
      <div className='max-h-[480px] scrollbar scrollbar-thumb-primary scrollbar-track-header pr-3 overflow-y-auto'>
        {result.value.results.map(result => {
          return <div key={result.id} className='flex items-start p-1.5 rounded-lg hover:bg-primary cursor-pointer m-1.5'>
            <Image className='h-[72px] w-[102px] min-w-[102px] rounded-md' src={tmdbImageSrc(result.poster_path || '')} />
            <div className="px-3 truncate">
              <p className="text-base truncate">{result.title}</p>
              <ul className="flex flex-wrap gap-x-1.5 text-sm opacity-70">
                {result.media_type == 'movie' ? result.genre_ids?.map((id, i) => {
                  return <li key={id}>
                    {genreMovieList.find(x => x.id == id)?.name}
                    {i + 1 !== result.genre_ids?.length ? ',' : ''}
                  </li>
                }) : result.genre_ids?.map((id, i) => {
                  return <li key={id}>
                    {genreTvList.find(x => x.id == id)?.name}
                    {i + 1 !== result.genre_ids?.length ? ',' : ''}
                  </li>
                })}
              </ul>
            </div>
          </div>
        })}
      </div>
      {result.value.total_results > 5 && <button className='px-3 py-1.5 bg-primary w-full hover:text-body sticky bottom-0 shadow-lg' onClick={e => {
        goToSearchPage()
      }}>
        More results
      </button>}
    </div>);
  }
  return null
}

export default SearchResult;
