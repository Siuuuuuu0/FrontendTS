import React, { useEffect, useState, useRef } from 'react';
import { useConfirmUpdateEmailMutation, useConfirmUpdatePasswordMutation } from './accountApiSlice';
import { PulseLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { setCredentials } from '../auth/authSlice';
import { ErrorType, handleError } from '../../services/helpers';

const Update: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const errRef = useRef<HTMLParagraphElement>(null);
    const location = useLocation();

    const [errMsg, setErrMsg] = useState<string>('');

    const queryParams: URLSearchParams = new URLSearchParams(location.search);
    const token: string | null = queryParams.get('token');
    const isEmailUpdate: boolean = location.pathname === '/dash/update-email';

    const [updateEmail, { isLoading: isUpdatingEmail }] = useConfirmUpdateEmailMutation();
    const [updatePassword, { isLoading: isUpdatingPassword }] = useConfirmUpdatePasswordMutation();

    useEffect(() => {
        const update = async (): Promise<void> => {
            if (token) {
                try {
                    const { accessToken } = isEmailUpdate
                        ? await updateEmail({ token }).unwrap()
                        : await updatePassword({ token }).unwrap();

                    dispatch(setCredentials({ accessToken }));
                    navigate('/dash/settings');
                } catch (err) {
                    setErrMsg(handleError(err as ErrorType));
                    if (errRef.current) {
                        errRef.current.focus();
                    }
                }
            }
        };

        update();
    }, [dispatch, navigate, token, isEmailUpdate, updateEmail, updatePassword]);

    const isLoading = isUpdatingEmail || isUpdatingPassword;
    const errClass = errMsg ? 'errmsg' : 'offscreen';

    if (isLoading) return <PulseLoader color={'#FFF'} />;

    return (
        <section className="public">
            <header>
                <h1>{isEmailUpdate ? 'Update Email' : 'Update Password'}</h1>
            </header>
            <main className="login">
                <p ref={errRef} className={errClass} aria-live="assertive">
                    {errMsg}
                </p>
                <p className="form__message">
                    {isEmailUpdate
                        ? 'Your email is being updated.'
                        : 'Your password is being updated.'}
                </p>
            </main>
            <footer>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
    );
};

export default Update;


