import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { moviesApi } from "../../app/api/moviesApi";

export type Director = {
    last_name : string, 
    first_name : string
};

export type Actor = {
    id: number;
    last_name : string, 
    first_name : string
};

type Movie = { 
    id: number;
    title: string; 
    releaseYear: number; 
    director: Director; 
    actors: Actor[] 
};

const moviesAdapter = createEntityAdapter<Movie>({
    sortComparer: (a, b) => {
      if (a.releaseYear < b.releaseYear) return -1;
      if (a.releaseYear > b.releaseYear) return 1;
      return 0;
    }
});

const initialState = moviesAdapter.getInitialState()

export const moviesApiSlice = moviesApi.injectEndpoints({
  endpoints: (builder) => ({
    getMovies: builder.query<EntityState<Movie, number>, { title?: string; releaseYear?: number; directorId?: number; actorIds?: number[] } | string>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (typeof filters === 'object') {
            if (filters.title) params.append('title', filters.title);
            if (filters.releaseYear) params.append('releaseYear', filters.releaseYear.toString());
            if (filters.directorId) params.append('directorId', filters.directorId.toString());
            if (filters.actorIds) filters.actorIds.forEach(id => params.append('actorIds', id.toString()));
        } 
        return {
            url : `/movies?${params.toString()}`, 
            validateStatus : (response: any, result: any) => {
                return response.status === 200 && !result.isError
            },
        }
      },
      transformResponse: (responseData: Movie[]) => {
        return moviesAdapter.setAll(initialState, responseData);
      },    
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Movie', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Movie' as const, id })),
          ];
        } else return [{ type: 'Movie', id: 'LIST' }];
      }    
    }),
    getMovieById: builder.query<Movie, number>({
      query: (id) => `/movies/${id}`,
    }),
    createMovie: builder.mutation<Movie, { title: string; releaseYear: number; directorId: number; actorIds: number[] }>({
      query: (newMovie) => ({
        url: '/movies',
        method: 'POST',
        body: newMovie,
      }),
    }),
    updateMovie: builder.mutation<Movie, { id: number; title?: string; releaseYear?: number; directorId?: number; actorIds?: number[] }>({
      query: ({ id, ...updatedMovie }) => ({
        url: `/movies/${id}`,
        method: 'PUT',
        body: updatedMovie,
      }),
    }),
    deleteMovie: builder.mutation<void, number>({
      query: (id) => ({
        url: `/movies/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetMovieByIdQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} = moviesApiSlice;
