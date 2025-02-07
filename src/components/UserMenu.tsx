import {
    Avatar,
    Button,
    makeStyles,
    Menu,
    MenuDivider,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
    Persona,
    Tooltip,
} from "@fluentui/react-components";
import { useNavigate } from "@tanstack/react-router";
import React from "react";

import { signOutAsyncAction } from "@/common/actions/sign-in";
import { MenuItemLinkWithRouter } from "@/common/components/MenuItemLinkWithRouter";
import { useDispatchToastError } from "@/common/hooks/toast";
import { useErrorCodeToString, useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { AuthModule } from "@/server/api";
import { CE_ErrorCode } from "@/server/common/error-code";
import { useAppDispatch, useCurrentUser, useIsMiniScreen } from "@/store/hooks";

export const UserMenu: React.FC = () => {
    const isMiniScreen = useIsMiniScreen();
    const currentUser = useCurrentUser();
    const dispatch = useAppDispatch();
    const dispatchToastError = useDispatchToastError();
    const errorCodeToString = useErrorCodeToString();
    const navigate = useNavigate();

    const ls = useLocalizedStrings({
        label: CE_Strings.USER_MENU_LABEL,
        profile: CE_Strings.USER_MENU_PROFILE,
        settings: CE_Strings.USER_MENU_SETTINGS,
        signOut: CE_Strings.NAVIGATION_SIGN_OUT,
    });

    const styles = useStyles();

    const handleError = React.useCallback(
        (code: CE_ErrorCode) => {
            dispatchToastError(errorCodeToString(code));
        },
        [dispatchToastError, errorCodeToString],
    );

    const handleSignOutAsync = React.useCallback(async () => {
        const resp = await AuthModule.postSignOutAsync();

        if (resp.code === CE_ErrorCode.OK) {
            await dispatch(signOutAsyncAction(resp.data));
        } else {
            handleError(resp.code);
        }
    }, [dispatch, handleError]);

    const signOut = () => {
        handleSignOutAsync()
            .then(() => {
                navigate({ to: "/" });
            })
            .catch((e) => {
                dispatchToastError(e.message);
            });
    };

    if (!currentUser) {
        return null;
    }

    return (
        <Menu positioning={{ autoSize: true, position: "below", align: "end" }}>
            <MenuTrigger>
                <Tooltip content={ls.label} relationship="label">
                    <Button className={styles.button} appearance="transparent">
                        {isMiniScreen ? (
                            <Avatar />
                        ) : (
                            <Persona
                                primaryText={currentUser.nickname || currentUser.username}
                                secondaryText={currentUser.username}
                            />
                        )}
                    </Button>
                </Tooltip>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItemLinkWithRouter to="/user/$id" params={{ id: currentUser.id.toString() }}>
                        {ls.profile}
                    </MenuItemLinkWithRouter>
                    <MenuItemLinkWithRouter to="/user/$id/edit" params={{ id: currentUser.id.toString() }}>
                        {ls.settings}
                    </MenuItemLinkWithRouter>
                    <MenuDivider />
                    <MenuItem onClick={signOut}>{ls.signOut}</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};

const useStyles = makeStyles({
    button: {
        minWidth: "unset",
    },
});

export default UserMenu;
