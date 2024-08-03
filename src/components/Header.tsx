

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    // faFileCirclePlus,
    // faFilePen,
    // faUserGear,
    // faUserPlus,
    faRightFromBracket
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
// import useAuth from '../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'

import { useProfilePicture } from '../context/profilePictureContext'
// import useProfilePicture from '../hooks/useProfilePicture'

// const DASH_REGEX = /^\/dash(\/)?$/
// const NOTES_REGEX = /^\/dash\/notes(\/)?$/
// const USERS_REGEX = /^\/dash\/users(\/)?$/

const Header = () => {
    // const { isManager, isAdmin } = useAuth()

    const navigate = useNavigate()

    const [isLogoutSuccess, setIsLogoutSuccess] = useState(false)

    // @ts-expect-error TS(2339): Property 'profilePictureLS' does not exist on type... Remove this comment to see the full error message
    const {profilePictureLS, handleChange} = useProfilePicture()
    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        // Retrieve the Base64 string from localStorage
        if (profilePictureLS) {
        setImageSrc(profilePictureLS.image);
        }
        // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
        else setImageSrc(null)
    }, [profilePictureLS]);
    // const {setProfilePictureLS} = useProfilePicture()
    // const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isLogoutSuccess)  {
            handleChange(null)
            navigate('/')
        }
    }, [isLogoutSuccess, navigate])

    // const onNewNoteClicked = () => navigate('/dash/notes/new')
    // const onNewUserClicked = () => navigate('/dash/users/new')
    // const onNotesClicked = () => navigate('/dash/notes')
    // const onUsersClicked = () => navigate('/dash/users')

    // let dashClass = null
    // if (!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
    //     dashClass = "dash-header__container--small"
    // }

    // let newNoteButton = null
    // if (NOTES_REGEX.test(pathname)) {
    //     newNoteButton = (
    //         <button
    //             className="icon-button"
    //             title="New Note"
    //             onClick={onNewNoteClicked}
    //         >
    //             <FontAwesomeIcon icon={faFileCirclePlus} />
    //         </button>
    //     )
    // }

    // let newUserButton = null
    // if (USERS_REGEX.test(pathname)) {
    //     newUserButton = (
    //         <button
    //             className="icon-button"
    //             title="New User"
    //             onClick={onNewUserClicked}
    //         >
    //             <FontAwesomeIcon icon={faUserPlus} />
    //         </button>
    //     )
    // }

    // let userButton = null
    // if (isManager || isAdmin) {
    //     if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
    //         userButton = (
    //             <button
    //                 className="icon-button"
    //                 title="Users"
    //                 onClick={onUsersClicked}
    //             >
    //                 <FontAwesomeIcon icon={faUserGear} />
    //             </button>
    //         )
    //     }
    // }

    // let notesButton = null
    // if (!NOTES_REGEX.test(pathname) && pathname.includes('/dash')) {
    //     notesButton = (
    //         <button
    //             className="icon-button"
    //             title="Notes"
    //             onClick={onNotesClicked}
    //         >
    //             <FontAwesomeIcon icon={faFilePen} />
    //         </button>
    //     )
    // }

    const logoutButton = (


        <button
            className="icon-button"
            title="Logout"
            onClick={() => {
                try {



                    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
                    sendLogout().unwrap()
                    setIsLogoutSuccess(true)
                }catch(err){

                }
            }}
        >
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <FontAwesomeIcon icon={faRightFromBracket} />
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </button>
    )

    const errClass = isError ? "errmsg" : "offscreen"

    let buttonContent
    if (isLoading) {

        buttonContent = <PulseLoader color={"#FFF"} />
    } else {
        buttonContent = (

            <>
                {/* {newNoteButton} */}
                {/* {newUserButton} */}
                {/* {notesButton} */}
                {/* {userButton} */}
                {logoutButton}
            </>
        )
    }

    const content = (


        <>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(2339): Property 'data' does not exist on type 'FetchBaseQ... Remove this comment to see the full error message
            // @ts-expect-error TS(2339): Property 'data' does not exist on type 'FetchBaseQ... Remove this comment to see the full error message
            <p className={errClass}>{error?.data?.message}</p>

            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <header className="dash-header">
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className={`dash-header__container`}>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <Link to="/dash">
                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        <h1 className="dash-header__title">techNotes</h1>
                    </Link>

                    {imageSrc ? (


                        <img src={imageSrc} alt="Stored in localStorage" style={{width : '100px', height : 'auto'}}/>
                    ) : (


                        <p>No image</p>
                    )}
                    
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <nav className="dash-header__nav">
                        {buttonContent}
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    </nav>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </header>
        </>
    )

    return content
}
export default Header