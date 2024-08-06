import { useState, useRef, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useResetPasswordMutation } from './authApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import { ErrorType, handleError } from '../../services/helpers';

const Reset: React.FC = () => {
    const userRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const errRef: React.RefObject<HTMLParagraphElement> = useRef<HTMLParagraphElement>(null);
    const [userOrMail, setUserOrMail] = useState<string>('');
    const [errMsg, setErrMsg] = useState<string>('');
    const [isSent, setIsSent] = useState<boolean>(false);

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    useEffect(() => {
        userRef.current?.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [userOrMail]);

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        try {
            // console.log(userOrMail);
            await resetPassword({ userOrMail }).unwrap();
            setIsSent(true);
            setUserOrMail('');
        } catch (err) {
            setErrMsg(handleError(err as ErrorType));
            errRef.current?.focus();
        }
    };

    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>): void => setUserOrMail(e.target.value);

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

