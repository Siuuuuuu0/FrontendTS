

import React, { useEffect, useState, useRef } from 'react';
import { useConfirmUpdateEmailMutation, useConfirmUpdatePasswordMutation } from './accountApiSlice';
import { PulseLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { setCredentials } from '../auth/authSlice';

const Update = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const errRef = useRef();
    const location = useLocation();

    const [errMsg, setErrMsg] = useState('');

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const isEmailUpdate = location.pathname === '/dash/update-email';

    const [updateEmail, { isLoading: isUpdatingEmail }] = useConfirmUpdateEmailMutation();
    const [updatePassword, { isLoading: isUpdatingPassword }] = useConfirmUpdatePasswordMutation();

    useEffect(() => {
        const update = async () => {
            if(token)
                try {
                    if (isEmailUpdate) {
                        const{accessToken} = await updateEmail({ token }).unwrap();
                        dispatch(setCredentials({accessToken}))
                    } else {
                        const{accessToken} = await updatePassword({ token }).unwrap();
                        dispatch(setCredentials({accessToken}))
                    }

                    navigate('/dash/settings');
                } catch (err) {
                    console.log(err)



                    // @ts-expect-error TS(2571): Object is of type 'unknown'.
                    setErrMsg(err.data?.message);
                    // errRef.current.focus();
                }
        };

        update();
    }, [dispatch, navigate, token, isEmailUpdate, updateEmail, updatePassword]);

    const isLoading = isUpdatingEmail || isUpdatingPassword;
    const errClass = errMsg ? 'errmsg' : 'offscreen';



    if (isLoading) return <PulseLoader color={'#FFF'} />;

    return (


        <section className="public">
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <header>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <h1>{isEmailUpdate ? 'Update Email' : 'Update Password'}</h1>
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
                <p ref={errRef} className={errClass} aria-live="assertive">
                    {errMsg}
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </p>

                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <p className="form__message">
                    {isEmailUpdate
                        ? 'Your email is being updated.'
                        : 'Your password is being updated.'}
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </p>
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
    );
};

export default Update;

