import { Outlet } from 'react-router-dom'
// @ts-expect-error TS(6142): Module './Header' was resolved to 'C:/Users/vadim/... Remove this comment to see the full error message
import Header from './Header'
// @ts-expect-error TS(6142): Module './Footer' was resolved to 'C:/Users/vadim/... Remove this comment to see the full error message
import Footer from './Footer'

const Dash = () => {
    return (
        <>
            // @ts-expect-error TS(2749): 'Header' refers to a value, but is being used as a... Remove this comment to see the full error message
            <Header />
            // @ts-expect-error TS(2304): Cannot find name 'div'.
            <div className="dash-container">
                // @ts-expect-error TS(2749): 'Outlet' refers to a value, but is being used as a... Remove this comment to see the full error message
                <Outlet />
            </div>
            // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
            <Footer />
        </>
    )
}
export default Dash