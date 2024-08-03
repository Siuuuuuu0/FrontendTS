import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'

const Welcome = () => {




    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'username'.
    const { username, isAdmin } = useAuth()

    useTitle(`welcome`)

    const date = new Date()



    // @ts-expect-error TS(2345): Argument of type '{ dateStyle: string; timeStyle: ... Remove this comment to see the full error message
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const content = (



        // @ts-expect-error TS(2552): Cannot find name 'section'. Did you mean 'Selectio... Remove this comment to see the full error message
        <section className="welcome">




            // @ts-expect-error TS(2304): Cannot find name 'p'.
            <p>{today}</p>




            // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'username'.
            <h1>Welcome {username}!</h1>




            // @ts-expect-error TS(2304): Cannot find name 'p'.
            {(isAdmin) && <p><Link to="/dash/users">View Users</Link></p>}




            // @ts-expect-error TS(2304): Cannot find name 'p'.
            {<p><Link to="/dash/settings">View Settings</Link></p>}

            {/* <p><Link to="/dash/notes">View techNotes</Link></p>

            <p><Link to="/dash/notes/new">Add New techNote</Link></p>

            {(isManager || isAdmin) && <p><Link to="/dash/users">View User Settings</Link></p>}

            {(isManager || isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>} */}

        </section>
    )

    return content
}
export default Welcome