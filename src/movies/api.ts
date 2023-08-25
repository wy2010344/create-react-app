



const Authorization = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGEzMjc2YWE2ZGQxZmE1ZmE2YzFhZDQyOGI0Zjg2OSIsInN1YiI6IjYyMzVkMjk2NDZhZWQ0MDA3YjE5NTM4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kIn54puPTFNEc69AnwhpkjPG-rUQRJJQZcnE3dwNnfo'
type SearchParam = string | boolean | undefined | null | number
function toQuery(init?: string[][] | Record<string, SearchParam> | string | URLSearchParams) {
  return new URLSearchParams(init as any).toString()
}
async function getJSON<T>(url: string, query: string[][] | Record<string, SearchParam> | string | URLSearchParams): Promise<T> {
  const request = await fetch(`https://api.themoviedb.org/${url}${query ? `?${toQuery(query)}` : ''}`, {
    method: "GET",
    headers: {
      accept: 'application/json',
      Authorization
    }
  })
  return request.json()
}

export const tmdbImageSrc = (path: string) => {
  if (!path) return ''

  return `https://image.tmdb.org/t/p/original/${path}`
}

async function postJSON(url: string) {

}
export type MediaType = "movie" | "tv"
export function trendingAll(
  time_window: "day" | "week",
  params: {
    language: string
  }) {
  return getJSON<{
    page: number
    results: Array<{
      adult: boolean
      backdrop_path: string
      id: number
      title?: string
      original_language: string
      original_title?: string
      overview: string
      poster_path: string
      media_type: string
      genre_ids: Array<number>
      popularity: number
      release_date?: string
      video?: boolean
      vote_average: number
      vote_count: number
      name?: string
      original_name?: string
      first_air_date?: string
      origin_country?: Array<string>
    }>
    total_pages: number
    total_results: number
  }>(`3/trending/all/${time_window}`, params)
}

export type GenreMovie = {
  id: number
  name: string
}
export function genreMovieList(params: {
  language: string
}) {

  return getJSON<{
    genres: Array<GenreMovie>
  }>(`3/genre/movie/list`, params)
}

export type GenreTV = {
  id: number
  name: string
}
export function genreTvList(params: {
  language: string
}) {
  return getJSON<{
    genres: Array<GenreTV>
  }>(`3/genre/tv/list`, params)
}

export function searchMulti(params: {
  query: string
  include_adult?: boolean
  language: string
  page: number
}) {
  return getJSON<{
    page: number
    results: Array<{
      adult: boolean
      backdrop_path?: string
      id: number
      name?: string
      original_language?: string
      original_name?: string
      overview?: string
      poster_path?: string
      media_type: MediaType
      genre_ids?: Array<number>
      popularity: number
      first_air_date?: string
      vote_average?: number
      vote_count?: number
      origin_country?: Array<string>
      title?: string
      original_title?: string
      release_date?: string
      video?: boolean
      gender?: number
      known_for_department?: string
      profile_path: any
      known_for?: Array<{
        adult: boolean
        backdrop_path: string
        id: number
        title: string
        original_language: string
        original_title: string
        overview: string
        poster_path: string
        media_type: string
        genre_ids: Array<number>
        popularity: number
        release_date: string
        video: boolean
        vote_average: number
        vote_count: number
      }>
    }>
    total_pages: number
    total_results: number
  }
  >(`3/search/multi`, params)
}

export function tredingAll(time_window: "day" | "week", params: {
  language: string
}) {
  return getJSON<{
    page: number
    results: Array<{
      adult: boolean
      backdrop_path: string
      id: number
      title?: string
      original_language: string
      original_title?: string
      overview: string
      poster_path: string
      media_type: MediaType
      genre_ids: Array<number>
      popularity: number
      release_date?: string
      video?: boolean
      vote_average: number
      vote_count: number
      name?: string
      original_name?: string
      first_air_date?: string
      origin_country?: Array<string>
    }>
    total_pages: number
    total_results: number
  }>(`3/trending/all/${time_window}`, params)
}


export function tvSeriesVideos(series_id: number, params: {
  include_video_language?: string
  language: string
}) {
  return getJSON<{
    id: number
    results: Array<{
      iso_639_1: string
      iso_3166_1: string
      name: string
      key: string
      site: string
      size: number
      type: string
      official: boolean
      published_at: string
      id: string
    }>
  }>(`3/tv/${series_id}/videos`, params)
}

export function movieSeriesVideo(movie_id: number, params: {
  language: string
}) {
  return getJSON<{
    id: number
    results: Array<{
      iso_639_1: string
      iso_3166_1: string
      name: string
      key: string
      site: string
      size: number
      type: string
      official: boolean
      published_at: string
      id: string
    }>
  }>(`3/movie/${movie_id}/videos`, params)
}

export function movieNowPlaying(params: {
  language: string
  page: number
  region?: string
}) {
  return getJSON<{
    dates: {
      maximum: string
      minimum: string
    }
    page: number
    results: Array<{
      adult: boolean
      backdrop_path: string
      genre_ids: Array<number>
      id: number
      original_language: string
      original_title: string
      overview: string
      popularity: number
      poster_path: string
      release_date: string
      title: string
      video: boolean
      vote_average: number
      vote_count: number
    }>
    total_pages: number
    total_results: number
  }>(`3/movie/now_playing`, params)
}

export function tvPopular(params: {
  language: string
  page: number
}) {
  return getJSON<{
    page: number
    results: Array<{
      backdrop_path?: string
      first_air_date: string
      genre_ids: Array<number>
      id: number
      name: string
      origin_country: Array<string>
      original_language: string
      original_name: string
      overview: string
      popularity: number
      poster_path: string
      vote_average: number
      vote_count: number
    }>
    total_pages: number
    total_results: number
  }>(`3/tv/popular`, params)
}

export function moviePopular(params: {
  language: string
  page: number
  region?: string
}) {
  return getJSON<{
    page: number
    results: Array<{
      adult: boolean
      backdrop_path: string
      genre_ids: Array<number>
      id: number
      original_language: string
      original_title: string
      overview: string
      popularity: number
      poster_path: string
      release_date: string
      title: string
      video: boolean
      vote_average: number
      vote_count: number
    }>
    total_pages: number
    total_results: number
  }>(`3/movie/popular`, params)
}

export function tvTopRated(params: {
  page: number
  language: string
}) {
  return getJSON<{
    page: number
    results: Array<{
      backdrop_path: string
      first_air_date: string
      genre_ids: Array<number>
      id: number
      name: string
      origin_country: Array<string>
      original_language: string
      original_name: string
      overview: string
      popularity: number
      poster_path: string
      vote_average: number
      vote_count: number
    }>
    total_pages: number
    total_results: number
  }>(`3/tv/top_rated`, params)
}

export function movieTopRated(params: {
  page: number
  language: string
  region?: string
}) {
  return getJSON<{
    page: number
    results: Array<{
      adult: boolean
      backdrop_path: string
      genre_ids: Array<number>
      id: number
      original_language: string
      original_title: string
      overview: string
      popularity: number
      poster_path: string
      release_date: string
      title: string
      video: boolean
      vote_average: number
      vote_count: number
    }>
    total_pages: number
    total_results: number
  }>(`3/movie/top_rated`, params)
}

export function movieDetail() {

}