import { Outlet, Link } from "react-router-dom"
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./authSlice"
import PulseLoader from 'react-spinners/PulseLoader'

const PersistLogin = () => {

    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()


    useEffect(() => {

        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { 

            const verifyRefreshToken = async () => {
                console.log('verifying refresh token')
                try {
                     
                    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
                    await refresh()
                    
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }

            if (!token && persist) verifyRefreshToken()
        }

        return () => effectRan.current = true

    }, [])


    let content
    if (!persist) { 
        console.log('no persist')
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        content = <Outlet />
    } else if (isLoading) { 
        console.log('loading')
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        content = <PulseLoader color={"#FFF"} />
    } else if (isError) { 
        content = (
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <p className='errmsg'>
                // @ts-expect-error TS(2339): Property 'data' does not exist on type 'FetchBaseQ... Remove this comment to see the full error message
                {`${error?.data?.message} - `}
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Link to="/login">Please login again</Link>.
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </p>
        )
    } else if (isSuccess && trueSuccess) { 
        console.log('success')
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        content = <Outlet />
    } else if (token && isUninitialized) { 
        console.log('token and uninit')
        console.log(isUninitialized)
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        content = <Outlet />
    }

    return content
}
export default PersistLogin