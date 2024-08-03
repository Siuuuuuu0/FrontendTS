// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useResetPasswordMutation } from './authApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';

const Reset = () => {
    const userRef = useRef();
    const errRef = useRef();
    const [userOrMail, setUserOrMail] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [isSent, setIsSent] = useState(false);

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [userOrMail]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            console.log(userOrMail)
            await resetPassword({ userOrMail }).unwrap();
            setIsSent(true);
            setUserOrMail('');
        } catch (err) {
            // if (!err.status) {
            //     setErrMsg('No Server Response');
            // } else if (err.status === 400) {
            //     setErrMsg('Missing Username or Email');
            // } else if (err.status === 404) {
            //     setErrMsg('User not found');
            // } else {
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                setErrMsg(err.data?.message);
            // }
            // errRef.current.focus();
        }
    };

    const handleUserInput = (e: any) => setUserOrMail(e.target.value);

    const errClass = errMsg ? "errmsg" : "offscreen";

    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    if (isLoading) return <PulseLoader color={"#FFF"} />;

    return (
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <section className="public">
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <header>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <h1>Reset Password</h1>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </header>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <main className="login">
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <form className="form" onSubmit={handleSubmit}>
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <label htmlFor="userOrMail">Username or Email:</label>
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <input
                        className="form__input"
                        type="text"
                        id="userOrMail"
                        ref={userRef}
                        value={userOrMail}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                    />
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <button className="form__submit-button">Reset Password</button>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </form>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                {isSent && <p className="successmsg">Password reset link sent successfully!</p>}
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </main>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <footer>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Link to="/">Back to Home</Link>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </footer>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </section>
    );
};

export default Reset;
