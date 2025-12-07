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
import { useWithCatchError } from "@/common/hooks/catch-error";
import { useDispatchToastError } from "@/common/hooks/toast";
import { useErrorCodeToString, useLocalizedStrings } from "@/locales/hooks";
import { isAdminUser } from "@/permission/common/checker";
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

    const ls = useLocalizedStrings();

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

    const signOut = useWithCatchError(async () => {
        await handleSignOutAsync();
        await navigate({ to: "/" });
    });

    if (!currentUser) {
        return null;
    }

    return (
        <Menu positioning={{ autoSize: true, position: "below", align: "end" }}>
            <MenuTrigger>
                <Tooltip content={ls.$USER_MENU_LABEL} relationship="label">
                    <Button className={styles.$button} appearance="transparent">
                        {isMiniScreen ? (
                            <Avatar {...(currentUser.avatar && { image: { src: currentUser.avatar } })} />
                        ) : (
                            <Persona
                                primaryText={currentUser.nickname || currentUser.username}
                                {...(currentUser.nickname && { secondaryText: currentUser.username })}
                                {...(currentUser.avatar && { avatar: { image: { src: currentUser.avatar } } })}
                            />
                        )}
                    </Button>
                </Tooltip>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItemLinkWithRouter to="/user/$id" params={{ id: currentUser.id.toString() }}>
                        {ls.$USER_MENU_PROFILE}
                    </MenuItemLinkWithRouter>
                    <MenuItemLinkWithRouter to="/user/$id/preference" params={{ id: currentUser.id.toString() }}>
                        {ls.$USER_MENU_SETTINGS}
                    </MenuItemLinkWithRouter>
                    <MenuDivider />
                    {currentUser && isAdminUser(currentUser.level) && (
                        <MenuItemLinkWithRouter to="/admin">Manage Site</MenuItemLinkWithRouter>
                    )}
                    <MenuDivider />
                    <MenuItem onClick={signOut}>{ls.$NAVIGATION_SIGN_OUT}</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};

const useStyles = makeStyles({
    $button: {
        minWidth: "unset",
    },
});

export default UserMenu;
