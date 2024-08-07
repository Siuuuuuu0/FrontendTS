import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import useTitle from "../../hooks/useTitle";
import { useCompleteRegisterMutation } from "./authApiSlice";
import { setCredentials } from './authSlice';
import { useDispatch, useSelector } from 'react-redux';
import usePersist from "../../hooks/usePersist";
import { useGetUsernamesMutation, useAddUsernameMutation } from "../../app/api/usernameApiSlice";
import { USER_REGEX, PWD_REGEX, FIRSTNAME_REGEX, LASTNAME_REGEX } from "../../config/regex";
import { useUploadProfilePictureMutation } from "../account/accountApiSlice";
import { useProfilePicture } from "../../context/profilePictureContext";
import { ErrorType, handleError } from "../../services/helpers";

interface RootState {
  auth: {
    userOrMail: string | null;
    googleId: string | null;
  };
}

const CompleteRegister: React.FC = () => {
    useTitle('New User');

    const [persist, setPersist] = usePersist();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const email: string|null = useSelector((state: RootState) => state.auth.userOrMail);
    const googleId: string|null = useSelector((state: RootState) => state.auth.googleId);

    const [completeRegister, {
        isLoading,
        isSuccess,
        isError
    }] = useCompleteRegisterMutation();
    
    const [uploadProfilePicture] = useUploadProfilePictureMutation();
    const { handleChange } = useProfilePicture();
    const [getUsernames] = useGetUsernamesMutation();
    const [addUsername] = useAddUsernameMutation();

    const [username, setUsername] = useState<string>('');
    const [validUsername, setValidUsername] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [validPassword, setValidPassword] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>('');
    const [validFirstName, setValidFirstName] = useState<boolean>(false);
    const [lastName, setLastName] = useState<string>('');
    const [validLastName, setValidLastName] = useState<boolean>(false);
    const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([]);
    const [displayUsernames, setDisplayUsernames] = useState<boolean>(false);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [errMsg, setErrMsg] = useState<string>('')

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username) || username === '');
    }, [username]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        setValidFirstName(FIRSTNAME_REGEX.test(firstName));
    }, [firstName]);

    useEffect(() => {
        setValidLastName(LASTNAME_REGEX.test(lastName));
    }, [lastName]);

    useEffect(() => {
        if (isSuccess) {
        setUsername('');
        setPassword('');
        setFirstName('');
        setLastName('');
        }
    }, [isSuccess, navigate]);

    useEffect(() => {
        const fetchFunc = async () => {
        if (validFirstName && validLastName) {
            try {
            const { usernames } = await getUsernames({ first_name: firstName, last_name: lastName }).unwrap();
            const usernameArray: string[] = Object.values(usernames);
            setSuggestedUsernames(usernameArray);
            setDisplayUsernames(true);
            } catch (err) {
                setErrMsg(handleError(err as ErrorType))
            }
        }
        }
        fetchFunc();
    }, [validFirstName, validLastName, firstName, lastName, getUsernames]);

    const onUsernameChanged = (e: ChangeEvent<HTMLInputElement>): void => setUsername(e.target.value);
    const onPasswordChanged = (e: ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value);
    const onFirstNameChanged = (e: ChangeEvent<HTMLInputElement>): void => setFirstName(e.target.value);
    const onLastNameChanged = (e: ChangeEvent<HTMLInputElement>): void => setLastName(e.target.value);
    const onProfilePictureChanged = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files) {
        setProfilePicture(e.target.files[0]);
        }
    };

    const uploadPP = async (id: string): Promise<void> => {
        const formData = new FormData();
        formData.append('id', id);
        if (!profilePicture) return;
        formData.append('profilePicture', profilePicture);
        try {
            const { id: uploadedId, image } = await uploadProfilePicture(formData).unwrap();
            handleChange({ id: uploadedId, image });
        } catch (err) {
            setErrMsg(handleError(err as ErrorType))
        }
    };

    const canSave: boolean = [(validUsername || username === ''), validFirstName, validLastName, validPassword].every(Boolean) && !isLoading;

    const onSaveUserClicked = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        if (canSave && email) {
            try {
                const { accessToken, id } = await completeRegister({ email, password, ...(username && { username }), ...(googleId && { googleId }), firstName, lastName }).unwrap();
                dispatch(setCredentials({ accessToken }));
                try {
                    await addUsername({ username }).unwrap();
                } catch (err) {
                    setErrMsg(handleError(err as ErrorType))
                }
                await uploadPP(id);
                setPassword('');
                setUsername('');
                setFirstName('');
                setLastName('');
                setValidUsername(false);
                setValidPassword(false);
                setValidFirstName(false);
                setValidLastName(false);
                navigate('/dash');
            } catch (err) {
                setErrMsg(handleError(err as ErrorType))
            }
        }
    };

    const handleToggle = (): void => (setPersist as React.Dispatch<React.SetStateAction<boolean>>)((prev: boolean) => !prev);

    const regenerateUsernames = async (): Promise<void> => {
        if (validFirstName && validLastName) {
            try {
                const { usernames } = await getUsernames({ first_name: firstName, last_name: lastName }).unwrap();
                const usernameArray = Object.values(usernames);
                setSuggestedUsernames(usernameArray);
                setDisplayUsernames(true);
            } catch (err) {
                setErrMsg(handleError(err as ErrorType))
            }
        }
    };

    const errClass: string = isError ? "errmsg" : "offscreen";
    const validUserClass: string = !validUsername ? 'form__input--incomplete' : '';
    const validPwdClass: string = !validPassword ? 'form__input--incomplete' : '';
    const validFirstNameClass: string = !validFirstName ? 'form__input--incomplete' : '';
    const validLastNameClass: string = !validLastName ? 'form__input--incomplete' : '';

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

            <label className="form__label" htmlFor="firstName">
            First Name: <span className="nowrap">[3-40 letters]</span>
            </label>
            <input
            className={`form__input ${validFirstNameClass}`}
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="off"
            value={firstName}
            onChange={onFirstNameChanged}
            />

            <label className="form__label" htmlFor="lastName">
            Last Name: <span className="nowrap">[3-40 letters]</span>
            </label>
            <input
            className={`form__input ${validLastNameClass}`}
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="off"
            value={lastName}
            onChange={onLastNameChanged}
            />

            {displayUsernames && (
            <div className="suggestions">
                {suggestedUsernames.map((suggestion, index) => (
                <div key={index} className="suggestion" onClick={() => setUsername(suggestion)}>
                    {suggestion}
                </div>
                ))}
                <button
                type="button"
                className="icon-button"
                title="Reload"
                onClick={regenerateUsernames}
                >
                <FontAwesomeIcon icon={faSyncAlt} />
                </button>
            </div>
            )}

            <label className="form__label" htmlFor="username">
            Username: <span className="nowrap">[letters, numbers, special characters except @]</span>
            </label>
            <input
            className={`form__input ${validUserClass}`}
            id="username"
            name="username"
            type="text"
            autoComplete="off"
            value={username}
            onChange={onUsernameChanged}
            />

            <label className="form__label" htmlFor="password">
            Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
            </label>
            <input
            className={`form__input ${validPwdClass}`}
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={onPasswordChanged}
            />

            <label className="form__label" htmlFor="profilePicture">
            Profile Picture:
            </label>
            <input
            className="form__input"
            id="profilePicture"
            name="profilePicture"
            type="file"
            accept="image/*"
            onChange={onProfilePictureChanged}
            />

            <label className="form__label" htmlFor="persist">
            <input
                type="checkbox"
                className="form__checkbox"
                id="persist"
                onChange={handleToggle}
                checked={persist as boolean}
            />
            Trust this device
            </label>
        </form>
        </>
    );
};

export default CompleteRegister;
