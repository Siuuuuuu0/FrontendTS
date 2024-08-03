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

    const handleSubmit = async (e) => {
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
                setErrMsg(err.data?.message);
            // }
            // errRef.current.focus();
        }
    };

    const handleUserInput = (e) => setUserOrMail(e.target.value);

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
                    <label htmlFor="userOrMail">Username or Email:</label>
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
                    <button className="form__submit-button">Reset Password</button>
                </form>
                {isSent && <p className="successmsg">Password reset link sent successfully!</p>}
            </main>
            <footer>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
    );
};

export default Reset;
