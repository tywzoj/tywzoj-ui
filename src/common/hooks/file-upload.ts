import * as React from "react";

import type { FileTypes } from "@/server/types";

export interface IUseFileUploaderProps {
    onUploadRequest: (file: File) => Promise<FileTypes.ISignedUploadRequest>;
    onUploadComplete: (token: string) => Promise<void>;

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

    onSelect?: (files: File[]) => void;
    onProgress?: (file: File, progress: number) => void;
    onFinish?: (file: File, success: boolean, err?: Error) => void;
}

export interface IUseFileUploaderResult {
    triggerSelect: () => void;
    triggerUpload: () => void;
}

export function useFileUploader(props: IUseFileUploaderProps): IUseFileUploaderResult {
    const {
        onUploadRequest,
        onUploadComplete,

        multiple = true,
        maxConcurrency = 3,
        contentTypes,

        onSelect,
        onProgress,
        onFinish,
    } = props;

    const inputRef = React.useRef<HTMLInputElement>();
    const selectedFilesRef = React.useRef<File[]>([]);

    const uploadSingleFileAsync = React.useCallback(
        async (file: File) => {
            try {
                const { token, url, method, extraFormData, fileFieldName } = await onUploadRequest(file);

                await new Promise<void>((resolve, reject) => {
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

                    xhr.onerror = (ev) => reject(new Error(`Upload error: ${ev}`));

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
                        reject(new Error(`Unsupported upload method: ${method}`));
                    }
                });

                await onUploadComplete(token);
                onFinish?.(file, true);
            } catch (err) {
                onFinish?.(file, false, err instanceof Error ? err : new Error(String(err)));
            }
        },
        [onFinish, onProgress, onUploadComplete, onUploadRequest],
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
                    selectedFilesRef.current = [];
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

    const triggerSelect = React.useCallback(() => {
        if (!inputRef.current) return;
        inputRef.current.value = "";
        inputRef.current.click();
    }, []);

    const triggerUpload = React.useCallback(() => {
        if (selectedFilesRef.current.length === 0) return;

        selectedFilesRef.current = [];
        uploadWithConcurrencyAsync();
    }, [uploadWithConcurrencyAsync]);

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
            onSelect?.(files);
            input.value = "";
        };
    }, [contentTypes, multiple, onSelect, uploadWithConcurrencyAsync]);

    React.useEffect(() => {
        return () => {
            if (inputRef.current) {
                document.body.removeChild(inputRef.current);
                inputRef.current = undefined;
            }
        };
    }, []);

    return { triggerSelect, triggerUpload };
}
