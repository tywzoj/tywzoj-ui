import { makeStyles, tokens } from "@fluentui/react-components";
import { useNProgress } from "@tanem/react-nprogress";
import React from "react";

import type { router } from "@/router/router";

export interface IGlobalProgressBarProps {
    router: typeof router;
}

export const GlobalProgressBar: React.FC<IGlobalProgressBarProps> = ({ router }) => {
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
        const unsubscribeOnBeforeNavigate = router.subscribe("onBeforeNavigate", () => setIsAnimating(false));
        const unsubscribeOnBeforeLoad = router.subscribe("onBeforeLoad", () => setIsAnimating(true));
        const unsubscribeOnLoad = router.subscribe("onLoad", () => setIsAnimating(false));

        return () => {
            unsubscribeOnBeforeNavigate();
            unsubscribeOnBeforeLoad();
            unsubscribeOnLoad();
        };
    }, [router]);

    const { isFinished, progress, animationDuration } = useNProgress({
        animationDuration: 250,
        incrementDuration: 300,
        isAnimating,
    });

    const styles = useStyles();

    return (
        <div
            className={styles.$root}
            style={{
                opacity: isFinished ? 0 : 1,
                transition: `opacity 0ms forwards`,
                transitionDelay: `${animationDuration}ms`,
            }}
        >
            <div
                className={styles.$inner}
                style={{
                    marginRight: `${(1 - progress) * 100}%`,
                    transition: `margin-right ${animationDuration}ms linear`,
                }}
            />
        </div>
    );
};

const useStyles = makeStyles({
    $root: {
        pointerEvents: "none",
        height: "2px",
        left: "0px",
        position: "fixed",
        top: "0px",
        width: "100%",
        zIndex: 99999,
    },
    $inner: {
        boxShadow: tokens.shadow4Brand,
        background: tokens.colorBrandForeground1,
        display: "block",
        height: "100%",
        position: "absolute",
        right: "0px",
        width: "100%",
    },
});
