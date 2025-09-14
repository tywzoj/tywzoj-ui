import * as React from "react";

export const useCountdown = () => {
    const [countdown, setCountdown] = React.useState(0);

    const intervalRef = React.useRef<number | null>(null);
    const endTimeRef = React.useRef<number>(0);

    const startCountdown = React.useCallback((seconds: number) => {
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
        }
        setCountdown(seconds);
        endTimeRef.current = Date.now() + seconds * 1000;
        intervalRef.current = window.setInterval(() => {
            const remaining = endTimeRef.current - Date.now();
            if (remaining <= 0) {
                if (intervalRef.current) {
                    window.clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                setCountdown(0);
            } else {
                setCountdown(Math.ceil(remaining / 1000));
            }
        }, 50);
    }, []);

    const stopCountdown = React.useCallback(() => {
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setCountdown(0);
    }, []);

    React.useEffect(() => {
        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    return { countdown, startCountdown, stopCountdown };
};
