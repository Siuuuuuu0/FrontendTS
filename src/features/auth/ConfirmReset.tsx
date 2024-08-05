import React, { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useConfirmResetPasswordMutation } from './authApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import { ErrorType, handleError } from '../../services/helpers';
import { PWD_REGEX } from '../../config/regex';

const ConfirmReset: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token: string | null = new URLSearchParams(location.search).get('token');
    
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [validPassword, setValidPassword] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>('');

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    const [confirmResetPassword, { isLoading }] = useConfirmResetPasswordMutation();

    const errRef: React.RefObject<HTMLParagraphElement> = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        setErrMsg('');
    }, [password, confirmPassword]);

    const handlePasswordInput = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
    const handleConfirmPasswordInput = (e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (password !== confirmPassword || !validPassword) {
            setErrMsg('Passwords do not match');
            return;
        }
        if(token){
            try {
                console.log({ token, password });
                await confirmResetPassword({ token, password }).unwrap();
                setPassword('');
                setConfirmPassword('');
                navigate('/login');
            } catch (err) {
                setErrMsg(handleError(err as ErrorType));
            }
        }
    };

    const errClass: string = errMsg ? 'errmsg' : 'offscreen';

    if (isLoading) return <PulseLoader color={"#FFF"} />;

    return (
        <section className="public">
            <header>
                <h1>Reset Password</h1>
            </header>
            <main className="login">
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>
                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="password">New Password:</label>
                    <input
                        className="form__input"
                        type="password"
                        id="password"
                        onChange={handlePasswordInput}
                        value={password}
                        required
                    />
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        className="form__input"
                        type="password"
                        id="confirmPassword"
                        onChange={handleConfirmPasswordInput}
                        value={confirmPassword}
                        required
                    />
                    <button className="form__submit-button">Reset Password</button>
                </form>
            </main>
        </section>
    );
};

export default ConfirmReset;

