import React from "react";

import { setPageTitleAction } from "@/store/actions";
import { useAppDispatch } from "@/store/hooks";

export const useSetPageTitle = (title: string) => {
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(setPageTitleAction(title));
    }, [dispatch, title]);
};
