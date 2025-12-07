import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Field,
    Image,
    Input,
    makeStyles,
    mergeClasses,
    Spinner,
    Text,
    Textarea,
    tokens,
    Tooltip,
} from "@fluentui/react-components";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import React from "react";

import logoDark from "@/assets/icon.dark.png";
import logoLight from "@/assets/icon.light.png";
import { refreshSessionInfoAsyncAction } from "@/common/actions/session-info";
import { ButtonWithRouter } from "@/common/components/ButtonWithRouter";
import { ALLOWED_AVATAR_IMAGE_CONTENT_TYPES } from "@/common/constants/content-type";
import {
    AVATAR_IMAGE_MAX_SIZE,
    AVATAR_IMAGE_MAX_SIZE_MB,
    EMAIL_MAX_LENGTH,
    NICKNAME_MAX_LENGTH,
    USERNAME_MAX_LENGTH,
} from "@/common/constants/data-length";
import { useWithCatchError } from "@/common/hooks/catch-error";
import { useDialogAwaiter } from "@/common/hooks/dialog-awaiter";
import { useFileUploader } from "@/common/hooks/file-upload";
import { useRecaptchaAsync } from "@/common/hooks/recaptcha";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { useDispatchToastError } from "@/common/hooks/toast";
import { flex } from "@/common/styles/flex";
import { diff } from "@/common/utils/diff";
import { format } from "@/common/utils/format";
import { neverGuard } from "@/common/utils/never-guard";
import { Z_EMPTY_STRING } from "@/common/validators/common";
import { Z_EMAIL, Z_USERNAME } from "@/common/validators/user";
import { useErrorCodeToString, useLocalizedStrings } from "@/locales/hooks";
import { getLocale } from "@/locales/selectors";
import { useIsAllowedManageUser } from "@/permission/user/hooks";
import { useSuspenseQueryData } from "@/query/hooks";
import { userDetailQueryKeys } from "@/query/keys";
import { UserModule } from "@/server/api";
import { CE_ErrorCode } from "@/server/common/error-code";
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
    const isAllowedManageWithoutSelf = useIsAllowedManageUser(userDetail, false /* allowedManageSelf */);
    const locale = useAppSelector(getLocale);
    const errorToString = useErrorCodeToString();
    const recaptchaAsync = useRecaptchaAsync();
    const dispatchError = useDispatchToastError();

    const ls = useLocalizedStrings();

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [nickname, setNickname] = React.useState("");
    const [bio, setBio] = React.useState("");
    const [emailVerificationCode, setEmailVerificationCode] = React.useState("");

    const [usernameError, setUsernameError] = React.useState<string>("");
    const [emailError, setEmailError] = React.useState<string>("");
    const [emailVerificationCodeError, setEmailVerificationCodeError] = React.useState<string>("");

    const [pending, setPending] = React.useState(false);
    const [avatarUploading, setAvatarUploading] = React.useState(false);
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

    const { triggerSelect } = useFileUploader({
        contentTypes: ALLOWED_AVATAR_IMAGE_CONTENT_TYPES,
        multiple: false,
        onUploadRequest: async (file) => {
            const res = await postUploadUserAvatarRequestAsync(
                userDetail.id.toString(),
                {
                    size: file.size,
                    contentType: file.type,
                },
                recaptchaAsync,
            );
            return res.data;
        },
        onUploadComplete: async ({ token }) => {
            await postUploadUserAvatarFinishAsync(
                userDetail.id.toString(),
                {
                    token,
                },
                recaptchaAsync,
            );
        },
        onSelect: ([file]) => {
            if (file.size > AVATAR_IMAGE_MAX_SIZE) {
                dispatchError(format(ls.$VALIDATION_ERROR_AVATAR_IMAGE_TOO_LARGE, AVATAR_IMAGE_MAX_SIZE_MB), {
                    customTitle: errorToString(CE_ErrorCode.Client_FileUploadFailed),
                    timeout: 3000,
                });
                return false;
            }
            // TODO: show avatar preview dialog
            setAvatarUploading(true);
            setPending(true);

            return true; // proceed to upload
        },
        onFinish: (_, success) => {
            if (success) {
                queryClient.invalidateQueries({ queryKey: userDetailQueryKeys(userDetail.id.toString()) });
                if (currentUser.id === userDetail.id) {
                    dispatch(refreshSessionInfoAsyncAction());
                }
            }
            setAvatarUploading(false);
            setPending(false);
        },
    });

    React.useEffect(() => {
        resetForm();
    }, [userDetail]); // eslint-disable-line react-hooks/exhaustive-deps

    useSetPageTitle(format(ls.$USER_EDIT_PAGE_TITLE_WITH_NAME, userDetail.username));

    const styles = useStyles();

    const resetForm = () => {
        setUsername(userDetail.username);
        setNickname(userDetail.nickname ?? "");
        setEmail(userDetail.email ?? "");
        setBio(userDetail.bio ?? "");

        setUsernameError("");
        setEmailError("");

        emailVerificationCodeErrorRef.current = false;
    };

    const validate = (): boolean => {
        let valid = true;

        if (!Z_USERNAME.safeParse(username).success) {
            setUsernameError(ls.$VALIDATION_ERROR_USERNAME_INVALID);
            valid = false;
        } else {
            setUsernameError("");
        }

        if (Z_EMAIL.or(Z_EMPTY_STRING).safeParse(email).success) {
            setEmailError("");
        } else {
            setEmailError(ls.$VALIDATION_ERROR_EMAIL_INVALID);
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

            const shouldPatch = diff(
                userDetail,
                {
                    username,
                    nickname,
                    email,
                    bio,
                },
                patchBody,
                ["username", "nickname", "email", "bio"],
            );
            if (shouldPatch) {
                if (patchBody.email && patchBody.email !== authDetail.email && !isAllowedManageWithoutSelf) {
                    // If emailVerificationCodeError is true, it means the user has already submitted the code but invalid.
                    // So we just need to let user input and try again. Don't need to send the code and pop up the dialog again.
                    if (!emailVerificationCodeErrorRef.current) {
                        await postSendChangeEmailCodeAsync(
                            {
                                email: patchBody.email,
                                lang: locale,
                            },
                            recaptchaAsync,
                        );

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
            authDetail.email,
            isAllowedManageWithoutSelf,
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
                        <Field label={ls.$USERNAME_LABEL} hint={ls.$USERNAME_HINT} validationMessage={usernameError}>
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
                    <Tooltip content={ls.$USER_EDIT_PAGE_AVATAR_BUTTON_TOOLTIP} relationship="label" withArrow>
                        <Button
                            className={mergeClasses(styles.$avatar, isMiniScreen && styles.$avatarMiniScreen)}
                            disabled={pending || avatarUploading}
                            onClick={() => triggerSelect()}
                        >
                            {avatarUploading && (
                                <div className={styles.$avatarSpinner}>
                                    <Spinner />
                                </div>
                            )}
                            <Image src={userDetail.avatar || fallBackAvatar} />
                        </Button>
                    </Tooltip>
                </div>
                <Field label={ls.$USER_NICKNAME_LABEL}>
                    <Input
                        disabled={pending}
                        value={nickname}
                        maxLength={NICKNAME_MAX_LENGTH}
                        onChange={(_, { value }) => setNickname(value)}
                    />
                </Field>
                <Field label={ls.$EMAIL_LABEL} hint={ls.$DISPLAY_EMAIL_HINT} validationMessage={emailError}>
                    <Input
                        value={email}
                        type="email"
                        maxLength={EMAIL_MAX_LENGTH}
                        onChange={(_, { value }) => setEmail(value)}
                    />
                </Field>
                <Field label={ls.$USER_BIO_LABEL}>
                    <Textarea
                        className={styles.$bioInput}
                        disabled={pending}
                        value={bio}
                        onChange={(_, { value }) => setBio(value)}
                    />
                </Field>
                <div className={mergeClasses(styles.$buttons, isMiniScreen && styles.$buttonsMiniScreen)}>
                    <div>
                        <Button appearance="primary" disabledFocusable={pending} onClick={onSaveChanges}>
                            {ls.$COMMON_SAVE_BUTTON}
                        </Button>
                        <Button appearance="secondary" disabledFocusable={pending} onClick={resetForm}>
                            {ls.$COMMON_RESET_BUTTON}
                        </Button>
                    </div>
                    <ButtonWithRouter to="/user/$id" params={{ id: String(userDetail.id) }} disabledFocusable={pending}>
                        {ls.$USER_EDIT_PAGE_GO_TO_PROFILE_BUTTON}
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
                        <DialogTitle>{ls.$USER_EDIT_PAGE_EMAIL_VERIFICATION_DIALOG_TITLE}</DialogTitle>
                        <DialogContent>
                            <Text>{ls.$USER_EDIT_PAGE_EMAIL_VERIFICATION_DIALOG_DESCRIPTION}</Text>
                            <form className={styles.$emailVerificationForm}>
                                <Field
                                    label={ls.$VERIFICATION_CODE_LABEL}
                                    validationMessage={emailVerificationCodeError}
                                >
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
                                {ls.$COMMON_SUBMIT_BUTTON}
                            </Button>
                            <DialogTrigger disableButtonEnhancement>
                                <Button appearance="secondary" disabledFocusable={emailVerificationDialogPending}>
                                    {ls.$COMMON_CANCEL_BUTTON}
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
        boxSizing: "border-box",
        position: "relative",
        "> .fui-Image": {
            width: "100%",
            height: "100%",
        },
    },
    $avatarMiniScreen: {
        marginTop: "26px",
        height: "100px",
        width: "100px",
        minWidth: "100px",
    },
    $avatarSpinner: {
        position: "absolute",
        backgroundColor: tokens.colorBackgroundOverlay,
        zIndex: 9998,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        "> .fui-Spinner": {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
        },
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
const postSendChangeEmailCodeAsync = withThrowErrorsExcept(
    UserModule.postSendChangeEmailCodeAsync,
    CE_ErrorCode.EmailVerificationCodeRateLimited,
);
const postUploadUserAvatarRequestAsync = withThrowErrorsExcept(UserModule.postUploadUserAvatarRequestAsync);
const postUploadUserAvatarFinishAsync = withThrowErrorsExcept(UserModule.postUploadUserAvatarFinishAsync);

export const Route = createFileRoute("/user/$id/_setting-layout/edit")({
    component: UserEditPage,
});
