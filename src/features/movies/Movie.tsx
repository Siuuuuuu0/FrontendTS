import React from 'react';
import { Actor, Director } from './moviesApiSlice';

type MovieProps = {
  title: string;
  director: Director, 
  actors: Actor[], 
  releaseYear: number
};

const Movie: React.FC<MovieProps> = ({ title, director, actors, releaseYear }) => {
  return (
    <div className="movie">
      <h2 className="movie-title">{title}</h2>
      <p className="movie-director">
        Directed by: {director.first_name} {director.last_name}
      </p>
      <p className="movie-release-year">Released in: {releaseYear}</p>
      <h3>Actors:</h3>
      <ul className="movie-actors">
        {actors.map((actor, index) => (
          <li key={index}>
            {actor.first_name} {actor.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Movie;
