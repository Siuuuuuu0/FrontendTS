import React, { useState, useEffect, ChangeEvent } from "react";
import { useUpdateAccountMutation, useDeleteAccountMutation, useDeleteProfilePictureMutation, useChangeProfilePictureMutation, useUploadProfilePictureMutation } from "./accountApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { USER_REGEX, PWD_REGEX, EMAIL_REGEX } from "../../config/regex";
import { useProfilePicture } from "../../context/profilePictureContext";

type Account = {
    id: string;
    username: string;
    email: string;
};

type SettingsProps = {
    account: Account;
};

const Settings: React.FC<SettingsProps> = ({ account }) => {
    const [error, setError] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);
    const [updateAccount, { isLoading }] = useUpdateAccountMutation();
    const [deleteAccount] = useDeleteAccountMutation();
    const [deleteProfilePicture] = useDeleteProfilePictureMutation();
    const [changeProfilePicture] = useChangeProfilePictureMutation();
    const [uploadProfilePicture] = useUploadProfilePictureMutation();
    const { profilePictureLS, handleChange } = useProfilePicture();
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>(account.username);
    const [validUsername, setValidUsername] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [validPassword, setValidPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>(account.email);
    const [validEmail, setValidEmail] = useState<boolean>(false);
    const [isSent, setIsSent] = useState<boolean>(false);
    const [profilePicture, setProfilePicture] = useState<File | undefined>();

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    const onUsernameChanged = (e: ChangeEvent<HTMLInputElement>): void => setUsername(e.target.value);
    const onPasswordChanged = (e: ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value);
    const onEmailChanged = (e: ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value);
    const onProfilePictureChanged = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
        } else {
            setProfilePicture(undefined);
        }
    };

    const changePP = async (): Promise<void> => {
        if (!profilePicture) return;
        const formData = new FormData();
        formData.append('id', profilePictureLS?.id ?? '');
        formData.append('profilePicture', profilePicture);
        try {
            const { id, image } = profilePictureLS
                ? await changeProfilePicture(formData).unwrap()
                : await uploadProfilePicture(formData).unwrap();
            handleChange({ id, image });
        } catch (err: any) {
            console.log(err);
            setIsError(true);
            setError(err?.data?.message || 'An error occurred');
        }
    };

    useEffect(() => {
        changePP();
    }, [profilePicture]);

    const onUpdateUsernameClicked = async (): Promise<void> => {
        try {
            await updateAccount({ id: account.id, toUpdate: { username } }).unwrap();
        } catch (err: any) {
            console.log(err);
            setIsError(true);
            setError(err?.data?.message || 'An error occurred');
        }
    };

    const onUpdatePasswordClicked = async (): Promise<void> => {
        try {
            await updateAccount({ id: account.id, toUpdate: { password } }).unwrap();
            setIsSent(true);
        } catch (err: any) {
            console.log(err);
            setIsError(true);
            setError(err?.data?.message || 'An error occurred');
        }
    };

    const onUpdateEmailClicked = async (): Promise<void> => {
        try {
            await updateAccount({ id: account.id, toUpdate: { email } }).unwrap();
            setIsSent(true);
        } catch (err: any) {
            console.log(err)
            setIsError(true)
            setError(err?.data?.message || 'An error occurred');
        }
    };

    const onDeleteAccountClicked = async (): Promise<void> => {
        try {
            await deleteAccount({ id: account.id }).unwrap();
            if (profilePictureLS?.id) {
                await deleteProfilePicture({ id: profilePictureLS.id }).unwrap();
            }
            handleChange(null);
            setEmail('');
            setPassword('');
            setUsername('');
            navigate('/');
        } catch (err: any) {
            console.log(err);
            setIsError(true);
            setError(err?.data?.message || 'An error occurred');
        }
    };

    const onDeletePPClicked = async (): Promise<void> => {
        if (profilePictureLS?.id) {
            try {
                const data = await deleteProfilePicture({ id: profilePictureLS.id }).unwrap();
                console.log(data);
                handleChange(null);
            } catch (err: any) {
                console.log(err);
                setIsError(true);
                setError(err?.data?.message || 'An error occurred');
            }
        }
    };

    const canSaveUsername: boolean = validUsername && !isLoading;
    const canSavePassword: boolean = validPassword && !isLoading;
    const canSaveEmail: boolean = validEmail && !isLoading;

    const errClass: string = isError ? "errmsg" : "offscreen";
    const validUserClass: string = !validUsername ? 'form__input--incomplete' : '';
    const validPwdClass: string = password && !validPassword ? 'form__input--incomplete' : '';
    const validEmailClass: string = email && !validEmail ? 'form__input--incomplete' : '';

    return (
        <>
            <p className={errClass}>{error}</p>
            <form className="form" onSubmit={(e) => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Settings</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Delete Account"
                            onClick={onDeleteAccountClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>

                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 upper and lowercase letters]</span>
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
                <button
                    className="icon-button"
                    title="Save Username"
                    onClick={onUpdateUsernameClicked}
                    disabled={!canSaveUsername}
                >
                    <FontAwesomeIcon icon={faSave} />
                </button>

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
                <button
                    className="icon-button"
                    title="Save Password"
                    onClick={onUpdatePasswordClicked}
                    disabled={!canSavePassword}
                >
                    <FontAwesomeIcon icon={faSave} />
                </button>

                <label className="form__label" htmlFor="email">
                    Email: <span className="nowrap">[valid email]</span>
                </label>
                <input
                    className={`form__input ${validEmailClass}`}
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={onEmailChanged}
                />
                <button
                    className="icon-button"
                    title="Save Email"
                    onClick={onUpdateEmailClicked}
                    disabled={!canSaveEmail}
                >
                    <FontAwesomeIcon icon={faSave} />
                </button>

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
                <button
                    className="icon-button"
                    title="Delete Profile Picture"
                    onClick={onDeletePPClicked}
                    disabled={!profilePictureLS}
                >
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
            </form>
            {isSent && <p>An email has been sent</p>}
        </>
    );
};

export default Settings;

