

import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation, useGoogleLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import useTitle from '../../hooks/useTitle'
import PulseLoader from 'react-spinners/PulseLoader'
import { setCredentials, setEmailOrUser, setGoogleId } from './authSlice'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
// import useProfilePicture from '../../hooks/useProfilePicture'
import { useGetProfilePictureMutation } from '../account/accountApiSlice'

import { useProfilePicture } from '../../context/profilePictureContext'



const Login = () => {
    useTitle('Login')

    const userRef = useRef()
    const errRef = useRef()
    const [userOrMail, setUserOrMail] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()

    // @ts-expect-error TS(2339): Property 'handleChange' does not exist on type 'un... Remove this comment to see the full error message
    const {handleChange} = useProfilePicture()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()
    const [googleLogin] = useGoogleLoginMutation()
    const [getProfilePicture] = useGetProfilePictureMutation()

    useEffect(() => {

        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [userOrMail, password])

    const handleProfilePicture = async (userId: any) => {
        try {
            const {id, image} = await getProfilePicture({id : userId}).unwrap()
            // console.log({id, image})
            // const toStore = {id, image}
            // console.log(toStore)
            handleChange({id, image})
            // console.log(profilePictureLS)
        }catch(err){
            // console.error(err)
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            await login({ userOrMail, password }).unwrap()
            dispatch(setEmailOrUser({userOrMail}))
            setUserOrMail('')
            setPassword('')
            navigate('/confirm-code')
        } catch (err) {



            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            if (!err.status) {
                setErrMsg('No Server Response');
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {



                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                setErrMsg(err.data?.message);
            }
        }
    }

    const handleUserInput = (e: any) => setUserOrMail(e.target.value)
    const handlePwdInput = (e: any) => setPassword(e.target.value)
    const handleToggle = () => setPersist((prev: any) => !prev)
    const handleGoogleLoginSuccess = async (response: any) => {
        const userObject = jwtDecode(response.credential);
        try {
            const data = await googleLogin({



                // @ts-expect-error TS(2339): Property 'email' does not exist on type 'JwtPayloa... Remove this comment to see the full error message
                email: userObject.email,



                // @ts-expect-error TS(2339): Property 'name' does not exist on type 'JwtPayload... Remove this comment to see the full error message
                name: userObject.name,
                googleId: userObject.sub || '',
            }).unwrap()
            setUserOrMail('')
            setPassword('')

            if(data.toRegister){
                const {email, googleId} = data
                dispatch(setEmailOrUser({userOrMail : email}))
                dispatch(setGoogleId({googleId}))
                navigate('/complete-register')
            }
            else if (data.accessToken){
                setPersist(true)
                const {accessToken} = data
                dispatch(setCredentials({accessToken}));
                handleProfilePicture(data.id)
                navigate('/dash'); 
            }
            else 
                setErrMsg(data.message || 'Google login failed');
            
        } catch (err) {
            console.log(err)
            setErrMsg('Google login failed');
        }
    };

    const handleGoogleLoginFailure = (error: any) => {
        console.error('Google login failed:', error);
        setErrMsg('Google login failed');
    };

    const errClass = errMsg ? "errmsg" : "offscreen"



    if (isLoading) return <PulseLoader color={"#FFF"} />

    const content = (


        <section className="public">
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <header>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <h1>Employee Login</h1>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </header>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <main className="login">
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                // @ts-expect-error TS(2339): Property 'undefined' does not exist on type 'JSX.I... Remove this comment to see the full error message
                // @ts-expect-error TS(2322): Type 'MutableRefObject<undefined>' is not assignab... Remove this comment to see the full error message
                // @ts-expect-error TS(2322): Type 'MutableRefObject<undefined>' is not assignab... Remove this comment to see the full error message
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <form className="form" onSubmit={handleSubmit}>
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <label htmlFor="username">Username:</label>
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <input
                        className="form__input"
                        type="text"
                        id="username"

                        // @ts-expect-error TS(2322): Type 'MutableRefObject<undefined>' is not assignab... Remove this comment to see the full error message
                        ref={userRef}
                        value={userOrMail}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                    />

                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <label htmlFor="password">Password:</label>
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <input
                        className="form__input"
                        type="password"
                        id="password"
                        onChange={handlePwdInput}
                        value={password}
                        required
                    />
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <button className="form__submit-button">Sign In</button>


                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <label htmlFor="persist" className="form__persist">
                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        <input
                            type="checkbox"
                            className="form__checkbox"
                            id="persist"
                            onChange={handleToggle}
                            checked={persist}
                        />
                        Trust This Device
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    </label>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </form>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}



                        // @ts-expect-error TS(2322): Type '(error: any) => void' is not assignable to t... Remove this comment to see the full error message
                        onError={handleGoogleLoginFailure}
                    />
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>

                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Link to="/reset">Reset password</Link>

            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </main>
            
            // @ts-expect-error TS(2578): Unused '@ts-expect-error' directive.
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(2578): Unused '@ts-expect-error' directive.
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <footer>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Link to="/">Back to Home</Link>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </footer>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </section>
    )

    return content
}
export default Login