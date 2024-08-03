import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Dash = () => {
    return (
        <>
            <Header />
            <div className="dash-container">
                <Outlet />
            </div>
            <Footer />
        </>
    )
}
export default Dash