// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { useState, useEffect } from "react";
import { useUpdateAccountMutation, useDeleteAccountMutation, useDeleteProfilePictureMutation, useChangeProfilePictureMutation, useUploadProfilePictureMutation } from "./accountApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { USER_REGEX, PWD_REGEX, EMAIL_REGEX } from "../../config/regex";
// @ts-expect-error TS(6142): Module '../../context/profilePictureContext' was r... Remove this comment to see the full error message
import { useProfilePicture } from "../../context/profilePictureContext";

const Settings = ({
    account
}: any) => {
    
    const [error, setError] = useState('');
    const [isError, setIsError] = useState('');

    const [updateAccount, { isLoading }] = useUpdateAccountMutation();
    const [deleteAccount] = useDeleteAccountMutation();
    const [deleteProfilePicture] = useDeleteProfilePictureMutation();
    const [changeProfilePicture] = useChangeProfilePictureMutation();
    const [uploadProfilePicture] = useUploadProfilePictureMutation();
    const {profilePictureLS, handleChange} = useProfilePicture()

    const navigate = useNavigate();

    const [username, setUsername] = useState(account.username);
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [email, setEmail] = useState(account.email);
    const [validEmail, setValidEmail] = useState(false);
    const [isSent, setIsSent] = useState(false)
    const [profilePicture, setProfilePicture] = useState(null)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    const onUsernameChanged = (e: any) => setUsername(e.target.value);
    const onPasswordChanged = (e: any) => setPassword(e.target.value);
    const onEmailChanged = (e: any) => setEmail(e.target.value);
    const onProfilePictureChanged = (e: any) => setProfilePicture(e.target.files[0]);

    const changePP = async() => {
        if (!profilePicture) return;
        const formData = new FormData()
        formData.append('id', profilePictureLS ? profilePictureLS.id : account.id) 
        formData.append('profilePicture', profilePicture)
        try {
             const {id, image} = profilePictureLS ? await changeProfilePicture(formData).unwrap() : await uploadProfilePicture(formData).unwrap()

            handleChange({id, image})
        }catch(err){
            console.error(err)
        }
    };

    useEffect(() => {
        changePP()
    }, [profilePicture])

    const onUpdateUsernameClicked = async () => {
        try {
            await updateAccount({ id: account.id, toUpdate : {username} }).unwrap();
        } catch (err) {
            console.log(err);
            setIsError(true);
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            setError(err.data?.message || 'Failed to update username');
        }
    };

    const onUpdatePasswordClicked = async () => {
        try {
            await updateAccount({ id: account.id, toUpdate : {password} }).unwrap();
            setIsSent(true);
        } catch (err) {
            console.log(err);
            setIsError(true);
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            setError(err.data?.message || 'Failed to update password');
        }
    };

    const onUpdateEmailClicked = async () => {
        try {
            await updateAccount({ id: account.id, toUpdate : {email} }).unwrap();
            setIsSent(true);
        } catch (err) {
            console.log(err);
            setIsError(true);
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            setError(err.data?.message || 'Failed to update email');
        }
    };

    const onDeleteAccountClicked = async () => {
        try {
            await deleteAccount({ id: account.id }).unwrap();
            if(profilePictureLS) deleteProfilePicture({id : profilePictureLS.id})
            handleChange(null)
            setEmail('')
            setPassword('')
            setUsername('')
            navigate('/')
        } catch (err) {
            console.log(err);
            setIsError(true);
            setError(err);
        }
    };

    const onDeletePPClicked = async () => {
        try {
            const data = await deleteProfilePicture({id : profilePictureLS.id}).unwrap()
            console.log(data)
            handleChange(null)
        }catch(err){
            console.error(err)
        }
    }

    const canSaveUsername = validUsername && !isLoading;
    const canSavePassword = validPassword && !isLoading;
    const canSaveEmail = validEmail && !isLoading;

    const errClass = isError ? "errmsg" : "offscreen";
    const validUserClass = !validUsername ? 'form__input--incomplete' : '';
    const validPwdClass = password && !validPassword ? 'form__input--incomplete' : '';
    const validEmailClass = email && !validEmail ? 'form__input--incomplete' : '';

    const errContent = error?.data?.message ?? '';

    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    return <>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <p className={errClass}>{errContent}</p>

        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <form className="form" onSubmit={(e: any) => e.preventDefault()}>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className="form__title-row">
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <h2>Settings</h2>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className="form__action-buttons">
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <button
                        className="icon-button"
                        title="Delete Account"
                        onClick={onDeleteAccountClicked}
                    >
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <FontAwesomeIcon icon={faTrashCan} />
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    </button>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </div>
            
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <label className="form__label" htmlFor="username">
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                Username: <span className="nowrap">[3-20 upper and lowercase letters]</span>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </label>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <input
                className={`form__input ${validUserClass}`}
                id="username"
                name="username"
                type="text"
                autoComplete="off"
                value={username}
                onChange={onUsernameChanged}
            />
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <button
                className="icon-button"
                title="Save Username"
                onClick={onUpdateUsernameClicked}
                disabled={!canSaveUsername}
            >
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <FontAwesomeIcon icon={faSave} />
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </button>

            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <label className="form__label" htmlFor="password">
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </label>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <input
                className={`form__input ${validPwdClass}`}
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={onPasswordChanged}
            />
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <button
                className="icon-button"
                title="Save Password"
                onClick={onUpdatePasswordClicked}
                disabled={!canSavePassword}
            >
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <FontAwesomeIcon icon={faSave} />
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </button>

            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <label className="form__label" htmlFor="email">
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                Email: <span className="nowrap">[valid email]</span>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </label>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <input
                className={`form__input ${validEmailClass}`}
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={onEmailChanged}
            />
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <button
                className="icon-button"
                title="Save Email"
                onClick={onUpdateEmailClicked}
                disabled={!canSaveEmail}
            >
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <FontAwesomeIcon icon={faSave} />
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </button>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <label className="form__label" htmlFor="profilePicture">
                Profile Picture:
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </label>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <input
                className="form__input"
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/*"
                onChange={onProfilePictureChanged}
            />
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <button
                className="icon-button"
                title="Delete Profile Picture"
                onClick={onDeletePPClicked}
            >
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <FontAwesomeIcon icon={faTrashCan} />
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </button>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </form>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        {isSent && (<div>Email sent, please follow the link</div>)}
    </>;
};

export default Settings;
