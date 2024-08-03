// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useConfirmRegisterMutation } from './authApiSlice'
import { useDispatch } from 'react-redux'
import { setEmailOrUser } from './authSlice'

const ConfirmRegistration = () => {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get('token')
    const navigate = useNavigate()
    const [confirmRegistration] = useConfirmRegisterMutation()
    const dispatch = useDispatch()

    const handleConfirmClick = async () => {
        // console.log("clicked")
        try {
            const response = await confirmRegistration({ token }).unwrap()
            const userOrMail = response.email
            dispatch(setEmailOrUser({userOrMail}))
            navigate('/complete-register')
        } catch (error) {
            console.error('Failed to confirm registration:', error)
        }
    }

    return (
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <section className="public">
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <header>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <h1>Confirm Registration</h1>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </header>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <main className="login">
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <button 
                    className="form__submit-button" 
                    onClick={handleConfirmClick}
                >
                    Confirm Registration
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </button>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </main>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <footer>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Link to="/">Back to Home</Link>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </footer>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </section>
    )
}

export default ConfirmRegistration
