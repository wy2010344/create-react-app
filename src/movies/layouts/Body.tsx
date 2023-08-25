import type { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/home';
import CatalogMovie from '../pages/catalog-movie';
import CatalogTv from '../pages/catalog-tv';
import CatalogSearch from '../pages/catalog-search';
import Movie from '../pages/movie';
import Tv from '../pages/tv';
import Season from '../pages/season';
import CatalogTopRatedMovie from '../pages/catalog-top-rated-movie';
import CatalogTopRatedTv from '../pages/catalog-top-rated-tv';

interface BodyProps { }

const Body: FC<BodyProps> = () => {
  return (<Routes>
    <Route path="/" element={<Home />}></Route>
    <Route path="/movies" element={<CatalogMovie />}></Route>
    <Route path="/tv" element={<CatalogTv />}></Route>
    <Route path="/search" element={<CatalogSearch />}></Route>
    <Route path="/list/top-rated-tv" element={<CatalogTopRatedTv />}></Route>
    <Route path="/list/top-rated-movie" element={<CatalogTopRatedMovie />}></Route>

    <Route path="/movie/:id" element={<Movie />}></Route>
    <Route path="/tv/:id" element={<Tv />}></Route>
    <Route path="/tv/:id/season/:seasonNumber" element={<Season />}></Route>
  </Routes>);
}

export default Body;
