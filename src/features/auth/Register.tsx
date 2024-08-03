// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
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

    const onEmailChanged = (e: any) => setEmail(e.target.value)

    const canSave = [validEmail].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e: any) => {
        e.preventDefault()
        if (canSave) {
            await register({email})
        }
    }

    const errClass = isError ? "errmsg" : "offscreen"
    const validEmailClass = !validEmail ? 'form__input--incomplete' : ''


    const content = (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <p className={errClass}>{error?.data?.message}</p>

            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <form className="form" onSubmit={onSaveUserClicked}>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className="form__title-row">
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <h2>New User</h2>
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <div className="form__action-buttons">
                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <FontAwesomeIcon icon={faSave} />
                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        </button>
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    </div>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>

                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <label className="form__label" htmlFor="email">
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    Email: <span className="nowrap">[Valid email]</span></label>
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
            </form>
            {emailSent&&(
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className="emailSent">
                    Email sent, please follow the link that was sent
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>
            )}
        </>
    )

    return content
}
export default Register