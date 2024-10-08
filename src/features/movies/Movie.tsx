import React from 'react';
import { useGetMoviesQuery } from './moviesApiSlice';

type MovieProps = {
  movieId : number
};

const Movie: React.FC<MovieProps> = ({ movieId }) => {

    const { movie } = useGetMoviesQuery('moviesList', {
        selectFromResult: ({ data }) => ({
            movie: data?.entities[movieId],
        }),
    });
    return (
        <div className="movie">
        <h2 className="movie-title">{movie?.title}</h2>
        <p className="movie-director">
            Directed by: {movie?.director.first_name} {movie?.director.last_name}
        </p>
        <p className="movie-release-year">Released in: {movie?.releaseYear}</p>
        <h3>Actors:</h3>
        <ul className="movie-actors">
            {movie?.actors.map((actor, index) => (
            <li key={index}>
                {actor.first_name} {actor.last_name}
            </li>
            ))}
        </ul>
        <h3>Genres:</h3>
        <ul className="movie-genres">
            {movie?.genres.map((genre, index) => (
                <li key={index}>
                    {genre}
                </li>
            ))}
        </ul>
        <div className="movie-description">
            {movie?.description}
        </div>
        </div>
    );
};

export default Movie;
