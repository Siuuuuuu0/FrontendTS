import { Outlet } from 'react-router-dom'

import Header from './Header'

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