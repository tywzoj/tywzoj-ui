import * as React from "react";

import { CE_ErrorCode } from "@/server/common/error-code";
import type { FileTypes } from "@/server/types";

import { AppError } from "../exceptions/app-error";
import { useWithCatchError } from "./catch-error";

export interface IUseFileUploaderProps {
    onUploadRequest: (file: File) => Promise<FileTypes.ISignedUploadRequest>;
    onUploadComplete: (uploadRequest: FileTypes.ISignedUploadRequest, file: File) => Promise<void>;

    /**
     * Allow multiple file selection.
     * @default false
     */
    multiple?: boolean;
    /**
     * The maximum number of concurrent uploads.
     * @default 3
     */
    maxConcurrency?: number;
    contentTypes?: string[];

    /**
     * Callback when files are selected.
     * @param files Selected files
     * @param triggeredByUser Whether the selection is triggered by user action, not by setSelectedFiles
     * @returns return true to auto call the triggerUpload after selection
     */
    onSelect?: (files: File[], triggeredByUser: boolean) => void | boolean;
    onProgress?: (file: File, progress: number) => void;
    onFinish?: (file: File, success: boolean, error: Error | null) => void;
    onAllFinish?: (succeededFiles: File[], failedFiles: File[]) => void;
}

export interface IUseFileUploaderResult {
    triggerSelect: () => void;
    triggerUpload: () => void;
    setSelectedFiles: (files: File[], skipOnSelect?: boolean) => void;
}

export function useFileUploader(props: IUseFileUploaderProps): IUseFileUploaderResult {
    const {
        onUploadRequest,
        onUploadComplete,

        multiple = false,
        maxConcurrency = 3,
        contentTypes,

        onSelect,
        onProgress,
        onFinish,
        onAllFinish,
    } = props;

    const inputRef = React.useRef<HTMLInputElement>();
    const selectedFilesRef = React.useRef<File[]>([]);
    const succeedFilesRef = React.useRef<File[]>([]);
    const failedFilesRef = React.useRef<File[]>([]);

    const uploadSingleFileAsync = useWithCatchError(
        React.useCallback(
            async (file: File) => {
                try {
                    const uploadRequest = await onUploadRequest(file);

                    await new Promise<void>((resolve, reject) => {
                        const { url, method, extraFormData, fileFieldName } = uploadRequest;
                        const xhr = new XMLHttpRequest();

                        xhr.upload.onprogress = (ev) => {
                            if (ev.lengthComputable) {
                                onProgress?.(file, ev.loaded / ev.total);
                            }
                        };

                        xhr.onload = () => {
                            if (xhr.status >= 200 && xhr.status < 300) resolve();
                            else reject(new Error(`Upload failed: ${xhr.status}`));
                        };

                        xhr.onerror = () => reject(new AppError(CE_ErrorCode.Client_FileUploadFailed));

                        onProgress?.(file, 0);
                        xhr.open(method, url);

                        if (method === "POST") {
                            const formData = new FormData();

                            if (extraFormData) {
                                Object.entries(extraFormData).forEach(([key, value]) => {
                                    formData.append(key, value);
                                });
                            }

                            formData.append(fileFieldName || "file", file);

                            xhr.send(formData);
                        } else if (method === "PUT") {
                            xhr.send(file);
                        } else {
                            reject(new AppError(CE_ErrorCode.Client_InvalidUploadMethod));
                        }
                    });

                    await onUploadComplete(uploadRequest, file);
                    onFinish?.(file, true /* success */, null /* error */);
                    succeedFilesRef.current.push(file);
                } catch (err) {
                    onFinish?.(file, false /* success */, err instanceof Error ? err : new Error(String(err)));
                    failedFilesRef.current.push(file);
                    throw err;
                }
            },
            [onFinish, onProgress, onUploadComplete, onUploadRequest],
        ),
    );

    const uploadWithConcurrencyAsync = React.useCallback(async () => {
        const taskQueue = selectedFilesRef.current;
        let activeTaskCount = 0;
        let currentTaskIndex = 0;

        return new Promise<void>((resolve) => {
            const schedule = () => {
                // All files processed
                if (currentTaskIndex >= taskQueue.length && activeTaskCount === 0) {
                    resolve();
                    return;
                }

                // Limit concurrency
                if (activeTaskCount >= maxConcurrency || currentTaskIndex >= taskQueue.length) {
                    return;
                }

                // Start next upload
                const file = taskQueue[currentTaskIndex++];
                activeTaskCount++;
                uploadSingleFileAsync(file).finally(() => {
                    activeTaskCount--;
                    schedule();
                });

                schedule();
            };

            schedule();
        });
    }, [maxConcurrency, uploadSingleFileAsync]);

    const triggerSelect = useWithCatchError(
        React.useCallback(() => {
            if (!inputRef.current) return;
            selectedFilesRef.current = [];
            inputRef.current.value = "";
            inputRef.current.click();
        }, []),
    );

    const triggerUpload = useWithCatchError(
        React.useCallback(() => {
            if (selectedFilesRef.current.length === 0) return;

            succeedFilesRef.current = [];
            failedFilesRef.current = [];
            uploadWithConcurrencyAsync().finally(() => {
                selectedFilesRef.current = [];
                onAllFinish?.(succeedFilesRef.current, failedFilesRef.current);
            });
        }, [onAllFinish, uploadWithConcurrencyAsync]),
    );

    const setSelectedFiles = React.useCallback(
        (files: File[], skipOnSelect?: boolean) => {
            selectedFilesRef.current = files;
            // Trigger onSelect callback at least one file set
            if (!skipOnSelect && files.length > 0 && onSelect?.(files, false /* triggeredByUser */)) {
                triggerUpload();
            }
        },
        [onSelect, triggerUpload],
    );

    React.useEffect(() => {
        if (!inputRef.current) {
            inputRef.current = document.createElement("input");
            inputRef.current.type = "file";
            inputRef.current.style.display = "none";
            document.body.appendChild(inputRef.current);
        }

        inputRef.current.multiple = multiple;
        inputRef.current.accept = contentTypes?.join(",") || "";
        inputRef.current.onchange = (ev) => {
            const input = ev.target as HTMLInputElement;
            if (!input.files) return;

            const files = Array.from(input.files);
            selectedFilesRef.current = files;
            // Trigger onSelect callback at least one file selected
            if (files.length > 0 && onSelect?.(files, true /* triggeredByUser */)) {
                triggerUpload();
            }
            input.value = "";
        };
    }, [contentTypes, multiple, onSelect, triggerUpload]);

    React.useEffect(() => {
        return () => {
            if (inputRef.current) {
                document.body.removeChild(inputRef.current);
                inputRef.current = undefined;
            }
        };
    }, []);

    return { triggerSelect, triggerUpload, setSelectedFiles };
}
