import React from 'react';
import Movie from './Movie';
import { Link, useParams } from 'react-router-dom';

const SingleMovie: React.FC<{}> = () => {

    const { id } = useParams<{ id: string }>(); 
    const movieId = parseInt(id || '', 10);

    return (
        <>
            <Movie movieId={movieId}/>
            <Link to={`/dash/movies`}><h3>Back</h3></Link>
        </>
    );
};

export default SingleMovie;
