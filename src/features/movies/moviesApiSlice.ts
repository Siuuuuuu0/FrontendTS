import { moviesApi } from "../../app/api/moviesApi";

export type Director = {
    last_name : string, 
    first_name : string
};

export type Actor = {
    last_name : string, 
    first_name : string
};

type Movie = { 
    title: string; 
    releaseYear: number; 
    director: Director; 
    actors: Actor[] 
};

export const moviesApiSlice = moviesApi.injectEndpoints({
  endpoints: (builder) => ({
    getMovies: builder.query<Movie[], { title?: string; releaseYear?: number; directorId?: number; actorIds?: number[] }>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.title) params.append('title', filters.title);
        if (filters.releaseYear) params.append('releaseYear', filters.releaseYear.toString());
        if (filters.directorId) params.append('directorId', filters.directorId.toString());
        if (filters.actorIds) filters.actorIds.forEach(id => params.append('actorIds', id.toString()));
        return `/movies?${params.toString()}`;
      },
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
