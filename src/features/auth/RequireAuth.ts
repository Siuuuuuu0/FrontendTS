import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const RequireAuth = ({
    allowedRoles
}: any) => {



    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'location'.
    const location = useLocation()
    const { roles } = useAuth()




    // @ts-expect-error TS(2364): The left-hand side of an assignment expression mus... Remove this comment to see the full error message
    const content = (
        roles.some((role: any) => allowedRoles.includes(role))



            // @ts-expect-error TS(2749): 'Outlet' refers to a value, but is being used as a... Remove this comment to see the full error message
            ? <Outlet />



            // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'location'.
            : <Navigate to="/login" state={{ from: location }} replace />
    )

    return content
}
export default RequireAuth