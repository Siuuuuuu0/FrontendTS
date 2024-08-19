import React, { useState } from 'react';
import Movie from './Movie'; 
import { useGetMoviesQuery } from './moviesApiSlice';
import { handleError } from '../../services/helpers';

const MoviesList: React.FC = () => {
    const [releaseYear, setReleaseYear] = useState<number | undefined>();

    const {
        data: movies, 
        isLoading,
        isSuccess,
        isError, 
        error
    } = useGetMoviesQuery({ releaseYear }, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const year = parseInt(e.target.value, 10);
        setReleaseYear(year || undefined);
    };

    let content: JSX.Element;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isError) {
        content = <p className="errmsg">{handleError(error)}</p>;
    } else if (isSuccess) {
        const { ids } = movies;

        const listContent = ids?.length
            ? ids.map((movieId: any) => <Movie key={movieId} movieId={movieId} />)
            : <p>No movies found for the selected year.</p>;

        content = (
            <>
                <div className="filter">
                    <label htmlFor="releaseYear">Filter by Release Year: </label>
                    <input
                        type="number"
                        id="releaseYear"
                        value={releaseYear || ''}
                        onChange={handleYearChange}
                        placeholder="Enter year"
                    />
                </div>
                <div className="movies-list">
                    {listContent}
                </div>
            </>
        );
    } else {
        content = <p className='errmsg'>Internal error happened, please contact Support</p>;
    }

    return content;
};

export default MoviesList;
