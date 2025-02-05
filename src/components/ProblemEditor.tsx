import type { PositioningImperativeRef } from "@fluentui/react-components";
import {
    Body1Strong,
    Button,
    Field,
    Input,
    makeStyles,
    mergeClasses,
    MessageBar,
    MessageBarBody,
    MessageBarTitle,
    Spinner,
    Subtitle2,
    Tab,
    TabList,
    Textarea,
    Title3,
    tokens,
    Tooltip,
    useId,
} from "@fluentui/react-components";
import { Add16Filled, ArrowDownFilled, ArrowUpFilled, DeleteFilled } from "@fluentui/react-icons";
import { useRouter } from "@tanstack/react-router";
import React from "react";

import { ConfirmationPopover } from "@/common/components/ConfirmationPopover";
import { PROBLEM_TITLE_MAX_LENGTH } from "@/common/constants/data-length";
import { CODE_FONT_FAMILY } from "@/common/constants/font";
import { flex } from "@/common/styles/flex";
import { format } from "@/common/utils/format";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { CE_Visibility } from "@/server/common/permission";
import { CE_ProblemType } from "@/server/modules/problem.enums";
import type {
    IProblemContentDetail,
    IProblemContentDetailEditable,
    IProblemDetail,
    IProblemDetailEditable,
    IProblemSampleDetail,
    IProblemSampleDetailEditable,
} from "@/server/modules/problem.types";
import { useIsMiniScreen, useIsSmallScreen } from "@/store/hooks";

import { ProblemContent } from "./ProblemContent";
import { VisibilityLabel } from "./VisibilityLabel";
import { VisibilitySelector } from "./VisibilitySelector";

export interface IProblemEditorProps {
    className?: string;
    problem?: IProblemDetail;
    disabled?: boolean;
    submitting?: boolean;
    error?: string;
    onSaveChanges: (data: IProblemEditorChangedData) => void;
    /**
     * Callback when the editor go back button is clicked and before the editor go back
     * @returns Whether the editor can go back, if true the editor will go back, else the editor will stay
     */
    onBeforeGoBack?: () => boolean;
}

export interface IProblemEditorChangedData {
    problem: IProblemDetailEditable;
    content: IProblemContentDetailEditable;
    samples: IProblemSampleDetailEditable[];
    tagIds: number[];
}

// Use id as React element key when render sample list
type IProblemSampleDetailEditableWithId = IProblemSampleDetailEditable & { id: number };

export const ProblemEditor: React.FC<IProblemEditorProps> = (props) => {
    const { className, problem, disabled, submitting, error, onSaveChanges, onBeforeGoBack = () => true } = props;

    const isMiniScreen = useIsMiniScreen();
    const router = useRouter();

    const ls = useLocalizedStrings({
        editTab: CE_Strings.COMMON_EDIT_BUTTON,
        previewTab: CE_Strings.COMMON_PREVIEW_BUTTON,
        displayId: CE_Strings.ID_LABEL,
        pTitle: CE_Strings.TITLE_LABEL,
        visibility: CE_Strings.VISIBILITY_LABEL,
        description: CE_Strings.DESCRIPTION_LABEL,
        inputFormat: CE_Strings.PROBLEM_INPUT_FORMAT_LABEL,
        outputFormat: CE_Strings.PROBLEM_OUTPUT_FORMAT_LABEL,
        limitAndHint: CE_Strings.PROBLEM_LIMIT_AND_HINT_LABEL,
        saveBtn: CE_Strings.COMMON_SAVE_BUTTON,
        goBackBtn: CE_Strings.COMMON_BACK_BUTTON,
        errorTitle: CE_Strings.COMMON_ERROR_TITLE,
        idEmpty: CE_Strings.VALIDATION_ERROR_ID_EMPTY,
        titleEmpty: CE_Strings.VALIDATION_ERROR_TITLE_EMPTY,
        titleTooLong: CE_Strings.VALIDATION_ERROR_PROBLEM_TITLE_TOO_LONG,
    });

    const [preview, setPreview] = React.useState(false);
    const [previewData, setPreviewData] = React.useState<{
        content: IProblemContentDetail;
        samples: IProblemSampleDetail[];
    }>({
        content: problem?.content || {
            description: "",
            inputFormat: "",
            outputFormat: "",
            limitAndHint: "",
        },
        samples: problem?.samples || [],
    });

    const [visibility, setVisibility] = React.useState(problem?.visibility || CE_Visibility.Private);
    const [displayId, setDisplayId] = React.useState<number>(0);
    const [title, setTitle] = React.useState(problem?.title || "");
    const [description, setDescription] = React.useState(problem?.content?.description || "");
    const [inputFormat, setInputFormat] = React.useState(problem?.content?.inputFormat || "");
    const [outputFormat, setOutputFormat] = React.useState(problem?.content?.outputFormat || "");
    const [limitAndHint, setLimitAndHint] = React.useState(problem?.content?.limitAndHint || "");
    const [samples, setSamples] = React.useState<IProblemSampleDetailEditableWithId[]>(problem?.samples || []);

    const [displayIdErr, setDisplayIdErr] = React.useState("");
    const [titleErr, setTitleErr] = React.useState("");

    const styles = useStyles();

    const validate = (): boolean => {
        let success = true;

        if (!displayId) {
            setDisplayIdErr(ls.idEmpty);
            success = false;
        }

        if (!title) {
            setTitleErr(ls.titleEmpty);
            success = false;
        }

        if (title.length > PROBLEM_TITLE_MAX_LENGTH) {
            setTitleErr(ls.titleTooLong);
            success = false;
        }

        return success;
    };

    const onSaveButtonClick = () => {
        if (!validate()) {
            return;
        }

        onSaveChanges({
            problem: {
                displayId,
                title,
                type: problem?.type ?? CE_ProblemType.Traditional,
                visibility,
            },
            content: {
                description,
                inputFormat,
                outputFormat,
                limitAndHint,
            },
            // Filter the temp id for patch or post
            samples: samples.map((sample) => ({
                input: sample.input,
                output: sample.output,
                explanation: sample.explanation,
            })),
            // TODO: Implement tag
            tagIds: [],
        });
    };

    return (
        <div className={mergeClasses(styles.root, className)}>
            <div className={styles.tabList}>
                <TabList
                    appearance="subtle-circular"
                    selectedValue={preview ? "preview" : "edit"}
                    onTabSelect={(_, { value }) => {
                        const isPreview = value === "preview";
                        if (isPreview) {
                            setPreviewData({
                                content: {
                                    description,
                                    inputFormat,
                                    outputFormat,
                                    limitAndHint,
                                },
                                samples: samples.map((sample) => ({
                                    ...sample,
                                    problemId: problem?.id || 0,
                                })),
                            });
                        }
                        setPreview(isPreview);
                    }}
                >
                    <Tab value="edit">{ls.editTab}</Tab>
                    <Tab value="preview">{ls.previewTab}</Tab>
                </TabList>
            </div>
            <div className={mergeClasses(styles.editor, preview && styles.hidden)}>
                <Field label={ls.displayId} className={styles.topField} validationMessage={displayIdErr}>
                    <Input
                        // 0 will be empty string
                        value={displayId ? displayId.toString() : ""}
                        onChange={(_, { value }) => {
                            if (!value) {
                                setDisplayId(0);
                                return;
                            }

                            const newValue = Number.parseInt(value, 10);
                            if (Number.isInteger(newValue) && newValue > 0) {
                                setDisplayId(newValue);
                            }
                        }}
                        disabled={disabled}
                    />
                </Field>

                <Field label={ls.pTitle} className={styles.topField} validationMessage={titleErr}>
                    <Input value={title} onChange={(_, { value }) => setTitle(value)} disabled={disabled} />
                </Field>

                <Field label={ls.visibility} className={styles.topField}>
                    <VisibilitySelector
                        layout={isMiniScreen ? "horizontal-stacked" : "horizontal"}
                        visibility={visibility}
                        onChange={(visibility) => setVisibility(visibility)}
                        disabled={disabled}
                    />
                </Field>

                <Field label={ls.description} className={styles.topField}>
                    <Textarea
                        className={styles.inputLarge}
                        value={description}
                        onChange={(_, { value }) => setDescription(value)}
                        disabled={disabled}
                    />
                </Field>

                <Field label={ls.inputFormat} className={styles.topField}>
                    <Textarea
                        className={styles.inputMiddle}
                        value={inputFormat}
                        onChange={(_, { value }) => setInputFormat(value)}
                        disabled={disabled}
                    />
                </Field>

                <Field label={ls.outputFormat} className={styles.topField}>
                    <Textarea
                        className={styles.inputMiddle}
                        value={outputFormat}
                        onChange={(_, { value }) => setOutputFormat(value)}
                        disabled={disabled}
                    />
                </Field>

                <ProblemSampleListEditor
                    samples={samples}
                    onChange={(samples) => setSamples(samples)}
                    disabled={disabled}
                />

                <Field label={ls.limitAndHint} className={styles.topField}>
                    <Textarea
                        className={styles.inputMiddle}
                        value={limitAndHint}
                        onChange={(_, { value }) => setLimitAndHint(value)}
                        disabled={disabled}
                    />
                </Field>
                {error && (
                    <MessageBar intent="error">
                        <MessageBarBody>
                            <MessageBarTitle>{ls.errorTitle}</MessageBarTitle>
                            {error}
                        </MessageBarBody>
                    </MessageBar>
                )}
                <div className={styles.editorFooter}>
                    <Button
                        appearance="primary"
                        onClick={onSaveButtonClick}
                        disabledFocusable={disabled}
                        icon={submitting ? <Spinner size="tiny" /> : null}
                    >
                        {ls.saveBtn}
                    </Button>
                    <Button
                        disabledFocusable={disabled}
                        onClick={() => {
                            if (onBeforeGoBack()) {
                                if (router.history.canGoBack()) {
                                    router.history.back();
                                } else {
                                    router.navigate({ to: "/problem" });
                                }
                            }
                        }}
                    >
                        {ls.goBackBtn}
                    </Button>
                </div>
            </div>
            <div className={mergeClasses(styles.preview, !preview && styles.hidden)}>
                {title && (
                    <div className={styles.previewHeader}>
                        <Title3 as="h1">
                            #{displayId}. {title}
                        </Title3>
                        <VisibilityLabel visibility={visibility} />
                    </div>
                )}
                <ProblemContent content={previewData.content} samples={previewData.samples} />
            </div>
        </div>
    );
};

const ProblemSampleListEditor: React.FC<{
    samples: IProblemSampleDetailEditableWithId[];
    disabled?: boolean;
    onChange: (samples: IProblemSampleDetailEditableWithId[]) => void;
}> = ({ samples, disabled, onChange }) => {
    const styles = useStyles();

    const titleId = useId("sample-list-title");
    const ls = useLocalizedStrings({
        samples: CE_Strings.PROBLEM_SAMPLES_LABEL,
        addSample: CE_Strings.PROBLEM_SAMPLE_ADD_BUTTON,
        delConfirm: CE_Strings.PROBLEM_SAMPLE_DELETE_CONFIRM,
    });

    const positioningRef = React.useRef<PositioningImperativeRef>(null);
    const indexWillBeDeleted = React.useRef<number>(-1);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
    const onDeleteItemConfirmed = () => {
        if (indexWillBeDeleted.current === -1) return;
        const newSamples = [...samples];
        newSamples.splice(indexWillBeDeleted.current, 1);
        indexWillBeDeleted.current = -1;
        setShowDeleteConfirmation(false);
        onChange(newSamples);
    };

    const hasSample = samples.length > 0;

    const addButton = (
        <Button
            onClick={() => {
                const newSamples = [...samples];
                newSamples.push({
                    id: Date.now(),
                    input: "",
                    output: "",
                    explanation: "",
                });
                onChange(newSamples);
            }}
            disabled={disabled}
            size="small"
            icon={<Add16Filled />}
        >
            {ls.addSample}
        </Button>
    );

    return (
        <div className={styles.sampleList}>
            <div className={styles.sampleListHeader}>
                <Subtitle2 as="span" id={titleId}>
                    {ls.samples}
                </Subtitle2>
                {!hasSample && addButton}
            </div>
            {samples.length > 0 && (
                <div className={styles.sampleListItems} role="list" aria-describedby={titleId}>
                    {samples.map((sample, index) => (
                        <ProblemSampleItemEditor
                            key={sample.id}
                            index={index}
                            total={samples.length}
                            sample={sample}
                            onChange={(newSample) => {
                                const newSamples = [...samples];
                                newSamples[index] = newSample;
                                onChange(newSamples);
                            }}
                            onDelete={(target) => {
                                indexWillBeDeleted.current = index;
                                positioningRef.current?.setTarget(target);
                                setShowDeleteConfirmation(true);
                            }}
                            onMoveUp={() => {
                                if (index === 0) return;
                                const newSamples = [...samples];
                                newSamples[index] = samples[index - 1];
                                newSamples[index - 1] = samples[index];
                                onChange(newSamples);
                            }}
                            onMoveDown={() => {
                                if (index === samples.length - 1) return;
                                const newSamples = [...samples];
                                newSamples[index] = samples[index + 1];
                                newSamples[index + 1] = samples[index];
                                onChange(newSamples);
                            }}
                            disabled={disabled}
                        />
                    ))}
                </div>
            )}
            <div className={styles.sampleListFooter}>{hasSample && addButton}</div>
            <ConfirmationPopover
                message={ls.delConfirm}
                open={showDeleteConfirmation}
                onConfirmed={onDeleteItemConfirmed}
                onCanceled={() => {
                    indexWillBeDeleted.current = -1;
                    setShowDeleteConfirmation(false);
                }}
                positioningRef={positioningRef}
            />
        </div>
    );
};

const ProblemSampleItemEditor: React.FC<{
    index: number;
    total: number;
    sample: IProblemSampleDetailEditableWithId;
    disabled?: boolean;
    onChange: (sample: IProblemSampleDetailEditableWithId) => void;
    onDelete: (target: HTMLButtonElement) => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}> = ({ index, total, sample, disabled, onChange, onDelete, onMoveUp, onMoveDown }) => {
    const isSmallScreen = useIsSmallScreen();

    const ls = useLocalizedStrings({
        moveUp: CE_Strings.COMMON_MOVE_UP_BUTTON,
        moveDown: CE_Strings.COMMON_MOVE_DOWN_BUTTON,
        delete: CE_Strings.COMMON_DELETE_BUTTON,
        sample: CE_Strings.PROBLEM_SAMPLE_ITEM_LABEL,
        input: CE_Strings.PROBLEM_SAMPLE_INPUT_LABEL,
        output: CE_Strings.PROBLEM_SAMPLE_OUTPUT_LABEL,
        explanation: CE_Strings.PROBLEM_SAMPLE_EXPLANATION_LABEL,
    });

    const styles = useStyles();

    return (
        <div role="listitem" className={styles.sampleItem}>
            <div className={styles.sampleItemHeader}>
                <Body1Strong as="span">{format(ls.sample, index + 1)}</Body1Strong>
                <div>
                    <Tooltip content={ls.delete} relationship="label">
                        <Button
                            appearance="subtle"
                            disabled={disabled}
                            onClick={(e) => {
                                onDelete(e.currentTarget);
                            }}
                            icon={<DeleteFilled />}
                            size="small"
                        />
                    </Tooltip>

                    <Tooltip content={ls.moveUp} relationship="label">
                        <Button
                            appearance="subtle"
                            onClick={onMoveUp}
                            disabled={disabled || index === 0}
                            icon={<ArrowUpFilled />}
                            size="small"
                        />
                    </Tooltip>

                    <Tooltip content={ls.moveDown} relationship="label">
                        <Button
                            appearance="subtle"
                            onClick={onMoveDown}
                            disabled={disabled || index === total - 1}
                            icon={<ArrowDownFilled />}
                            size="small"
                        />
                    </Tooltip>
                </div>
            </div>
            <div className={mergeClasses(styles.sampleItemIO, isSmallScreen && styles.sampleItemIOSingleLine)}>
                <Field label={ls.input} className={styles.sampleItemIOField}>
                    <Textarea
                        className={styles.inputSmall}
                        value={sample.input}
                        onChange={(_, { value }) => {
                            onChange({
                                ...sample,
                                input: value,
                            });
                        }}
                        disabled={disabled}
                    />
                </Field>
                <Field label={ls.output} className={styles.sampleItemIOField}>
                    <Textarea
                        className={styles.inputSmall}
                        value={sample.output}
                        onChange={(_, { value }) => {
                            onChange({
                                ...sample,
                                output: value,
                            });
                        }}
                        disabled={disabled}
                    />
                </Field>
            </div>
            <Field label={ls.explanation}>
                <Textarea
                    className={styles.inputSmall}
                    value={sample.explanation}
                    onChange={(_, { value }) => {
                        onChange({
                            ...sample,
                            explanation: value,
                        });
                    }}
                    disabled={disabled}
                />
            </Field>
        </div>
    );
};

const useStyles = makeStyles({
    root: {
        ...flex({
            flexDirection: "column",
        }),
        width: "100%",
        gap: "20px",
    },
    tabList: {},
    editor: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "14px",
        width: "100%",
    },
    editorFooter: {
        ...flex({
            justifyContent: "flex-end",
        }),
        gap: "14px",
    },
    preview: {},
    previewHeader: {
        ...flex({
            alignItems: "center",
            flexWrap: "wrap",
        }),
        width: "100%",
        gap: "14px",
        ">h1": {
            margin: "unset",
            textAlign: "center",
        },
        marginBottom: "14px",
    },
    hidden: { display: "none" },
    inputLarge: { height: "280px" },
    inputMiddle: { height: "180px" },
    inputSmall: { height: "120px" },
    topField: {
        "> .fui-Field__label": {
            lineHeight: tokens.lineHeightBase300,
            fontWeight: tokens.fontWeightSemibold,
            fontSize: tokens.fontSizeBase300,
        },
    },

    sampleList: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "14px",
    },
    sampleListHeader: {
        ...flex({
            flexDirection: "row",
            justifyContent: "space-between",
        }),
    },
    sampleListItems: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "14px",
    },
    sampleListFooter: {
        ...flex({
            justifyContent: "flex-end",
        }),
    },
    sampleItem: {
        ...flex({
            flexDirection: "column",
        }),
    },
    sampleItemHeader: {
        ...flex({
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
        }),
    },
    sampleItemIO: {
        ...flex(),
        width: "100%",
        gap: "14px",
    },
    sampleItemIOField: {
        flexGrow: 1,
        "& .fui-Textarea__textarea": {
            fontFamily: CODE_FONT_FAMILY,
        },
    },
    sampleItemIOSingleLine: {
        ...flex({
            flexDirection: "column",
        }),
    },
});
