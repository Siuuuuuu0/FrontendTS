import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { moviesApi } from "../../app/api/moviesApi";

export type Actor = {
    id: number;
    last_name : string, 
    first_name : string
};

const actorsAdapter = createEntityAdapter<Actor>({
    sortComparer: (a, b) => {
        if (a.last_name < b.last_name) return -1;
        if (a.last_name > b.last_name) return 1;

        if (a.first_name < b.first_name) return -1;
        if (a.first_name > b.first_name) return 1;

        return 0;
    }
});

const initialState = actorsAdapter.getInitialState();

export const actorsApiSlice = moviesApi.injectEndpoints({
  endpoints: (builder) => ({
    getActors: builder.query<EntityState<Actor, number>, { first_name?: string; last_name?: string } | string>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (typeof filters === 'object') {
            if (filters.first_name) params.append('first_name', filters.first_name);
            if (filters.last_name) params.append('last_name', filters.last_name.toString());
        } 
        return {
            url : `/actors?${params.toString()}`, 
            validateStatus : (response: any, result: any) => {
                return response.status === 200 && !result.isError
            },
        }
      },
      transformResponse: (responseData: Actor[]) => {
        return actorsAdapter.setAll(initialState, responseData);
      },    
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Actor', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Actor' as const, id })),
          ];
        } else return [{ type: 'Actor', id: 'LIST' }];
      }    
    }),
    getActorById: builder.query<Actor, number>({
      query: (id) => `/actors/${id}`,
    }),
    createActor: builder.mutation<Actor, { title: string; releaseYear: number; directorId: number; actorIds: number[] }>({
      query: (newActor) => ({
        url: '/actors',
        method: 'POST',
        body: newActor,
      }),
    }),
    updateActor: builder.mutation<Actor, { id: number; title?: string; releaseYear?: number; directorId?: number; actorIds?: number[] }>({
      query: ({ id, ...updatedActor }) => ({
        url: `/actors/${id}`,
        method: 'PUT',
        body: updatedActor,
      }),
    }),
    deleteActor: builder.mutation<void, number>({
      query: (id) => ({
        url: `/actors/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetActorsQuery,
  useGetActorByIdQuery,
  useCreateActorMutation,
  useUpdateActorMutation,
  useDeleteActorMutation,
} = actorsApiSlice;
