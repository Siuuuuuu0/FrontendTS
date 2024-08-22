import React from 'react';
import Movie from './Movie';
import { useParams } from 'react-router-dom';

const SingleMovie: React.FC<{}> = () => {

    const { id } = useParams<{ id: string }>(); 
    const movieId = parseInt(id || '', 10);

    return (
        <Movie movieId={movieId}/>
    );
};

export default SingleMovie;
