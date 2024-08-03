import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useConfirmResetPasswordMutation } from './authApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';

const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const ConfirmReset = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = new URLSearchParams(location.search).get('token');
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false)
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    const [confirmResetPassword, { isLoading }] = useConfirmResetPasswordMutation();

    const errRef = useRef();

    useEffect(() => {
        setErrMsg('');
    }, [password, confirmPassword]);

    const handlePasswordInput = (e) => setPassword(e.target.value);
    const handleConfirmPasswordInput = (e) => setConfirmPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword || !validPassword) {
            setErrMsg('Passwords do not match');
            return;
        }
        try {
            console.log({token, password})
            await confirmResetPassword({ token, password }).unwrap();
            setPassword('');
            setConfirmPassword('');
            navigate('/login');
        } catch (err) {
            setErrMsg(err.data?.message || 'An error occurred');
        }
    };

    const errClass = errMsg ? "errmsg" : "offscreen";

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
