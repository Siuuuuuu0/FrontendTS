// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfilePictureContext = createContext();

export const useProfilePicture = () => {
    return useContext(ProfilePictureContext);
};

export const ProfilePictureProvider = ({
    children
}: any) => {
    const [profilePictureLS, setProfilePictureLS] = useState(() => {
        const savedProfilePicture = localStorage.getItem("profilePicture");
        return savedProfilePicture ? JSON.parse(savedProfilePicture) : null;
    });

    const handleChange = (newProfilePicture: any) => {
        setProfilePictureLS(newProfilePicture);
    };

    useEffect(() => {
        if (profilePictureLS !== null) {
            localStorage.setItem("profilePicture", JSON.stringify(profilePictureLS));
        } else {
            localStorage.removeItem("profilePicture");
        }
    }, [profilePictureLS]);

    return (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <ProfilePictureContext.Provider value={{ profilePictureLS, handleChange }}>
            {children}
        </ProfilePictureContext.Provider>
    );
};
