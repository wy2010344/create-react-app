import { createContext } from "react";
import { GenreMovie, GenreTV } from "./api";

export const GlobalContext = createContext<{
  genreTvList: GenreTV[],
  genreMovieList: GenreMovie[]
  language: string
}>({
  language: '',
  genreMovieList: [],
  genreTvList: []
})