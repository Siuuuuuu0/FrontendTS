import React from 'react';
import Movie from './Movie'; 
import { useGetMoviesQuery } from './moviesApiSlice';
import { handleError } from '../../services/helpers';

const MoviesList: React.FC = () => {

    const {
        data : movies, 
        isLoading,
        isSuccess,
        isError, 
        error
    } = useGetMoviesQuery('moviesList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
    });

    let content: JSX.Element

    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isError) {
        content = <p className="errmsg">{handleError(error)}</p>
    } else if (isSuccess) {
        const { ids } = movies

        const listContent = ids?.length
        ? ids.map((movieId: any) => <Movie key={movieId} movieId={movieId} />)
        : null
    
        content = (
            <>
                <div className="movies-list">
                {listContent}
                </div>
            </>
        );
    }else {
        content = <p className='errmsg'>Internal error happened, please contact Support</p>
      }
    return content

};

export default MoviesList;
