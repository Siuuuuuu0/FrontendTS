

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

    const handlePasswordInput = (e: any) => setPassword(e.target.value);
    const handleConfirmPasswordInput = (e: any) => setConfirmPassword(e.target.value);

    const handleSubmit = async (e: any) => {
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



            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            setErrMsg(err.data?.message || 'An error occurred');
        }
    };

    const errClass = errMsg ? "errmsg" : "offscreen";



    if (isLoading) return <PulseLoader color={"#FFF"} />;

    return (


        <section className="public">
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <header>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <h1>Reset Password</h1>
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
                    <label htmlFor="password">New Password:</label>
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <input
                        className="form__input"
                        type="password"
                        id="password"
                        onChange={handlePasswordInput}
                        value={password}
                        required
                    />

                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <input
                        className="form__input"
                        type="password"
                        id="confirmPassword"
                        onChange={handleConfirmPasswordInput}
                        value={confirmPassword}
                        required
                    />
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <button className="form__submit-button">Reset Password</button>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </form>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </main>
        // @ts-expect-error TS(2578): Unused '@ts-expect-error' directive.
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        // @ts-expect-error TS(2578): Unused '@ts-expect-error' directive.
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </section>
    );
};

export default ConfirmReset;
