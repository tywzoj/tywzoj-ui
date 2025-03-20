import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Dropdown,
    Field,
    Image,
    Input,
    makeStyles,
    mergeClasses,
    Option,
    Text,
    Textarea,
    Tooltip,
} from "@fluentui/react-components";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import React from "react";

import logoDark from "@/assets/icon.dark.png";
import logoLight from "@/assets/icon.light.png";
import { refreshSessionInfoAsyncAction } from "@/common/actions/session-info";
import { ButtonWithRouter } from "@/common/components/ButtonWithRouter";
import { EMAIL_MAX_LENGTH, NICKNAME_MAX_LENGTH, USERNAME_MAX_LENGTH } from "@/common/constants/data-length";
import { useWithCatchError } from "@/common/hooks/catch-error";
import { useDialogAwaiter } from "@/common/hooks/dialog-awaiter";
import { useRecaptchaAsync } from "@/common/hooks/recaptcha";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { useUserLevelStringMap } from "@/common/hooks/user-level";
import { flex } from "@/common/styles/flex";
import { diff } from "@/common/utils/diff";
import { format } from "@/common/utils/format";
import { neverGuard } from "@/common/utils/never-guard";
import { Z_EMPTY_STRING } from "@/common/validators/common";
import { Z_EMAIL, Z_USERNAME } from "@/common/validators/user";
import { UserLevelLabel } from "@/components/UserLevelLabel";
import { useErrorCodeToString, useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/locale";
import { getLocale } from "@/locales/selectors";
import { useIsAllowedManageUser } from "@/permission/user/hooks";
import { useSuspenseQueryData } from "@/query/hooks";
import { userDetailQueryKeys } from "@/query/keys";
import { UserModule } from "@/server/api";
import { CE_ErrorCode } from "@/server/common/error-code";
import { CE_UserLevel } from "@/server/common/permission";
import type { UserTypes } from "@/server/types";
import type { IErrorCodeWillBeReturned } from "@/server/utils";
import { withThrowErrorsExcept } from "@/server/utils";
import { useAppDispatch, useAppSelector, useCurrentUser, useIsMiniScreen } from "@/store/hooks";
import { useIsLightTheme } from "@/theme/hooks";

const LayoutRoute = getRouteApi("/user/$id/_setting-layout");

const UserEditPage: React.FC = () => {
    const { userDetailQueryOptions, authDetailQueryOptions } = LayoutRoute.useLoaderData();
    const { data: userDetail } = useSuspenseQueryData(userDetailQueryOptions);
    const { data: authDetail } = useSuspenseQueryData(authDetailQueryOptions);
    const queryClient = useQueryClient();
    const isLightTheme = useIsLightTheme();
    const isMiniScreen = useIsMiniScreen();
    const fallBackAvatar = isLightTheme ? logoLight : logoDark;
    const currentUser = useCurrentUser()!; // I'm sure currentUser is not null.
    const dispatch = useAppDispatch();
    const isAllowedManage = useIsAllowedManageUser(userDetail);
    const locale = useAppSelector(getLocale);
    const errorToString = useErrorCodeToString();
    const recaptchaAsync = useRecaptchaAsync();

    const ls = useLocalizedStrings({
        $title: CE_Strings.USER_EDIT_PAGE_TITLE_WITH_NAME,
        $username: CE_Strings.USERNAME_LABEL,
        $usernameHint: CE_Strings.USERNAME_HINT,
        $email: CE_Strings.EMAIL_LABEL,
        $emailHint: CE_Strings.DISPLAY_EMAIL_HINT,
        $nickname: CE_Strings.USER_NICKNAME_LABEL,
        $bio: CE_Strings.USER_BIO_LABEL,
        $level: CE_Strings.USER_LEVEL_LABEL,
        $saveButton: CE_Strings.COMMON_SAVE_BUTTON,
        $resetButton: CE_Strings.COMMON_RESET_BUTTON,
        $submitButton: CE_Strings.COMMON_SUBMIT_BUTTON,
        $cancelButton: CE_Strings.COMMON_CANCEL_BUTTON,
        $goToProfileButton: CE_Strings.USER_EDIT_PAGE_GO_TO_PROFILE_BUTTON,
        $invalidUsername: CE_Strings.VALIDATION_ERROR_USERNAME_INVALID,
        $invalidEmail: CE_Strings.VALIDATION_ERROR_EMAIL_INVALID,
        $emailVerificationCode: CE_Strings.VERIFICATION_CODE_LABEL,
        $emailVerificationTitle: CE_Strings.USER_EDIT_PAGE_EMAIL_VERIFICATION_DIALOG_TITLE,
        $emailVerificationDesc: CE_Strings.USER_EDIT_PAGE_EMAIL_VERIFICATION_DIALOG_DESCRIPTION,
    });

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [nickname, setNickname] = React.useState("");
    const [level, setLevel] = React.useState(CE_UserLevel.General);
    const [bio, setBio] = React.useState("");
    const [emailVerificationCode, setEmailVerificationCode] = React.useState("");

    const [usernameError, setUsernameError] = React.useState<string>("");
    const [emailError, setEmailError] = React.useState<string>("");
    const [emailVerificationCodeError, setEmailVerificationCodeError] = React.useState<string>("");

    const [pending, setPending] = React.useState(false);
    const [emailVerificationDialogPending, setEmailVerificationDialogPending] = React.useState(false);
    const emailVerificationCodeRef = React.useRef(""); // To get value in async callback
    const emailVerificationCodeErrorRef = React.useRef(false);

    const {
        opened: emailVerificationDialogOpened,
        confirmAsync: waitingForEmailVerificationCodeAsync,
        onConfirm: onSubmitEmailVerification,
        onAbort: onCancelEmailVerification,
        closeDialog: closeEmailVerificationDialog,
    } = useDialogAwaiter();

    React.useEffect(() => {
        resetForm();
    }, [userDetail]); // eslint-disable-line react-hooks/exhaustive-deps

    useSetPageTitle(format(ls.$title, userDetail.username));

    const styles = useStyles();

    const resetForm = () => {
        setUsername(userDetail.username);
        setNickname(userDetail.nickname ?? "");
        setEmail(userDetail.email ?? "");
        setBio(userDetail.bio ?? "");
        setLevel(userDetail.level);

        setUsernameError("");
        setEmailError("");

        emailVerificationCodeErrorRef.current = false;
    };

    const validate = (): boolean => {
        let valid = true;

        if (!Z_USERNAME.safeParse(username).success) {
            setUsernameError(ls.$invalidUsername);
            valid = false;
        } else {
            setUsernameError("");
        }

        if (Z_EMAIL.or(Z_EMPTY_STRING).safeParse(email).success) {
            setEmailError("");
        } else {
            setEmailError(ls.$invalidEmail);
            valid = false;
        }

        return valid;
    };

    const handlePatchProblemError = React.useCallback(
        (code: IErrorCodeWillBeReturned<typeof patchUserDetailAsync>) => {
            switch (code) {
                case CE_ErrorCode.InvalidEmailVerificationCode:
                    setEmailVerificationCodeError(errorToString(code));
                    emailVerificationCodeErrorRef.current = true;
                    break;
                case CE_ErrorCode.User_DuplicateUsername:
                    setUsernameError(errorToString(code));
                    break;
                default:
                    neverGuard(code);
            }
        },
        [errorToString],
    );

    const handlePatchUserAsync = useWithCatchError(
        React.useCallback(async () => {
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
                if (patchBody.email && patchBody.email !== authDetail.email && !isAllowedManage) {
                    // If emailVerificationCodeError is true, it means the user has already submitted the code but invalid.
                    // So we just need to let user input and try again. Don't need to send the code and pop up the dialog again.
                    if (!emailVerificationCodeErrorRef.current) {
                        await sendChangeEmailCodeAsync(patchBody.email, locale, recaptchaAsync);

                        setEmailVerificationCode("");
                        setEmailVerificationCodeError("");
                        setEmailVerificationDialogPending(false);
                        emailVerificationCodeRef.current = "";

                        if (!(await waitingForEmailVerificationCodeAsync())) {
                            return;
                        }
                    }

                    setEmailVerificationDialogPending(true);
                    emailVerificationCodeErrorRef.current = false;
                    patchBody.emailVerificationCode = emailVerificationCodeRef.current;
                }

                const strId = userDetail.id.toString();

                const resp = await patchUserDetailAsync(strId, patchBody, recaptchaAsync);

                if (resp.code !== CE_ErrorCode.OK) {
                    handlePatchProblemError(resp.code);
                    return;
                }

                await queryClient.invalidateQueries({ queryKey: userDetailQueryKeys(strId) });

                if (currentUser.id === userDetail.id) {
                    await dispatch(refreshSessionInfoAsyncAction());
                }
            }
        }, [
            userDetail,
            username,
            nickname,
            email,
            bio,
            level,
            authDetail.email,
            isAllowedManage,
            recaptchaAsync,
            queryClient,
            currentUser.id,
            locale,
            waitingForEmailVerificationCodeAsync,
            handlePatchProblemError,
            dispatch,
        ]),
    );

    const onSaveChanges = () => {
        if (!validate()) {
            return;
        }

        setPending(true);
        handlePatchUserAsync().finally(() => {
            if (!emailVerificationCodeErrorRef.current) {
                closeEmailVerificationDialog();
            }
            setPending(false);
            setEmailVerificationDialogPending(false);
        });
    };

    return (
        <div className={styles.$root}>
            <form className={styles.$form}>
                <div className={styles.$fieldsWithAvatarContainer}>
                    <div className={styles.$fieldsWithAvatar}>
                        <Field label={ls.$username} hint={ls.$usernameHint} validationMessage={usernameError}>
                            <Input
                                disabled={pending}
                                readOnly={!isAllowedManage}
                                value={username}
                                maxLength={USERNAME_MAX_LENGTH}
                                onChange={(_, { value }) => {
                                    if (isAllowedManage) {
                                        setUsername(value);
                                        setUsernameError("");
                                    }
                                }}
                            />
                        </Field>
                    </div>
                    {/* TODO: add tooltip */}
                    <Tooltip content={"Change avatar"} relationship="label" withArrow>
                        <Button
                            className={mergeClasses(styles.$avatar, isMiniScreen && styles.$avatarMiniScreen)}
                            disabled={pending}
                        >
                            <Image src={userDetail.avatar || fallBackAvatar} />
                        </Button>
                    </Tooltip>
                </div>
                <Field label={ls.$nickname}>
                    <Input
                        disabled={pending}
                        value={nickname}
                        maxLength={NICKNAME_MAX_LENGTH}
                        onChange={(_, { value }) => setNickname(value)}
                    />
                </Field>
                <Field label={ls.$email} hint={ls.$emailHint} validationMessage={emailError}>
                    <Input
                        value={email}
                        type="email"
                        maxLength={EMAIL_MAX_LENGTH}
                        onChange={(_, { value }) => setEmail(value)}
                    />
                </Field>
                <Field label={ls.$bio}>
                    <Textarea
                        className={styles.$bioInput}
                        disabled={pending}
                        value={bio}
                        onChange={(_, { value }) => setBio(value)}
                    />
                </Field>
                {isAllowedManage && userDetail.id !== currentUser.id && (
                    <Field label={ls.$level}>
                        <UserLevelSelector disabled={pending} level={level} onChange={setLevel} />
                    </Field>
                )}
                <div className={mergeClasses(styles.$buttons, isMiniScreen && styles.$buttonsMiniScreen)}>
                    <div>
                        <Button appearance="primary" disabledFocusable={pending} onClick={onSaveChanges}>
                            {ls.$saveButton}
                        </Button>
                        <Button appearance="secondary" disabledFocusable={pending} onClick={resetForm}>
                            {ls.$resetButton}
                        </Button>
                    </div>
                    <ButtonWithRouter to="/user/$id" params={{ id: String(userDetail.id) }} disabledFocusable={pending}>
                        {ls.$goToProfileButton}
                    </ButtonWithRouter>
                </div>
            </form>
            {/* Email verification dialog */}
            <Dialog
                open={emailVerificationDialogOpened}
                onOpenChange={(_, { open }) => !open && onCancelEmailVerification()}
                modalType="alert"
            >
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>{ls.$emailVerificationTitle}</DialogTitle>
                        <DialogContent>
                            <Text>{ls.$emailVerificationDesc}</Text>
                            <form className={styles.$emailVerificationForm}>
                                <Field label={ls.$emailVerificationCode} validationMessage={emailVerificationCodeError}>
                                    <Input
                                        value={emailVerificationCode}
                                        onChange={(_, { value }) => {
                                            setEmailVerificationCode(value);
                                            setEmailVerificationCodeError("");
                                            emailVerificationCodeRef.current = value;
                                        }}
                                    />
                                </Field>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                appearance="primary"
                                disabled={!emailVerificationCode || emailVerificationDialogPending}
                                onClick={() => {
                                    if (emailVerificationCodeErrorRef.current) {
                                        onSaveChanges();
                                    } else {
                                        onSubmitEmailVerification(false /* closeDialog */);
                                    }
                                }}
                            >
                                {ls.$submitButton}
                            </Button>
                            <DialogTrigger disableButtonEnhancement>
                                <Button appearance="secondary" disabledFocusable={emailVerificationDialogPending}>
                                    {ls.$cancelButton}
                                </Button>
                            </DialogTrigger>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
            {/* TODO: avatar uploader dialog */}
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
            alignItems: "flex-start",
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
        minWidth: "120px",
        width: "120px",
        padding: "0",
        "> .fui-Image": {
            width: "100%",
            height: "100%",
        },
        boxSizing: "border-box",
    },
    $avatarMiniScreen: {
        marginTop: "26px",
        height: "100px",
        width: "100px",
        minWidth: "100px",
    },
    $bioInput: {
        height: "200px",
    },
    $buttons: {
        ...flex({ justifyContent: "space-between" }),
        marginTop: "8px",
        "> div": {
            ...flex({ justifyContent: "flex-start" }),
            gap: "8px",
        },
    },
    $buttonsMiniScreen: {
        ...flex({ flexDirection: "column" }),
        gap: "8px",
        "> div": {
            ...flex(),
            gap: "8px",
            "> button": {
                flex: "1",
            },
        },
    },
    $emailVerificationForm: {
        marginTop: "16px",
    },
});

const patchUserDetailAsync = withThrowErrorsExcept(
    UserModule.patchUserDetailAsync,
    CE_ErrorCode.InvalidEmailVerificationCode,
    CE_ErrorCode.User_DuplicateUsername,
);
const sendChangeEmailCodeAsync = withThrowErrorsExcept(
    UserModule.sendChangeEmailCodeAsync,
    CE_ErrorCode.EmailVerificationCodeRateLimited,
);

export const Route = createFileRoute("/user/$id/_setting-layout/edit")({
    component: UserEditPage,
});
