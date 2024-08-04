import { ReactNode, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link } from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import { useProfilePicture } from '../context/profilePictureContext'

const Header: React.FC = () => {
    const navigate = useNavigate()

    const [isLogoutSuccess, setIsLogoutSuccess] = useState<boolean>(false)

    const {profilePictureLS, handleChange} = useProfilePicture()
    const [imageSrc, setImageSrc] = useState<string>('');

    useEffect(() => {
        // Retrieve the Base64 string from localStorage
        if (profilePictureLS?.image) {
            setImageSrc(profilePictureLS.image);
        }
        else setImageSrc('')
    }, [profilePictureLS]);

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

    const logoutButton = (


        <button
            className="icon-button"
            title="Logout"
            onClick={async() => {
                try {
                    await sendLogout({}).unwrap()
                    setIsLogoutSuccess(true)
                }catch(err){

                }
            }}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    const errClass: string = isError ? "errmsg" : "offscreen"

    let buttonContent: NonNullable<JSX.Element>
    if (isLoading) {

        buttonContent = <PulseLoader color={"#FFF"} />
    } else {
        buttonContent = (

            <>
                {logoutButton}
            </>
        )
    }

    const content = (


        <>
            <p className={errClass}>{
                (function(): ReactNode {
                    if(!error){
                        return <></>
                    }
                    else if('status' in error){
                        return <>Error: ${error.status} - ${JSON.stringify(error.data)}</>
                    }else if('message' in error){
                        return <>{error.message}</>
                    }else{
                        return <></>
                    }}
                )()
            }</p>
            <header className="dash-header">
                <div className={`dash-header__container`}>
                    <Link to="/dash">
                        <h1 className="dash-header__title">techNotes</h1>
                    </Link>

                    {imageSrc ? (


                        <img src={imageSrc} alt="Stored in localStorage" style={{width : '100px', height : 'auto'}}/>
                    ) : (


                        <p>No image</p>
                    )}
                    
                    <nav className="dash-header__nav">
                        {buttonContent}
                    </nav>
                </div>
            </header>
        </>
    )

    return content
}
export default Header