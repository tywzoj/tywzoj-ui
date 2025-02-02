/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { v4 as uuid4 } from "uuid";

export const useAsyncFunctionResult = <P extends any[], R>(
    fn: (...args: P) => Promise<R>,
    args: P,
): {
    readonly result: R | null;
    readonly error: Error | null;
    readonly pending: boolean;
} => {
    const latestId = React.useRef<string>(null);

    const [result, setResult] = React.useState<R | null>(null);
    const [error, setError] = React.useState<Error | null>(null);
    const [pending, setPending] = React.useState<boolean>(true);

    // Invocations due to dependencies change
    React.useEffect(() => {
        const currentId = uuid4();
        latestId.current = currentId;
        setPending(true);
        fn(...args)
            .then((result) => {
                if (latestId.current === currentId) {
                    setResult(result);
                }
            })
            .catch((error) => {
                if (latestId.current === currentId) {
                    if (error instanceof Error) {
                        setError(error);
                    } else {
                        setError(new Error(String(error)));
                    }
                }
                console.error(error);
            })
            .finally(() => {
                if (latestId.current === currentId) {
                    setPending(false);
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fn, ...args]);

    return { result, error, pending };
};
