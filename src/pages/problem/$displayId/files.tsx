import {
    Button,
    Field,
    makeStyles,
    mergeClasses,
    ProgressBar,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    TableSelectionCell,
} from "@fluentui/react-components";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import { SignInRequiredError } from "@/common/exceptions/sign-in-required";
import { useFileUploader } from "@/common/hooks/file-upload";
import { useRecaptchaAsync } from "@/common/hooks/recaptcha";
import { flex } from "@/common/styles/flex";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { usePermission } from "@/permission/common/hooks";
import { checkIsAllowedEditProblem } from "@/permission/problem/checker";
import { useSuspenseQueryData } from "@/query/hooks";
import { CE_QueryId } from "@/query/id";
import { createQueryOptionsFn } from "@/query/utils";
import { ProblemModule } from "@/server/api";
import { CE_ProblemFileType } from "@/server/modules/problem.enums";
import type { IProblemFileDetail } from "@/server/modules/problem.types";
import type { ProblemTypes } from "@/server/types";
import { withThrowErrors } from "@/server/utils";
import { useIsSmallScreen } from "@/store/hooks";

const ProblemFilePage: React.FC = () => {
    const { problemDetailQueryOption, problemFileListQueryOption } = Route.useLoaderData();
    const { data: problemDetail } = useSuspenseQueryData(problemDetailQueryOption);
    const {
        data: { fileDetails: problemFileDetails },
    } = useSuspenseQueryData(problemFileListQueryOption);
    const permission = usePermission();
    const isAllowedManage = checkIsAllowedEditProblem(permission);
    const isSmallScreen = useIsSmallScreen();

    const testdataFiles = React.useMemo(
        () => problemFileDetails.filter((file) => file.type === CE_ProblemFileType.Testdata),
        [problemFileDetails],
    );

    const additionalFiles = React.useMemo(
        () => problemFileDetails.filter((file) => file.type === CE_ProblemFileType.Additional),
        [problemFileDetails],
    );

    const styles = useStyles();

    return (
        <div className={styles.$root}>
            <div>
                <h1>Files for Problem: {problemDetail.title}</h1>
            </div>

            <div
                className={mergeClasses(
                    styles.$fileListContainer,
                    isSmallScreen && styles.$fileListContainerSmallScreen,
                )}
            >
                {isAllowedManage && (
                    <ProblemFileList
                        title="Testdata Files"
                        files={testdataFiles}
                        type={CE_ProblemFileType.Testdata}
                        problemDetail={problemDetail}
                        isAllowedManage={true}
                    />
                )}
                <ProblemFileList
                    title="Additional Files"
                    files={additionalFiles}
                    type={CE_ProblemFileType.Additional}
                    problemDetail={problemDetail}
                    isAllowedManage={isAllowedManage}
                />
            </div>
        </div>
    );
};

interface IUploadingFile {
    filename: string;
    progress: number;
    state: "selected" | "pending" | "uploading" | "completed" | "error";
}

const ProblemFileList: React.FC<{
    title: string;
    files: IProblemFileDetail[];
    type: CE_ProblemFileType;
    problemDetail: ProblemTypes.IProblemBasicDetail;
    isAllowedManage: boolean;
}> = (props) => {
    const { title, files, problemDetail, type, isAllowedManage } = props;

    const recaptchaAsync = useRecaptchaAsync();

    const [uploadingFiles, setUploadingFiles] = React.useState<IUploadingFile[]>([]);
    const [uploading, setUploading] = React.useState<boolean>(false);

    const { triggerSelect, triggerUpload } = useFileUploader({
        multiple: true,
        onUploadRequest: async (file) => {
            const { data } = await postProblemFileUploadRequestAsync(
                problemDetail.id.toString(),
                {
                    filename: file.name,
                    size: file.size,
                    type,
                },
                recaptchaAsync,
            );

            return data;
        },
        onUploadComplete: async ({ token }) => {
            await postProblemFileUploadFinishAsync(problemDetail.id.toString(), { token }, recaptchaAsync);
        },
        onSelect: (files) => {
            setUploadingFiles(files.map((file) => ({ filename: file.name, progress: 0, state: "selected" })));
        },
        onProgress: (file, progress) => {
            setUploadingFiles((prev) => {
                return prev.map((f) => (f.filename === file.name ? { ...f, progress, state: "uploading" } : f));
            });
        },
        onFinish(file, success) {
            setUploadingFiles((prev) => {
                return prev.map((f) =>
                    f.filename === file.name ? { ...f, progress: 100, state: success ? "completed" : "error" } : f,
                );
            });
        },
        onAllFinish() {
            setUploading(false);
        },
    });

    const onUploadClick = () => {
        setUploading(true);
        setUploadingFiles((prev) =>
            prev.map((f) => (f.state === "selected" ? { ...f, state: "pending", progress: 0 } : f)),
        );
        triggerUpload();
    };

    const styles = useStyles();

    return (
        <div className={styles.$fileList}>
            <h2>{title}</h2>
            <div>
                <ProblemFileTable
                    files={files}
                    uploadingFiles={uploadingFiles}
                    uploading={uploading}
                    isAllowedManage={isAllowedManage}
                />
            </div>
            {isAllowedManage && (
                <div>
                    <Button onClick={() => triggerSelect()}>Select Files</Button>
                    {uploadingFiles.length > 0 && (
                        <Button appearance="primary" onClick={onUploadClick}>
                            Upload Selected Files
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

const ProblemFileTable: React.FC<{
    files: IProblemFileDetail[];
    uploadingFiles: IUploadingFile[];
    uploading: boolean;
    isAllowedManage: boolean;
    onRenameFile?: (file: IProblemFileDetail, newFilename: string) => void;
    onDeleteFiles?: (files: IProblemFileDetail[], selectedAll: boolean) => void;
}> = (props) => {
    const { files, uploadingFiles } = props;

    const [selectedItemIds, setSelectedItemIds] = React.useState<string[]>([]);
    const allRowsSelected = selectedItemIds.length === files.length;
    const someRowsSelected = selectedItemIds.length > 0 && !allRowsSelected;

    const fileTableRows = React.useMemo(
        () =>
            files
                .filter((file) => !uploadingFiles.some((uploadingFile) => uploadingFile.filename === file.filename))
                .map((file) => {
                    return (
                        <TableRow key={file.uuid}>
                            <TableSelectionCell
                                checked={selectedItemIds.includes(file.uuid)}
                                onClick={() => {
                                    setSelectedItemIds((prev) => {
                                        if (prev.includes(file.uuid)) {
                                            return prev.filter((id) => id !== file.uuid);
                                        } else {
                                            return [...prev, file.uuid];
                                        }
                                    });
                                }}
                            />
                            <TableCell>{file.filename}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    );
                }),
        [files, selectedItemIds, uploadingFiles],
    );

    const uploadingFileTableRows = React.useMemo(
        () =>
            uploadingFiles.map((file) => {
                const validationState =
                    file.state === "error" ? "error" : file.state === "completed" ? "success" : undefined;

                return (
                    <TableRow key={file.filename}>
                        <TableCell />
                        <TableCell>{file.filename}</TableCell>
                        <TableCell>
                            {file.state === "selected" ? (
                                "Waiting to upload"
                            ) : (
                                <Field
                                    validationMessage={
                                        file.state === "error"
                                            ? "Upload failed"
                                            : file.state === "completed"
                                              ? "Upload completed"
                                              : file.state === "pending"
                                                ? "Waiting to upload"
                                                : file.state === "uploading"
                                                  ? `Uploading... ${(file.progress * 100).toFixed(2)}%`
                                                  : undefined
                                    }
                                    validationState={validationState || "none"}
                                >
                                    <ProgressBar
                                        value={file.state === "pending" ? undefined : file.progress}
                                        color={validationState}
                                    />
                                </Field>
                            )}
                        </TableCell>
                    </TableRow>
                );
            }),
        [uploadingFiles],
    );

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableSelectionCell
                        checked={allRowsSelected ? true : someRowsSelected ? "mixed" : false}
                        onClick={() => {
                            if (allRowsSelected) {
                                setSelectedItemIds([]);
                            } else {
                                setSelectedItemIds(files.map((file) => file.uuid));
                            }
                        }}
                    />
                    <TableHeaderCell>Filename</TableHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {fileTableRows}
                {uploadingFileTableRows}
            </TableBody>
        </Table>
    );
};

const useStyles = makeStyles({
    $root: {
        ...flex({
            flexDirection: "column",
        }),
        width: "100%",
    },
    $fileListContainer: {
        ...flex({
            flexDirection: "row",
            justifyContent: "space-between",
        }),
        gap: "16px",
    },
    $fileListContainerSmallScreen: {
        ...flex({
            flexDirection: "column",
        }),
    },
    $fileList: {
        flexGrow: 1,
    },
});

const problemDetailQueryOptionsFn = createQueryOptionsFn(
    CE_QueryId.ProblemDetail,
    withThrowErrors(ProblemModule.getProblemDetailAsync),
);

const problemFileListQueryOptionsFn = createQueryOptionsFn(
    CE_QueryId.ProblemFile,
    withThrowErrors(ProblemModule.getProblemFileListAsync),
);

const postProblemFileUploadRequestAsync = withThrowErrors(ProblemModule.postProblemFileUploadRequestAsync);
const postProblemFileUploadFinishAsync = withThrowErrors(ProblemModule.postProblemFileUploadFinishAsync);

export const Route = createFileRoute("/problem/$displayId/files")({
    component: ProblemFilePage,
    errorComponent: ErrorPageLazy,
    beforeLoad: ({ context: { currentUser } }) => {
        if (!currentUser) {
            throw new SignInRequiredError();
        }
    },
    loader: async ({ context: { queryClient }, params: { displayId } }) => {
        const problemDetailQueryOption = problemDetailQueryOptionsFn(displayId, {
            queryTags: false,
        });

        const problemFileListQueryOption = problemFileListQueryOptionsFn(displayId);

        await Promise.all([
            queryClient.ensureQueryData(problemDetailQueryOption),
            queryClient.ensureQueryData(problemFileListQueryOption),
        ]);

        return { problemDetailQueryOption, problemFileListQueryOption };
    },
});
