import { Link } from 'react-router-dom'

const Public = () => {
    const content = (



        // @ts-expect-error TS(2552): Cannot find name 'section'. Did you mean 'Selectio... Remove this comment to see the full error message
        <section className="public">



            // @ts-expect-error TS(2552): Cannot find name 'header'. Did you mean 'Headers'?
            <header>



                // @ts-expect-error TS(2304): Cannot find name 'h1'.
                <h1>Welcome to <span className="nowrap">Dan D. Repairs!</span></h1>
            </header>



            // @ts-expect-error TS(2304): Cannot find name 'main'.
            <main className="public__main">



                // @ts-expect-error TS(2304): Cannot find name 'p'.
                <p>Located in Beautiful Downtown Foo City, Dan D. Repairs  provides a trained staff ready to meet your tech repair needs.</p>



                // @ts-expect-error TS(2304): Cannot find name 'address'.
                <address className="public__addr">



                    // @ts-expect-error TS(2304): Cannot find name 'Dan'.
                    Dan D. Repairs<br />



                    // @ts-expect-error TS(2304): Cannot find name 'Foo'.
                    555 Foo Drive<br />



                    // @ts-expect-error TS(2304): Cannot find name 'Foo'.
                    Foo City, CA 12345<br />



                    // @ts-expect-error TS(2304): Cannot find name 'a'.
                    <a href="tel:+15555555555">(555) 555-5555</a>
                </address>



                // @ts-expect-error TS(2304): Cannot find name 'br'.
                <br />



                // @ts-expect-error TS(2304): Cannot find name 'p'.
                <p>Owner: Dan Davidson</p>
            </main>



            // @ts-expect-error TS(2304): Cannot find name 'footer'.
            <footer>



                // @ts-expect-error TS(2749): 'Link' refers to a value, but is being used as a t... Remove this comment to see the full error message
                <Link to="/login">Login</Link>



                // @ts-expect-error TS(2588): Cannot assign to 'to' because it is a constant.
                <Link to ="/register">Registration</Link>
            </footer>
        </section>

    )
    return content
}
export default Public