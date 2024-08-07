import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import { jwtDecode } from 'jwt-decode'

type UseAuthType = {
    username : string, 
    email: string, 
    id: string, 
    roles : number[]
    isAdmin: boolean,
    status: string
}

type DecodedType = {
    Info : {
        username : string, 
        email: string, 
        id: string, 
        roles : number[]
    }
}

const useAuth = (): UseAuthType => {
    const token: string | null = useSelector(selectCurrentToken)
    let isAdmin: boolean = false
    let status: string = "User"

    if (token) {
        const decoded = jwtDecode<DecodedType>(token)

        const { username, roles, email, id } = decoded.Info

        isAdmin = roles.includes(200)

        if (isAdmin) status = "Admin"

        return { username, roles, status, isAdmin, email, id }
    }

    return { username: '', roles: [], isAdmin, status, email : "", id : "" }
}

export default useAuth