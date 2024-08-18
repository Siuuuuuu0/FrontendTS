import React from 'react';
import Movie from './Movie'; 
import { useGetMoviesQuery } from './moviesApiSlice';

const MoviesList: React.FC = () => {

    const {
        data : movies, 
        isLoading,
        isSuccess,
        isError, 
        error
    } = useGetMoviesQuery({}, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  });

    return (
        <>
            <div className="movies-list">
            { movies?.length ? 
            movies.map((movie, index) => (
                <Movie
                key={index}
                title={movie.title}
                director={{last_name: 'N', first_name: 'N'}}
                actors={[]}
                releaseYear={movie.releaseYear}
                />
            ))
            : <>No data</>
            }
            </div>
        </>
    );
};

export default MoviesList;
