import {
    Button,
    Dropdown,
    Field,
    Image,
    Input,
    makeStyles,
    mergeClasses,
    Option,
    Textarea,
} from "@fluentui/react-components";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import logoDark from "@/assets/icon.dark.png";
import logoLight from "@/assets/icon.light.png";
import { refreshSessionInfoAsyncAction } from "@/common/actions/session-info";
import { ButtonWithRouter } from "@/common/components/ButtonWithRouter";
import { useWithCatchError } from "@/common/hooks/catch-error";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { useUserLevelStringMap } from "@/common/hooks/user-level";
import { flex } from "@/common/styles/flex";
import { diff } from "@/common/utils/diff";
import { format } from "@/common/utils/format";
import { UserLevelLabel } from "@/components/UserLevelLabel";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/locale";
import { useSuspenseQueryData } from "@/query/hooks";
import { CE_QueryId } from "@/query/id";
import { userDetailQueryKeys } from "@/query/keys";
import { createQueryOptionsFn } from "@/query/utils";
import { UserModule } from "@/server/api";
import { CE_UserLevel } from "@/server/common/permission";
import type { UserTypes } from "@/server/types";
import { withThrowErrors } from "@/server/utils";
import { useAppDispatch, useCurrentUser, useIsMiniScreen, usePermission } from "@/store/hooks";
import { useIsLightTheme } from "@/theme/hooks";

const UserEditPage: React.FC = () => {
    const { queryOptions } = Route.useLoaderData();
    const { data: userDetail } = useSuspenseQueryData(queryOptions);
    const queryClient = useQueryClient();
    const permission = usePermission();
    const isLightTheme = useIsLightTheme();
    const isMiniScreen = useIsMiniScreen();
    const fallBackAvatar = isLightTheme ? logoLight : logoDark;
    const currentUser = useCurrentUser()!; // I'm sure currentUser is not null.
    const dispatch = useAppDispatch();

    const ls = useLocalizedStrings({
        $title: CE_Strings.USER_EDIT_PAGE_TITLE_WITH_NAME,
        $username: CE_Strings.USERNAME_LABEL,
        $email: CE_Strings.EMAIL_LABEL,
        $nickname: CE_Strings.USER_NICKNAME_LABEL,
        $bio: CE_Strings.USER_BIO_LABEL,
        $level: CE_Strings.USER_LEVEL_LABEL,
        $saveButton: CE_Strings.COMMON_SAVE_BUTTON,
    });

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [nickname, setNickname] = React.useState("");
    const [level, setLevel] = React.useState(CE_UserLevel.General);
    const [bio, setBio] = React.useState("");
    const [pending, setPending] = React.useState(false);

    React.useEffect(() => {
        setUsername(userDetail.username);
        setNickname(userDetail.nickname ?? "");
        setEmail(userDetail.email ?? "");
        setBio(userDetail.bio ?? "");
        setLevel(userDetail.level);
    }, [userDetail]);

    useSetPageTitle(format(ls.$title, userDetail.username));

    const styles = useStyles();

    const handlePatchProblemAsync = useWithCatchError(async () => {
        const patchBody: UserTypes.IUserDetailPatchRequestBody = {};

        const shouldPatch = diff<Omit<UserTypes.IUserDetailPatchRequestBody, "emailVerificationCode">>(
            userDetail,
            {
                username,
                nickname,
                email,
                bio,
                level,
            },
            patchBody,
            ["username", "nickname", "email", "bio", "level"],
        );
        if (shouldPatch) {
            if (patchBody.email) {
                // TODO: hook up with email verification
                /*
                try {
                    patchBody.emailVerificationCode = await getEmailVerificationCodeAsync();
                } catch {
                    // user cancelled
                    return;
                }
                */
            }

            const strId = userDetail.id.toString();

            await patchUserDetailAsync(strId, patchBody);
            await queryClient.invalidateQueries({ queryKey: userDetailQueryKeys(strId) });

            if (currentUser.id === userDetail.id) {
                await dispatch(refreshSessionInfoAsyncAction());
            }
        }
    });

    const onSaveChanges = () => {
        setPending(true);
        handlePatchProblemAsync().finally(() => setPending(false));
    };

    return (
        <div className={styles.$root}>
            <form className={styles.$form}>
                <div className={styles.$fieldsWithAvatarContainer}>
                    <div className={styles.$fieldsWithAvatar}>
                        <Field label={ls.$username}>
                            <Input
                                disabled={pending}
                                readOnly={!permission.manageUser}
                                value={username}
                                onChange={(_, { value }) => {
                                    if (permission.manageUser) {
                                        setUsername(value);
                                    }
                                }}
                            />
                        </Field>
                        <Field label={ls.$nickname}>
                            <Input
                                disabled={pending}
                                value={nickname}
                                onChange={(_, { value }) => setNickname(value)}
                            />
                        </Field>
                    </div>
                    <Button
                        className={mergeClasses(styles.$avatar, isMiniScreen && styles.$avatarMiniScreen)}
                        disabled={pending}
                    >
                        <Image src={userDetail.avatar || fallBackAvatar} />
                    </Button>
                </div>
                <Field
                    label={ls.$email}
                    hint={"This email will be shown to others on profile page, and it will not be used for auth."}
                >
                    <Input value={email} type="email" onChange={(_, { value }) => setEmail(value)} />
                </Field>
                <Field label={ls.$bio}>
                    <Textarea
                        className={styles.$bioInput}
                        disabled={pending}
                        value={bio}
                        onChange={(_, { value }) => setBio(value)}
                    />
                </Field>
                {permission.manageUser && (
                    <Field label={ls.$level}>
                        <UserLevelSelector disabled={pending} level={level} onChange={setLevel} />
                    </Field>
                )}
                <div className={styles.$buttons}>
                    <Button appearance="primary" disabledFocusable={pending} onClick={onSaveChanges}>
                        {ls.$saveButton}
                    </Button>
                    <ButtonWithRouter to="/user/$id" params={{ id: String(userDetail.id) }} disabledFocusable={pending}>
                        Go to profile
                    </ButtonWithRouter>
                </div>
            </form>
        </div>
    );
};

const UserLevelSelector: React.FC<{
    level: CE_UserLevel;
    disabled?: boolean;
    onChange: (level: CE_UserLevel) => void;
}> = ({ level, disabled, onChange }) => {
    const userLevelStringMap = useUserLevelStringMap();

    const levels = [
        CE_UserLevel.Disabled,
        CE_UserLevel.Specific,
        CE_UserLevel.General,
        CE_UserLevel.Paid,
        CE_UserLevel.Internal,
        CE_UserLevel.Manager,
        CE_UserLevel.Admin,
    ];

    return (
        <Dropdown
            disabled={disabled}
            selectedOptions={[String(level)]}
            value={userLevelStringMap[level]}
            onOptionSelect={(_, data) => onChange(Number(data.optionValue))}
        >
            {levels.map((level) => (
                <Option key={`user-level-${level}`} value={String(level)} text={userLevelStringMap[level]}>
                    <UserLevelLabel userLevel={level} showTooltip={false} size="medium" />
                </Option>
            ))}
        </Dropdown>
    );
};

const useStyles = makeStyles({
    $root: {
        width: "100%",
    },
    $form: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "8px",
    },
    $fieldsWithAvatarContainer: {
        ...flex({
            justifyContent: "space-between",
            alignItems: "flex-end",
        }),
        gap: "8px",
    },
    $fieldsWithAvatar: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "8px",
        flexGrow: 1,
    },
    $avatar: {
        height: "120px",
        width: "120px",
        padding: "0",
        "> .fui-Image": {
            width: "100%",
            height: "100%",
        },
        boxSizing: "border-box",
        minWidth: "unset",
    },
    $avatarMiniScreen: {
        height: "100px",
        width: "100px",
    },
    $bioInput: {
        height: "200px",
    },
    $buttons: {
        ...flex({ justifyContent: "space-between" }),
        marginTop: "8px",
    },
});

const patchUserDetailAsync = withThrowErrors(UserModule.patchUserDetailAsync);

const queryOptionsFn = createQueryOptionsFn(CE_QueryId.UserDetail, withThrowErrors(UserModule.getUserDetailAsync));

export const Route = createFileRoute("/user/$id/_setting-layout/edit")({
    component: UserEditPage,
    loader: async ({ context: { queryClient }, params: { id } }) => {
        const queryOptions = queryOptionsFn(id);

        await queryClient.ensureQueryData(queryOptions);

        return { queryOptions };
    },
});
