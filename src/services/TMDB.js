import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const tmdbApiKey = process.env.REACT_APP_TMDB_KEY;
const baseApiURL = process.env.REACT_APP_BASE_API_URL;
const page = 1;

export const tmdbApi = createApi({
	reducerPath: 'tmdbApi',
	baseQuery: fetchBaseQuery({baseUrl: baseApiURL}),
	endpoints: (builder) => ({
		//* Get Movies by [Type]
		getMovies: builder.query({
			query: ({genreIdOrCategoryName, page, searchQuery}) => {
				
				//* Get Movies by Search
				if(searchQuery){
					return `search/movie?query=${searchQuery}&page=${page}&api_key=${tmdbApiKey}`;
				}

				//* Get Movies by Category
				if(genreIdOrCategoryName && typeof genreIdOrCategoryName === 'string'){
					return `movie/${genreIdOrCategoryName}?page=${page}&api_key=${tmdbApiKey}`;
				}
				
				//* Get Movies by Ganre
				if(genreIdOrCategoryName && typeof genreIdOrCategoryName === 'number'){
					return `discover/movie?with_genres=${genreIdOrCategoryName}&page=${page}&api_key=${tmdbApiKey}`;
				}

				//* Get Popular Movies
				return `movie/popular?page=${page}&api_key=${tmdbApiKey}`;
			}
		}),

		//* Get ganres
		getGenres: builder.query({
			query: () => `genre/movie/list?api_key=${tmdbApiKey}`
		}),

		//* Get Movie
		getMovie: builder.query({
			query: (id) => `movie/${id}?append_to_response=videos,credits&api_key=${tmdbApiKey}`
		}),

		//* Get User Specific Lists
		getList: builder.query({
			query: ({listName, accountId, session_id, page}) => `account/${accountId}/${listName}?session_id=${session_id}&page=${page}&api_key=${tmdbApiKey}`
		}),

		//* Get Recomendations
		getRecomendations: builder.query({
			query: ({movie_id, list}) => `movie/${movie_id}/${list}?api_key=${tmdbApiKey}`
		}),

		//* Get Actor
		getActor: builder.query({
			query: (id) => `person/${id}?api_key=${tmdbApiKey}`
		}),

		//* Get Movies By Actor
		getMoviesByActorId: builder.query({
			query: ({actor_id, page}) => `discover/movie?with_cast=${actor_id}&page=${page}&api_key=${tmdbApiKey}`
		})
	})
});

export const {
	useGetMoviesQuery,
	useGetGenresQuery,
	useGetMovieQuery,
	useGetListQuery,
	useGetRecomendationsQuery,
	useGetActorQuery,
	useGetMoviesByActorIdQuery
} = tmdbApi;