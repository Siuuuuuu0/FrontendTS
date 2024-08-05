import React from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useConfirmRegisterMutation } from './authApiSlice'
import { useDispatch } from 'react-redux'
import { setEmailOrUser } from './authSlice'
import { ErrorType, handleError } from "../../services/helpers"

const ConfirmRegistration: React.FC = () => {
    const location = useLocation()
    const searchParams: URLSearchParams = new URLSearchParams(location.search)
    const token: string | null = searchParams.get('token')
    const navigate = useNavigate()
    const [confirmRegistration] = useConfirmRegisterMutation()
    const dispatch = useDispatch()

    const handleConfirmClick = async (): Promise<void> => {
        if(token){
            try {
                const response = await confirmRegistration({ token }).unwrap()
                const userOrMail: string = response.email
                dispatch(setEmailOrUser({ userOrMail }))
                navigate('/complete-register')
            } catch (err) {
                const errorMessage: string = handleError(err as ErrorType)
                console.error('Failed to confirm registration:', errorMessage)
            }
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
