import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import useTitle from "../../hooks/useTitle"
import { useRegisterMutation } from "./authApiSlice"


//TODO : ADD NON_OPTIONAL CLASS FOR EMAIL AND PWD

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

const Register = () => {
    useTitle('New User')

    const [register, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRegisterMutation()

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [emailSent, setEmailSent] = useState(false) 

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email])
    

    useEffect(() => {
        if (isSuccess) {
            setEmail('')
            setValidEmail(false)
            setEmailSent(true)
        }
    }, [isSuccess, navigate])

    const onEmailChanged = e => setEmail(e.target.value)

    const canSave = [validEmail].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await register({email})
        }
    }

    const errClass = isError ? "errmsg" : "offscreen"
    const validEmailClass = !validEmail ? 'form__input--incomplete' : ''


    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

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
                    Email: <span className="nowrap">[Valid email]</span></label>
                <input
                    className={`form__input ${validEmailClass}`}
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={onEmailChanged}
                />

            </form>
            {emailSent&&(
                <div className="emailSent">
                    Email sent, please follow the link that was sent
                </div>
            )}
        </>
    )

    return content
}
export default Register