import React, { useState, useRef } from 'react'
import { useConfirmCodeMutation } from './authApiSlice'
import { setCredentials } from './authSlice'
import { PulseLoader } from 'react-spinners'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useGetProfilePictureMutation } from '../account/accountApiSlice'
import { useProfilePicture } from '../../context/profilePictureContext'
import { ErrorType, handleError } from "../../services/helpers"

const ConfirmCode: React.FC = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const errRef: React.RefObject<HTMLParagraphElement> = useRef<HTMLParagraphElement>(null)

    const [code, setCode] = useState<string>('')
    const [errMsg, setErrMsg] = useState<string>('')

    const [confirm,  { isLoading }] = useConfirmCodeMutation()
    const [getProfilePicture] = useGetProfilePictureMutation()

    const { handleChange } = useProfilePicture()

    const userOrMail:string = useSelector((state: { auth: { userOrMail: string } }) => state.auth.userOrMail);

    const handleProfilePicture = async (userId: string): Promise<void> => {
        try {
            const { id, image } = await getProfilePicture({ id: userId }).unwrap()
            // console.log({ id, image })
            handleChange({ id, image })
        } catch (err) {
            setErrMsg(handleError(err as ErrorType))
        }
    }

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()
        try {
            const { accessToken, id } = await confirm({ code, userOrMail }).unwrap()
            dispatch(setCredentials({ accessToken }))
            await handleProfilePicture(id)
            setCode('')
            navigate('/dash')
        } catch (err) {
            setErrMsg(handleError(err as ErrorType))
            if (errRef.current) {
                errRef.current.focus()
            }
        }
    }

    const handleCodeInput = (e: React.ChangeEvent<HTMLInputElement>): void => setCode(e.target.value)

    return (
        <section>
            <header>
                <h1>Confirm Code</h1>
            </header>
            <main>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="code">Confirmation Code</label>
                    <input
                        type="text"
                        id="code"
                        value={code}
                        onChange={handleCodeInput}
                        required
                    />
                    {isLoading ? <PulseLoader /> : <button type="submit">Confirm Code</button>}
                </form>
                {errMsg && <p ref={errRef} aria-live="assertive">{errMsg}</p>}
            </main>
            <footer>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
    )
}

export default ConfirmCode
