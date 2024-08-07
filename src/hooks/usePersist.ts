import { useState, useEffect } from "react"

const usePersist = () => {
    const persistLS: string | null = localStorage.getItem("persist")
    const [persist, setPersist] = useState<boolean>(persistLS ? JSON.parse(persistLS) : false);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}
export default usePersist