

import { useEffect } from "react"

const useTitle = (title: any) => {


    // @ts-expect-error TS(2345): Argument of type '() => () => string' is not assig... Remove this comment to see the full error message
    useEffect(() => {
        const prevTitle = document.title
        document.title = title

        return () => document.title = prevTitle
    }, [title])

}

export default useTitle