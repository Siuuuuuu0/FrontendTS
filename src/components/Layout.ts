import { Outlet } from 'react-router-dom'

const Layout = () => {
    // @ts-expect-error TS(2749): 'Outlet' refers to a value, but is being used as a... Remove this comment to see the full error message
    return <Outlet />
}
export default Layout