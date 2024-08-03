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
        <section className="public">
            <header>
                <h1>Confirm Registration</h1>
            </header>
            <main className="login">
                <button 
                    className="form__submit-button" 
                    onClick={handleConfirmClick}
                >
                    Confirm Registration
                </button>
            </main>
            <footer>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
    )
}

export default ConfirmRegistration
