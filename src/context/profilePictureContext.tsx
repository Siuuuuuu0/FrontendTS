import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfilePictureContext = createContext();

export const useProfilePicture = () => {
    return useContext(ProfilePictureContext);
};

export const ProfilePictureProvider = ({ children }) => {
    const [profilePictureLS, setProfilePictureLS] = useState(() => {
        const savedProfilePicture = localStorage.getItem("profilePicture");
        return savedProfilePicture ? JSON.parse(savedProfilePicture) : null;
    });

    const handleChange = (newProfilePicture) => {
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
        <ProfilePictureContext.Provider value={{ profilePictureLS, handleChange }}>
            {children}
        </ProfilePictureContext.Provider>
    );
};
