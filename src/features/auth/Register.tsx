import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";
import useTitle from "../../hooks/useTitle";
import { useRegisterMutation } from "./authApiSlice";
import { EMAIL_REGEX } from "../../config/regex";
import { ErrorType, handleError } from "../../services/helpers";

const Register: React.FC = () => {
    useTitle('New User');

    const [register, {
        isLoading,
        isSuccess,
        isError
    }] = useRegisterMutation();

    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [validEmail, setValidEmail] = useState<boolean>(false);
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>('')

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        if (isSuccess) {
            setEmail('');
            setValidEmail(false);
            setEmailSent(true);
        }
    }, [isSuccess, navigate]);

    const onEmailChanged = (e: ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value);

    const canSave: boolean = [validEmail].every(Boolean) && !isLoading;

    const onSaveUserClicked = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (canSave) {
            try {
                await register({ email });
            }catch (err) {
                setErrMsg(handleError(err as ErrorType));
            }
        }
    };

    const errClass: string = isError ? "errmsg" : "offscreen";
    const validEmailClass: string = !validEmail ? 'form__input--incomplete' : '';

    return (
        <>
            <p className={errClass}>{errMsg}</p>
            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>New User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>

                <label className="form__label" htmlFor="email">
                    Email: <span className="nowrap">[Valid email]</span>
                </label>
                <input
                    className={`form__input ${validEmailClass}`}
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={onEmailChanged}
                />
            </form>
            {emailSent && (
                <div className="emailSent">
                    Email sent, please follow the link that was sent.
                </div>
            )}
        </>
    );
};

export default Register;
