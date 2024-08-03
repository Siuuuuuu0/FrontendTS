import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"
import { USER_REGEX, PWD_REGEX, EMAIL_REGEX } from "../../config/regex"
import { useDeleteProfilePictureMutation } from "../account/accountApiSlice"

const EditUserForm = ({ user }) => {

    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')
    const [isError, setIsError] = useState('')

    const [updateUser, {
        isLoading
    }] = useUpdateUserMutation()

    const [deleteUser] = useDeleteUserMutation()
    const [deleteProfilePicture] = useDeleteProfilePictureMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [email, setEmail] = useState(user.email)
    const [validEmail, setValidEmail] = useState(false)
    // const [roles, setRoles] = useState(user.roles)
    const [selectedRoles, setSelectedRoles] = useState(user.roles);

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email])

    useEffect(() => {
        console.log(isSuccess)
        if (isSuccess) {
            setUsername('')
            setPassword('')
            setSelectedRoles({})
            navigate('/dash/users')
        }

    }, [isSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)

    const onRolesChanged = e => {
        const { options } = e.target;
        const selected = {};
        for (const option of options) {
            if (option.selected) {
                selected[option.label] = parseInt(option.value, 10);
            }
        }
        setSelectedRoles(selected);
    }

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
            console.log(err);
            setIsError(true);
            setError(err.data?.message || 'Failed to update user');
        }
    };


    const onDeleteUserClicked = async () => {
        try{
            await deleteUser({ id: user.id }).unwrap();
            deleteProfilePicture({userId : user.id})
            setIsSuccess(true)
        }catch(err){
            console.log(err)
            setIsError(true)
            setError(err)
        }
    }

    // const options = Object.values(ROLES).map(role => {
    //     return (
    //         <option
    //             key={role}
    //             value={role}

    //         > {role}</option >
    //     )
    // })

    let canSave
    if (password) {
        canSave = [/*roles.length, */ Object.keys(selectedRoles).length, validUsername, validPassword, validEmail].every(Boolean) && !isLoading
    } else {
        canSave = [/*roles.length, */ Object.keys(selectedRoles).length, validUsername, validEmail].every(Boolean) && !isLoading
    }

    const errClass = (isError) ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
    const validEmailClass = email && !validEmail ? 'form__input--incomplete' : ''
    // const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''
    const validRolesClass = !Object.keys(selectedRoles).length ? 'form__input--incomplete' : '';

    const errContent = (error?.data?.message) ?? ''


    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
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
                    Username: <span className="nowrap">[3-20 upper and lowercase letters]</span></label>
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
                    Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label" htmlFor="password">
                    Email: <span className="nowrap">[valid email]</span></label>
                <input
                    className={`form__input ${validEmailClass}`}
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={onEmailChanged}
                />

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:</label>
                {/* <select
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple={true}
                    size="2"
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select> */}
                <select
                id="roles"
                name="roles"
                className={`form__select ${validRolesClass}`}
                 multiple 
                 value={Object.values(selectedRoles)} 
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
    )

    return content
}
export default EditUserForm