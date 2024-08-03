// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React, { useState, useRef } from 'react'
import { useConfirmCodeMutation } from './authApiSlice'
import { setCredentials } from './authSlice'
import { PulseLoader } from 'react-spinners'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useGetProfilePictureMutation } from '../account/accountApiSlice'
// @ts-expect-error TS(6142): Module '../../context/profilePictureContext' was r... Remove this comment to see the full error message
import { useProfilePicture } from '../../context/profilePictureContext'

const ConfirmCode = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const errRef = useRef()

    const [code, setCode] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const [confirm,  { isLoading }] = useConfirmCodeMutation()
    const [getProfilePicture] = useGetProfilePictureMutation()
    const {handleChange} = useProfilePicture()

    // @ts-expect-error TS(2571): Object is of type 'unknown'.
    const userOrMail = useSelector((state) => state.auth.userOrMail);

    const handleProfilePicture = async (userId: any) => {
        try {
            const {id, image} = await getProfilePicture({id : userId}).unwrap()
            console.log({id, image})
            handleChange({id, image})
        }catch(err){
            // console.error(err)
        }
    }

    const handleSubmit = async (e: any) => {
        try {
            const { accessToken, id } = await confirm({code, userOrMail}).unwrap()
            dispatch(setCredentials({ accessToken }))
            handleProfilePicture(id)
            setCode('')
            navigate('/dash')
        } catch (err) {
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            setErrMsg(err.data?.message);
            // errRef.current.focus();
        }
    }

    const handleCodeInput = (e: any) => setCode(e.target.value)

    const errClass = errMsg ? "errmsg" : "offscreen"

    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    if (isLoading) return <PulseLoader color={"#FFF"} />

    return (
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <section className="public">
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <header>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <h1>Confirm Code</h1>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </header>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <main className="login">
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <form className="form" onSubmit={handleSubmit}>
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <label htmlFor='Email Code'>
                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        <input
                            className="form__input"
                            type="code"
                            id="code"
                            onChange={handleCodeInput}
                            value={code}
                            required
                        />
                        
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    </label>
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <button className="form__submit-button">Confirm Code</button>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </form>
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

export default ConfirmCode