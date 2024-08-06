import React, { useState, useEffect, ChangeEvent } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";
import { USER_REGEX, PWD_REGEX, EMAIL_REGEX } from "../../config/regex";
import { useDeleteProfilePictureMutation } from "../account/accountApiSlice";
import { ErrorType, handleError } from "../../services/helpers";

interface User {
    id: string;
    username: string;
    email: string;
    roles: { [key: string]: number };
}

interface EditUserFormProps {
    user: User;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user }) => {
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);

    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [deleteProfilePicture] = useDeleteProfilePictureMutation();

    const navigate = useNavigate();

    const [username, setUsername] = useState<string>(user.username);
    const [validUsername, setValidUsername] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [validPassword, setValidPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>(user.email);
    const [validEmail, setValidEmail] = useState<boolean>(false);
    const [selectedRoles, setSelectedRoles] = useState<{[key: string]: number}>(user.roles);

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        if (isSuccess) {
            setUsername('');
            setPassword('');
            setSelectedRoles({});
            navigate('/dash/users');
        }
    }, [isSuccess, navigate]);

    const onUsernameChanged = (e: ChangeEvent<HTMLInputElement>): void => setUsername(e.target.value);
    const onPasswordChanged = (e: ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value);
    const onEmailChanged = (e: ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value);

    const onRolesChanged = (e: ChangeEvent<HTMLSelectElement>) => {
        const { options } = e.target;
        const selected: { [key: string]: number } = {};
        for (const option of options) {
            if (option.selected) {
                selected[option.label] = parseInt(option.value, 10);
            }
        }
        setSelectedRoles(selected);
    };

    const onSaveUserClicked = async () => {
        try {
            await updateUser({
                id: user.id,
                email,
                username,
                toUpdate: { roles: selectedRoles, email, username, ...(password && { password }) }
            }).unwrap();
            setIsSuccess(true);
        } catch (err) {
            setIsError(true);
            setError(handleError(err as ErrorType));
        }
    };

    const onDeleteUserClicked = async () => {
        try {
            await deleteUser({ id: user.id }).unwrap();
            await deleteProfilePicture({ userId: user.id });
            setIsSuccess(true);
        } catch (err) {
            setIsError(true);
            setError(handleError(err as ErrorType));
        }
    };

    let canSave: boolean = password
        ? [Object.keys(selectedRoles).length, validUsername, validPassword, validEmail].every(Boolean) && !isLoading
        : [Object.keys(selectedRoles).length, validUsername, validEmail].every(Boolean) && !isLoading;

    const errClass: string = isError ? "errmsg" : "offscreen";
    const validUserClass: string = !validUsername ? 'form__input--incomplete' : '';
    const validPwdClass: string = password && !validPassword ? 'form__input--incomplete' : '';
    const validEmailClass: string = email && !validEmail ? 'form__input--incomplete' : '';
    const validRolesClass: string = !Object.keys(selectedRoles).length ? 'form__input--incomplete' : '';

    const errContent: string = error;

    const content: JSX.Element = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={(e: React.FormEvent): void => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveUserClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteUserClicked}
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

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span>
                </label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

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

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:
                </label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple
                    value={(Object.values(selectedRoles)).map(value => value.toString())}
                    onChange={onRolesChanged}
                >
                    {Object.entries(ROLES).map(([role, value]) => (
                        <option key={role} value={value} label={role}>
                            {role}
                        </option>
                    ))}
                </select>
            </form>
        </>
    );

    return content;
};

export default EditUserForm;
