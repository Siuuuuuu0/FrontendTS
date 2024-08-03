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
    const {handleChange} = useProfilePicture()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()
    const [googleLogin] = useGoogleLoginMutation()
    const [getProfilePicture] = useGetProfilePictureMutation()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [userOrMail, password])

    const handleProfilePicture = async(userId) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await login({ userOrMail, password }).unwrap()
            dispatch(setEmailOrUser({userOrMail}))
            setUserOrMail('')
            setPassword('')
            navigate('/confirm-code')
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.data?.message);
            }
        }
    }

    const handleUserInput = (e) => setUserOrMail(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handleToggle = () => setPersist(prev => !prev)
    const handleGoogleLoginSuccess = async (response) => {
        const userObject = jwtDecode(response.credential);
        try {
            const data = await googleLogin({
                email: userObject.email,
                name: userObject.name,
                googleId: userObject.sub,
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

    const handleGoogleLoginFailure = (error) => {
        console.error('Google login failed:', error);
        setErrMsg('Google login failed');
    };

    const errClass = errMsg ? "errmsg" : "offscreen"

    if (isLoading) return <PulseLoader color={"#FFF"} />

    const content = (
        <section className="public">
            <header>
                <h1>Employee Login</h1>
            </header>
            <main className="login">
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        className="form__input"
                        type="text"
                        id="username"
                        ref={userRef}
                        value={userOrMail}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        className="form__input"
                        type="password"
                        id="password"
                        onChange={handlePwdInput}
                        value={password}
                        required
                    />
                    <button className="form__submit-button">Sign In</button>


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
                <div>
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={handleGoogleLoginFailure}
                    />
                </div>

                <Link to="/reset">Reset password</Link>

            </main>
            
            <footer>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
    )

    return content
}
export default Login