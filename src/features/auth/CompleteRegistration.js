import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faSyncAlt } from "@fortawesome/free-solid-svg-icons"
import useTitle from "../../hooks/useTitle"
import { useCompleteRegisterMutation } from "./authApiSlice"
import { setCredentials } from './authSlice'
import { useDispatch, useSelector } from 'react-redux'
import usePersist from "../../hooks/usePersist"
import { useGetUsernamesMutation, useAddUsernameMutation } from "../../app/api/usernameApiSlice"
import { USER_REGEX, PWD_REGEX, FIRSTNAME_REGEX, LASTNAME_REGEX} from "../../config/regex"
import { useUploadProfilePictureMutation } from "../account/accountApiSlice"
import { useProfilePicture } from "../../context/profilePictureContext"
// import useProfilePicture from "../../hooks/useProfilePicture"

//TODO : ADD NON_OPTIONAL CLASS FOR EMAIL AND PWD

const CompleteRegister = () => {
    useTitle('New User')

    const [persist, setPersist] = usePersist()

    const dispatch = useDispatch()
    const email = useSelector((state) => state.auth.userOrMail)
    const googleId = useSelector((state) => state.auth.googleId)

    const [completeRegister, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useCompleteRegisterMutation()
    const [uploadProfilePicture] = useUploadProfilePictureMutation()
    // const { setProfilePictureLS } = useProfilePicture()

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [validFirstName, setValidFirstName] = useState(false)
    const [lastName, setLastName] = useState('')
    const [validLastName, setValidLastName] = useState(false)
    const [suggestedUsernames, setSuggestedUsernames] = useState([])
    const [displayUsernames, setDisplayUsernames] = useState(false)
    const [profilePicture, setProfilePicture] = useState(null)
    const {handleChange} = useProfilePicture()
    
    const [getUsernames] = useGetUsernamesMutation()
    const [addUsername] = useAddUsernameMutation()

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username)||username==='')
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        setValidFirstName(FIRSTNAME_REGEX.test(firstName))
    }, [firstName])

    useEffect(() => {
        setValidLastName(LASTNAME_REGEX.test(lastName))
    }, [lastName])
    
    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            setFirstName('')
            setLastName('')
        }
    }, [isSuccess, navigate])

    useEffect(()=> {
        const fetchFunc = async() => {
            if(validFirstName && validLastName) {
                try{
                    const {usernames} = await getUsernames({first_name : firstName, last_name : lastName}).unwrap()
                    const usernameArray = Object.values(usernames)
                    setSuggestedUsernames(usernameArray)
                    setDisplayUsernames(true)
                }catch(err){
                    console.error(err)
                }
            }
        }
        fetchFunc()
    }, [validFirstName, validLastName, firstName, lastName, getUsernames])



    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onFirstNameChanged = e => setFirstName(e.target.value)
    const onLastNameChanged = e => setLastName(e.target.value)
    const onProfilePictureChanged = e => setProfilePicture(e.target.files[0])

    const uploadPP = async(id) => {
        const formData = new FormData()
        formData.append('id', id)
        if (!profilePicture) return;
        formData.append('profilePicture', profilePicture)
        try {
            const {id, image} = await uploadProfilePicture(formData).unwrap()
            handleChange({id, image})
        }catch(err){
            console.error(err)
        }
    }

    const canSave = [(validUsername||username===''), validFirstName, validLastName, validPassword].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            try{
                const {accessToken, id} = await completeRegister({ email, password, ...(username&&{username}), ...(googleId&&{googleId}), firstName, lastName} ).unwrap()
                dispatch(setCredentials({ accessToken }))
                try{
                    await addUsername({username : username}).unwrap()
                }
                catch(err){
                    console.error(err)  //do it on the backend
                }
                uploadPP(id)
                
                setPassword('')
                setUsername('')
                setFirstName('')
                setLastName('')
                setValidUsername(false)
                setValidPassword(false)
                setValidFirstName(false)
                setValidLastName(false)
                
                navigate('/dash')
            }catch(err){
                console.log(err)
            }
        }
    }

    const handleToggle = () => setPersist(prev => !prev)

    const regenerateUsernames = async() => {
        if(validFirstName && validLastName) {
            try{
                const {usernames} = await getUsernames({first_name : firstName, last_name : lastName}).unwrap()
                const usernameArray = Object.values(usernames)
                setSuggestedUsernames(usernameArray)
                setDisplayUsernames(true)
            }catch(err){
                console.error(err)
            }
        }
    }

    const errClass = isError ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
    const validFirstNameClass = !validFirstName ? 'form__input--incomplete' : ''
    const validLastNameClass = !validLastName ? 'form__input--incomplete' : ''

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>New User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>

                <label className="form__label" htmlFor="username">
                    First Name: <span className="nowrap">[3-40 letters]</span></label>
                <input
                    className={`form__input ${validFirstNameClass}`}
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="off"
                    value={firstName}
                    onChange={onFirstNameChanged}
                />

                <label className="form__label" htmlFor="username">
                    Last Name: <span className="nowrap">[3-40 letters]</span></label>
                <input
                    className={`form__input ${validLastNameClass}`}
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="off"
                    value={lastName}
                    onChange={onLastNameChanged}
                />

                {displayUsernames && (
                    <>
                        <div className="suggestions">
                            {suggestedUsernames.map((suggestion, index) => (
                                <div key={index} className="suggestion" onClick={() => setUsername(suggestion)}>
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="icon-button"
                            title="Reload"
                            onClick={regenerateUsernames}
                        >
                            <FontAwesomeIcon icon={faSyncAlt} />
                        </button>
                    </>
                )
                }



                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[letters, numbers, special characters except @]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label" htmlFor="profilePicture">
                    Profile Picture:
                </label>
                <input
                    className="form__input"
                    id="profilePicture"
                    name="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={onProfilePictureChanged}
                />

                <label htmlFor="persist" className="form__persist">
                    <input
                        type="checkbox"
                        className="form__checkbox"
                        id="persist"
                        onChange={handleToggle}
                        checked={persist}
                    />
                    Trust This Device
                </label>

            </form>
        </>
    )

    return content
}
export default CompleteRegister