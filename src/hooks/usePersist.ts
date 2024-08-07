import { useState, useEffect } from "react"

const usePersist = () => {
    const persistLS: string | null = localStorage.getItem("persist")
    const [persist, setPersist]: [boolean, React.Dispatch<boolean>] = useState(persistLS ? JSON.parse(persistLS) : false);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}
export default usePersist