import { useEffect, type FC } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Container from '../components/Container';
import { mergeClassName } from '../util';
import { useChange } from '@wangyang2010344/react-helper';
import { IoIosSearch } from 'react-icons/io'
import SearchResult from '../components/search-result';

interface HeaderProps { }

const MENU_CLASS = `
  py-1
  px-1.5
  hover:bg-primary
  rounded-md
  mobile:px-6
`
const MENU_CLASS_ACTIVE = `
  bg-primary
`
const Header: FC<HeaderProps> = () => {

  const location = useLocation()
  const [params, _] = useSearchParams()
  const navigate = useNavigate()

  function getMenuClass(path: string) {
    if (path == location.pathname) {
      return mergeClassName(MENU_CLASS, MENU_CLASS_ACTIVE)
    }
    return MENU_CLASS
  }

  const [search, setSearch] = useChange('')
  const [searchFocus, setSearchFocus] = useChange(false);
  function goToSearchPage() {
    if (search) {
      navigate(`/search?q=${search}`)
    }
  }
  return (<div className='bg-header sticky top-0 z-[99]'>
    <Container className='flex items-center justify-between gap-3'>
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-semibold">
          <Link to={'/'}>Movielia</Link>
        </h1>
        <div className="pt-1.5 flex items-center gap-1.5 
        mobile:fixed mobile:bottom-0 mobile:left-0 mobile:right-0 mobile:justify-center mobile:py-3 mobile:bg-header mobile:gap-6">
          <Link className={getMenuClass('/movies')} to={'/movies'} >Movies</Link>
          <Link className={getMenuClass('/tv')} to={'/tv'} >TV</Link>
        </div>
      </div>
      <div className='border-b-[1.5px] border-white flex items-center p-1 flex-[0.5] focus-within:border-primary relative'>
        <input type="text" className='bg-transparent outline-0 flex-1' placeholder='search...'
          value={search}
          onChange={e => {
            setSearch(e.target.value)
          }}
          onKeyDown={e => {
            if (e.key == 'Enter') {
              goToSearchPage()
            }
          }}
          onClick={e => {
            e.stopPropagation()
            setSearchFocus(true)
          }}
        />
        <IoIosSearch size={18} />
        {searchFocus && search && <SearchResult
          search={search}
          goToSearchPage={goToSearchPage}
        />}
      </div>
    </Container>
  </div>);
}

export default Header;
