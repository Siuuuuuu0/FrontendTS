import { useEffect } from "react"

const useTitle = (title: string): void => {
    useEffect((): (() => void) => {
        const prevTitle: string = document.title
        document.title = title

        return () => document.title = prevTitle
    }, [title])
}

export default useTitle