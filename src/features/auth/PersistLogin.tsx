import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from 'react-redux';
import { selectCurrentToken } from "./authSlice";
import PulseLoader from 'react-spinners/PulseLoader';
import { ErrorType, handleError } from "../../services/helpers";

const PersistLogin: React.FC = () => {
    const [persist] = usePersist();
    const token: string | null = useSelector(selectCurrentToken);
    const effectRan: React.MutableRefObject<boolean> = useRef<boolean>(false);
    const [trueSuccess, setTrueSuccess] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string>('')

    const [refresh, { isUninitialized, isLoading, isSuccess, isError}] = useRefreshMutation();

    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
            const verifyRefreshToken = async (): Promise<void> => {
                try {
                    await refresh({}).unwrap();
                    setTrueSuccess(true);
                } catch (err) {
                    setErrMsg(handleError(err as ErrorType));
                }
            };

            if (!token && persist) verifyRefreshToken();
        }

        return () => {
            effectRan.current = true;
        };
    }, [token, persist, refresh]);

    let content;
    if (!persist) {
        content = <Outlet />;
    } else if (isLoading) {
        content = <PulseLoader color={"#FFF"} />;
    } else if (isError) {
        content = (
            <p className='errmsg'>
                {`${errMsg ?? 'Error occurred'} - `}
                <Link to="/login">Please login again</Link>.
            </p>
        );
    } else if (isSuccess && trueSuccess) {
        content = <Outlet />;
    } else if (token && isUninitialized) {
        content = <Outlet />;
    }

    return content;
};

export default PersistLogin;
