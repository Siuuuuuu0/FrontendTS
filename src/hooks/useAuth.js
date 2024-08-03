import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import { jwtDecode } from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isAdmin = false
    let status = "User"

    if (token) {
        const decoded = jwtDecode(token)
        const { username, roles, email, id } = decoded.Info

        isAdmin = roles.includes(200)

        if (isAdmin) status = "Admin"

        return { username, roles, status, isAdmin, email, id }
    }

    return { username: '', roles: [], isAdmin, status, email : "", id : "" }
}
export default useAuth