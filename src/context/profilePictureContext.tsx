import { createContext, ReactElement, useContext, useEffect, useMemo, useReducer, useState } from 'react';

type ProfilePictureType = {
    image: string | null;
};

type ProfilePictureStateType = {
    profilePictureLS: ProfilePictureType | null;
};

const initProfilePictureState: ProfilePictureStateType = {
    profilePictureLS: null,
};

const REDUCER_ACTION_TYPE = {
    SET: 'SET',
    CLEAR: 'CLEAR',
};

// type ReducerActionType = typeof REDUCER_ACTION_TYPE;

type ReducerAction = {
    type: string;
    payload?: ProfilePictureType;
};

const reducer = (state: ProfilePictureStateType, action: ReducerAction): ProfilePictureStateType => {
    switch (action.type) {
        case REDUCER_ACTION_TYPE.SET: {
            if (!action.payload) {
                throw new Error('action payload missing in SET action');
            }
            return { ...state, profilePictureLS: action.payload };
        }
        case REDUCER_ACTION_TYPE.CLEAR: {
            return { ...state, profilePictureLS: null };
        }
        default:
            throw new Error('no reducer type');
    }
};

const useProfilePictureContext = (initProfilePictureState: ProfilePictureStateType) => {
    const [state, dispatch] = useReducer(reducer, initProfilePictureState);
    const REDUCER_ACTIONS = useMemo(() => {
        return REDUCER_ACTION_TYPE;
    }, []);

    const handleChange = (newProfilePicture: ProfilePictureType | null) => {
        if (newProfilePicture) {
            dispatch({ type: REDUCER_ACTIONS.SET, payload: newProfilePicture });
        } else {
            dispatch({ type: REDUCER_ACTIONS.CLEAR });
        }
    };

    useEffect(() => {
        const savedProfilePicture = localStorage.getItem('profilePicture');
        if (savedProfilePicture) {
            dispatch({ type: REDUCER_ACTIONS.SET, payload: JSON.parse(savedProfilePicture) });
        }
    }, [dispatch, REDUCER_ACTIONS.SET]);

    useEffect(() => {
        if (state.profilePictureLS !== null) {
            localStorage.setItem('profilePicture', JSON.stringify(state.profilePictureLS));
        } else {
            localStorage.removeItem('profilePicture');
        }
    }, [state.profilePictureLS]);

    return { profilePictureLS: state.profilePictureLS, handleChange, REDUCER_ACTIONS };
};

type useProfilePictureContextType = ReturnType<typeof useProfilePictureContext>;

const initProfilePictureContextState: useProfilePictureContextType = {
    profilePictureLS: null,
    handleChange: () => {},
    REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
};

const ProfilePictureContext = createContext<useProfilePictureContextType>(initProfilePictureContextState);

type ChildrenType = { children?: ReactElement | ReactElement[] };

export const ProfilePictureProvider = ({ children }: ChildrenType): ReactElement => {
    return (
        <ProfilePictureContext.Provider value={useProfilePictureContext(initProfilePictureState)}>
            {children}
        </ProfilePictureContext.Provider>
    );
};

export const useProfilePicture = (): useProfilePictureContextType => {
    return useContext(ProfilePictureContext);
};
