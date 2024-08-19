import React, { useEffect, useState } from 'react';
import Movie from './Movie'; 
import { useGetMoviesQuery } from './moviesApiSlice';
import { useGetActorsQuery } from './actorsApiSlice'; 
import { handleError } from '../../services/helpers';

const MoviesList: React.FC = () => {
    const [releaseYear, setReleaseYear] = useState<number | undefined>();
    const [lastName, setLastName] = useState<string>('');
    const [selectedActorIds, setSelectedActorIds] = useState<string[]>([]);

    const {
        data: movies, 
        isLoading,
        isSuccess,
        isError, 
        error
    } = useGetMoviesQuery({ releaseYear, actorIds: selectedActorIds }, {
        pollingInterval: 24*60*60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    const {
        data: actors,
        isLoading: isActorsLoading,
        isError: isActorsError,
        error: actorsError,
    } = useGetActorsQuery({ last_name: lastName }, {
        skip: !lastName 
    });

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const year = parseInt(e.target.value, 10);
        setReleaseYear(year || undefined);
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setLastName(e.target.value);
    };

    const handleActorSelect = (actorId: string) => {
        setSelectedActorIds(prevIds => {
            if (prevIds.includes(actorId)) {
                return prevIds.filter(id => id !== actorId);
            } else {
                return [...prevIds, actorId];
            }
        });
    };

    const handleActorRemove = (actorId: string) => {
        setSelectedActorIds(prevIds => prevIds.filter(id => id !== actorId));
    };

    // useEffect(() => {
    //     if (actors) {
    //         const actorIdsSet = new Set(actors.ids);
    //         setSelectedActorIds(prevIds => prevIds.filter(id => actorIdsSet.has(parseInt(id, 10))));
    //     }
    // }, [actors]);

    let content: JSX.Element;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isError) {
        content = <p className="errmsg">{handleError(error)}</p>;
    } else if (isSuccess) {
        const { ids } = movies;

        const listContent = ids?.length
            ? ids.map((movieId: any) => <Movie key={movieId} movieId={movieId} />)
            : <p>No movies found for the selected filters.</p>;

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
                <div className="filter">
                    <label htmlFor="lastName">Filter by Actor's Last Name: </label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={handleLastNameChange}
                        placeholder="Enter last name"
                    />
                    {isActorsLoading && <p>Loading actors...</p>}
                    {isActorsError && <p className="errmsg">{handleError(actorsError)}</p>}
                    {actors && (
                        <ul className="actors-list">
                            {actors.ids.map((actorId: any) => (
                                <li 
                                    key={actorId} 
                                    onClick={() => handleActorSelect(actorId)}
                                    style={{
                                        cursor: 'pointer',
                                        fontWeight: selectedActorIds.includes(actorId) ? 'bold' : 'normal',
                                    }}
                                >
                                    {`${actors.entities[actorId].first_name} ${actors.entities[actorId].last_name}`}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {/* Display Selected Actors */}
                <div className="selected-actors">
                    <h4>Selected Actors:</h4>
                    <ul>
                        {selectedActorIds.map(actorId => (
                            <li key={actorId}>
                                {`${actors?.entities[parseInt(actorId, 10)]?.first_name} ${actors?.entities[parseInt(actorId, 10)]?.last_name}`}
                                <button onClick={() => handleActorRemove(actorId)}>Remove</button>
                            </li>
                        ))}
                    </ul>
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



