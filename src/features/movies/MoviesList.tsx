import React, { useState } from 'react';
import Movie from './Movie'; 
import { useGetMoviesQuery } from './moviesApiSlice';
import { useGetActorsQuery } from './actorsApiSlice'; 
import { handleError } from '../../services/helpers';
import ControlledInput from './ControlledInput';
import { Link } from 'react-router-dom';

type Actor = {
    first_name: string;
    last_name: string;
};

const MoviesList: React.FC = () => {
    const [releaseYear, setReleaseYear] = useState<number | undefined>();
    const [lastName, setLastName] = useState<string>('');
    const [selectedActors, setSelectedActors] = useState<{ [key: string]: Actor }>({});

    const {
        data: movies, 
        isLoading,
        isSuccess,
        isError, 
        error
    } = useGetMoviesQuery({ releaseYear, actorIds: Object.keys(selectedActors) }, {
        pollingInterval: 24 * 60 * 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    const {
        data: actors,
        isLoading: isActorsLoading,
        isError: isActorsError,
        error: actorsError,
    } = useGetActorsQuery({ last_name: lastName }, {
        skip: !lastName.trim()
    });

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const year = parseInt(e.target.value, 10);
        setReleaseYear(year || undefined);
    };

    const handleLastNameChange = (val: string) => {
        setLastName(val);
    };

    const handleActorSelect = (actorId: string) => {
        if (actors && actors.entities[parseInt(actorId, 10)]) {
            setSelectedActors(prev => ({
                ...prev,
                [actorId]: {
                    first_name: actors.entities[parseInt(actorId, 10)].first_name,
                    last_name: actors.entities[parseInt(actorId, 10)].last_name
                }
            }));
        }
    };

    const handleActorRemove = (actorId: string) => {
        setSelectedActors(prev => {
            const { [actorId]: removed, ...rest } = prev;
            return rest;
        });
    };

    let content: JSX.Element;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isError) {
        content = <p className="errmsg">{handleError(error)}</p>;
    } else if (isSuccess) {
        const { ids } = movies;

        const listContent = ids?.length
            ? ids.map((movieId: any) => <div key={movieId}><Movie movieId={movieId} /><Link to={`/dash/movies/${movieId}`}>View Movie</Link></div>)
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
                    <ControlledInput onUpdate={handleLastNameChange} />
                    {isActorsLoading && <p>Loading actors...</p>}
                    {isActorsError && <p className="errmsg">{handleError(actorsError)}</p>}
                    {actors && lastName.trim() && (
                        <ul className="actors-list">
                            {actors.ids.map((actorId: any) => (
                                <li 
                                    key={actorId} 
                                    onClick={() => handleActorSelect(actorId)}
                                    style={{
                                        cursor: 'pointer',
                                        fontWeight: selectedActors[actorId] ? 'bold' : 'normal',
                                    }}
                                >
                                    {`${actors.entities[actorId]?.first_name || 'Unknown'} ${actors.entities[actorId]?.last_name || 'Actor'}`}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="selected-actors">
                    <h4>Selected Actors:</h4>
                    <ul>
                        {Object.entries(selectedActors).map(([actorId, actor]) => (
                            <li key={actorId}>
                                {`${actor.first_name} ${actor.last_name}`}
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
