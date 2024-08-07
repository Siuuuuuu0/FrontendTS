import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation, useGoogleLoginMutation, GL, GoogleLoginResponse, ConfirmResponse } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import useTitle from '../../hooks/useTitle';
import PulseLoader from 'react-spinners/PulseLoader';
import { setCredentials, setEmailOrUser, setGoogleId } from './authSlice';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // Corrected import statement
import { useGetProfilePictureMutation } from '../account/accountApiSlice';
import { useProfilePicture } from '../../context/profilePictureContext';
import { ErrorType, handleError } from '../../services/helpers';

const Login = () => {
    useTitle('Login');

    const userRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const errRef: React.RefObject<HTMLParagraphElement> = useRef<HTMLParagraphElement>(null);
    const [userOrMail, setUserOrMail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errMsg, setErrMsg] = useState<string>('');
    const [persist, setPersist] = usePersist();

    const { handleChange } = useProfilePicture();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();
    const [googleLogin] = useGoogleLoginMutation();
    const [getProfilePicture] = useGetProfilePictureMutation();

    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [userOrMail, password]);

    const handleProfilePicture = async (userId: string): Promise<void> => {
        try {
            const { id, image } = await getProfilePicture({ id: userId }).unwrap();
            handleChange({ id, image });
        } catch (err) {
            setErrMsg(handleError(err as ErrorType));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            await login({ userOrMail, password }).unwrap();
            dispatch(setEmailOrUser({ userOrMail }));
            setUserOrMail('');
            setPassword('');
            navigate('/confirm-code');
        } catch (err: any) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.data?.message || 'Login failed');
            }
        }
    };

    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>): void => setUserOrMail(e.target.value);
    const handlePwdInput = (e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value);
    const handleToggle = (): void => (setPersist as React.Dispatch<React.SetStateAction<boolean>>)((prev: boolean) => !prev);

    const isGL = (response: GoogleLoginResponse): response is GL => {
        return (response as GL).toRegister !== undefined;
    }

    const handleGoogleLoginSuccess = async (response: CredentialResponse): Promise<void> => {
        const userObject: any = jwtDecode(response.credential ?? '');
        if(userObject){
            try {
                const data: GoogleLoginResponse = await googleLogin({
                    email: userObject.email,
                    name: userObject.name,
                    googleId: userObject.sub || '',
                }).unwrap();

                setUserOrMail('');
                setPassword('');

                if (isGL(data)) {
                    const { email, googleId } = data;
                    dispatch(setEmailOrUser({ userOrMail: email }));
                    dispatch(setGoogleId({ googleId }));
                    navigate('/complete-register');
                } else if (data.accessToken) {
                    (setPersist as React.Dispatch<React.SetStateAction<boolean>>)(true);
                    const { accessToken } = data;
                    dispatch(setCredentials({ accessToken }));
                    handleProfilePicture(data.id);
                    navigate('/dash');
                } else {
                    setErrMsg('Google login failed');
                }
            } catch (err) {
                setErrMsg(handleError(err as ErrorType));
            }
        }
    };

    const handleGoogleLoginFailure =(): void => {
        console.error('Google login failed:');
        setErrMsg('Google login failed');
    };

    const errClass = errMsg ? 'errmsg' : 'offscreen';

    if (isLoading) return <PulseLoader color={'#FFF'} />;

    return (
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
                            checked={persist as boolean}
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
    );
};

export default Login;
