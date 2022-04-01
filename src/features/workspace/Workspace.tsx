import React, { DragEvent, useCallback, useEffect, useRef } from "react";
import { Stage, Layer, Image, Rect, Text, Transformer } from "react-konva";
import ReactQuill from "react-quill";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { AppDispatch } from "../../app/store";
import { onDrop, onClickTap, onEditText, onMouseDown, onMouseMove, onMouseUp, ImageState, TextState, onIsUpdateShape } from "../sources/sourceSlice";
import { Stage as StageType } from "konva/lib/Stage";
import { Rect as RectType } from "konva/lib/shapes/Rect";
import { Layer as LayerType } from "konva/lib/Layer";
import { Image as ImageType } from "konva/lib/shapes/Image";
import { Text as TextType } from "konva/lib/shapes/Text";
import { KonvaEventObject } from "konva/lib/Node";
import { Transformer as TransformerType } from "konva/lib/shapes/Transformer";
import Konva from "konva";
import useImage from "use-image";
import { onStoreStage } from "./workspaceSlice";
import TopBar from "./TopBar";
import * as CONST from "../../consts";
import "./Workspace.scss";

const URLImage = ({
    image,
    transformerRef,
    imageColor,
    dispatch,
}: {
    image: { src: string; x: number; y: number };
    imageColor: {
        red: number;
        green: number;
        blue: number;
    };
    transformerRef: TransformerType;
    dispatch: AppDispatch;
}) => {
    const [img] = useImage(image.src, "anonymous");
    const imageRef = useRef<ImageType>(null);

    useEffect(() => {
        if (img) {
            const imageNodes = transformerRef.nodes().concat([imageRef.current!]);
            transformerRef.nodes(imageNodes);

            // Matsu: Save Image Source to ImageRef in order to export as JSON Format Canvas Node
            imageRef.current?.setAttr("source", img?.src);
            imageRef.current?.setAttr("red", imageRef.current.red);
            imageRef.current?.setAttr("green", imageRef.current.green);
            imageRef.current?.setAttr("blue", imageRef.current.blue);
        }
    }, [img]);

    const onStartUpdateShape = () => {
        dispatch(
            onIsUpdateShape({
                isUpdating: true,
                imageRef: imageRef,
            })
        );
    };

    return (
        <Image
            draggable
            ref={imageRef}
            name="image"
            image={img}
            x={image.x}
            y={image.y}
            filters={[Konva.Filters.RGB]}
            offsetX={img ? img.width / 2 : 0}
            offsetY={img ? img.height / 2 : 0}
            onDragMove={(e) => e.evt.preventDefault()}
            onDragEnd={(e) => e.evt.preventDefault()}
            onClick={onStartUpdateShape}
        />
    );
};

const EditableKonvaText = ({
    textIdx,
    text,
    stageRef,
    themeBackgroundColor,
    transformerRef,
    quillRef,
    dispatch,
}: {
    dispatch: AppDispatch;
    text: { id: number; content: string; x: number; y: number; size: number };
    textIdx: number;
    themeBackgroundColor: string;
    stageRef: StageType;
    quillRef: { current: ReactQuill };
    transformerRef: TransformerType;
}) => {
    const konvaTextRef = useRef<TextType>(null);

    const onEdit = () => {
        dispatch(onEditText({ isEditing: true, textIdx: textIdx }));
        // Hide Konva Text
        konvaTextRef.current?.visible(false);
        // Get Konva Text Position and Stage Container Position
        const textPosition = konvaTextRef.current!.getAbsolutePosition();
        const stageBox = stageRef.container().getBoundingClientRect();
        const editableAreaPosition = {
            x: stageBox.left + textPosition?.x,
            y: stageBox.top + textPosition?.y,
        };

        // Connect ReactQuill Editor
        const quillEditor = quillRef.current.getEditor();
        quillRef.current.hookEditor(quillEditor);

        // unpriviledgedEditor.

        // Place Editor Area based on Konva Text
        quillEditor.root.id = "quill-editor";
        quillEditor.root.style.position = "absolute";
        quillEditor.root.style.top = `${editableAreaPosition.y}px`;
        quillEditor.root.style.left = `${editableAreaPosition.x}px`;
        quillEditor.root.style.width = `${(konvaTextRef.current!.width() * 2).toString()}px`;
        quillEditor.root.style.height = `${(konvaTextRef.current!.height() * 2).toString()}px`;
        quillEditor.root.style.maxWidth = "500px";
        quillEditor.root.style.minHeight = "100px";
        quillEditor.root.style.maxHeight = "500px";
        quillEditor.root.style.fontSize = konvaTextRef.current!.height().toString();
        quillEditor.root.style.fontStyle = konvaTextRef.current!.getAttr("fontStyle");
        quillEditor.root.style.resize = "none";
        quillEditor.root.style.zIndex = "100";
        quillEditor.root.style.border = `3px double ${themeBackgroundColor}`;
        quillEditor.root.style.background = "transparent";
        document.body.appendChild(quillEditor.root);

        quillEditor.root.focus();

        quillEditor.setText(konvaTextRef.current!.text());
        quillEditor.root.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.code === "Enter") {
                dispatch(onEditText({ textIdx: text.id, isEditing: false, text: quillEditor.getText() }));

                const editedStyles = quillEditor.getFormat();

                konvaTextRef.current!.visible(true);
                // konvaTextRef.current!.fill(editedStyles.color ? editedStyles.color : "#000");
                konvaTextRef.current?.setAttr("fill", editedStyles.color ? editedStyles.color : "#000");

                if (editedStyles.bold && editedStyles.italic) {
                    konvaTextRef.current!.fontStyle("italic bold");
                } else if (editedStyles.bold) {
                    konvaTextRef.current!.fontStyle("bold");
                } else if (editedStyles.italic) {
                    konvaTextRef.current!.fontStyle("italic");
                } else {
                    konvaTextRef.current!.fontStyle("normal");
                }

                // Disconnect ReactQuill Editor and Remove from DOM
                // quillRef.current.unhookEditor(quillEditor);
                document.getElementById("quill-editor")?.remove();
            }
        });

        // quillEditor.root.addEventListener("blur", (e: FocusEvent) => {
        //     dispatch(onEditText({ textIdx: text.id, isEditing: false, text: quillEditor.getText() }));

        //     const editedStyles = quillEditor.getFormat();

        //     konvaTextRef.current!.visible(true);
        //     konvaTextRef.current!.fill(editedStyles.color ? editedStyles.color : "#000");

        //     if (editedStyles.bold && editedStyles.italic) {
        //         konvaTextRef.current!.fontStyle("italic bold");
        //     } else if (editedStyles.bold) {
        //         konvaTextRef.current!.fontStyle("bold");
        //     } else if (editedStyles.italic) {
        //         konvaTextRef.current!.fontStyle("italic");
        //     } else {
        //         konvaTextRef.current!.fontStyle("normal");
        //     }

        //     // Disconnect ReactQuill Editor and Remove from DOM
        //     quillRef.current.unhookEditor(quillEditor);
        //     document.getElementById("quill-editor")?.remove();
        // });
    };

    return <Text draggable ref={konvaTextRef} name="text" x={text.x} y={text.y} text={text.content} fontSize={text.size} onDblClick={onEdit} />;
};

const Workspace = () => {
    const dispatch = useAppDispatch();

    let workspaceTopbar = document.getElementById("workspace-topbar") as HTMLDivElement;
    let workspaceContainer = document.getElementById("workspace-stage-container")! as HTMLDivElement;
    let menuNode = document.getElementById("shape-menu")! as HTMLDivElement;
    let deleteButtonNode = document.getElementById("shape-menu-delete-button") as HTMLDivElement;
    let currentShape: ImageType | TextType;

    const stageRef = useRef<StageType>(null);
    const layerRef = useRef<LayerType>(null);
    const rectRef = useRef<RectType>(null);
    const transformerRef = useRef<TransformerType>(null);
    const { stage } = useAppSelector((state) => state.workspace);
    const { currentCategory, themeBackgroundColor } = useAppSelector((state) => state.layout);
    const { image, images, text, texts, quillRef, imageColor } = useAppSelector((state) => state.source);

    const onDropMaterial = (event: DragEvent) => {
        event.preventDefault();
        stageRef.current?.setPointersPositions(event);

        switch (currentCategory) {
            case CONST.default.SIDER_ITEMS.TEXTS:
                dispatch(
                    onDrop({
                        ...text,
                        ...stageRef.current?.getPointerPosition(),
                        currentCategory,
                    })
                );
                break;
            default:
                dispatch(
                    onDrop({
                        id: 0,
                        ...image,
                        ...stageRef.current?.getPointerPosition(),
                        currentCategory,
                    })
                );
                break;
        }
    };

    const fitStageIntoParentContainer = useCallback(() => {
        const workspaceWidth = workspaceContainer.offsetWidth;
        const workspaceHeight = workspaceContainer.offsetHeight;

        stageRef.current?.width(workspaceWidth);
        stageRef.current?.height(workspaceHeight);
    }, []);

    const onClickTapShape = (event: KonvaEventObject<MouseEvent>) => {
        if (event.target === stageRef.current) {
            // Hide shape color picker
            dispatch(onIsUpdateShape({ isUpdating: false }));

            // Clear transformer nodes
            transformerRef.current?.nodes([]);
            return;
        }

        if (rectRef.current?.visible()) {
            return;
        }

        if (!event.target.hasName("image")) {
            return;
        }

        const metaPressed = event.evt.shiftKey || event.evt.ctrlKey || event.evt.metaKey;
        const isSelected = transformerRef.current?.nodes().indexOf(event.target)! >= 0;

        if (!metaPressed && !isSelected) {
            // If no key pressed and the node is not selected, select just one
            transformerRef.current?.nodes([event.target]);
        } else if (metaPressed && isSelected) {
            // If we pressed keys and node was selected, we need to remove it from selection:
            const nodes = transformerRef.current?.nodes().slice()!; // use slice to have new copy of array
            // Remove node from array)
            nodes.splice(nodes.indexOf(event.target), 1);
            transformerRef.current?.nodes(nodes);
        } else if (metaPressed && !isSelected) {
            // Add the node into selection
            const nodes = transformerRef.current?.nodes().concat([event.target])!;
            transformerRef.current?.nodes(nodes);
        }
    };
    var x1: number, y1: number, x2: number, y2: number;

    const onDownShape = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (e.target !== stageRef.current) {
            return;
        }

        e.evt.preventDefault();

        x1 = stageRef.current?.getPointerPosition()!.x;
        y1 = stageRef.current?.getPointerPosition()!.y;
        x2 = stageRef.current?.getPointerPosition()!.x;
        y2 = stageRef.current?.getPointerPosition()!.y;
        rectRef.current?.visible(true);
        rectRef.current?.width(0);
        rectRef.current?.height(0);
    };

    const onMoveShape = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!rectRef.current?.visible()) {
            return;
        }

        e.evt.preventDefault();

        x2 = stageRef.current?.getPointerPosition()!.x as number;
        y2 = stageRef.current?.getPointerPosition()!.y as number;

        rectRef.current.setAttrs({
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
        });
    };

    const onUpShape = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!rectRef.current?.visible()) {
            return;
        }
        e.evt.preventDefault();

        // Update visibility in timeout, so we can check it in click event
        setTimeout(() => {
            rectRef.current?.visible(false);
        });

        const shapes = stageRef.current?.find(".image")!;
        let box = rectRef.current?.getClientRect();
        let selected = shapes.filter((shape: Konva.Node) => Konva.Util.haveIntersection(box, shape.getClientRect()));
        transformerRef.current?.nodes(selected);
    };

    const onContextMenu = (e: KonvaEventObject<PointerEvent>) => {
        e.evt.preventDefault();

        if (e.target === stageRef.current) {
            return;
        }

        currentShape = e.target as ImageType | TextType;

        menuNode.style.display = "initial";
        menuNode.style.top = stageRef.current!.getPointerPosition()!.y - 60 + "px";
        menuNode.style.left = stageRef.current!.getPointerPosition()!.x + 10 + "px";
    };

    const onDeleteShape = (curShape: ImageType | TextType) => {
        deleteButtonNode!.addEventListener("click", () => {
            // TODO: Fixing Delete Transformer
            // const tr = layerRef.current?.findOne("#Transformer");
            // tr?.visible(false);
            if (!curShape) {
                return;
            }
            curShape.destroy();
        });

        deleteButtonNode?.click();
    };

    useEffect(() => {
        window.addEventListener("resize", fitStageIntoParentContainer);

        return () => {
            window.removeEventListener("resize", fitStageIntoParentContainer);
        };
    }, []);

    useEffect(() => {
        window.addEventListener("click", () => {
            menuNode.style.display = "none";
        });
    }, []);

    useEffect(() => {
        workspaceTopbar = document.getElementById("workspace-topbar") as HTMLDivElement;
        workspaceContainer = document.getElementById("workspace-stage-container") as HTMLDivElement;
        menuNode = document.getElementById("shape-menu") as HTMLDivElement;
        deleteButtonNode = document.getElementById("shape-menu-delete-button") as HTMLDivElement;

        const topbarHeight = workspaceTopbar.offsetHeight + 4 + "px";
        workspaceContainer.style.height = `calc(100% - ${topbarHeight})`;

        stageRef.current?.width(workspaceContainer.offsetWidth);
        stageRef.current?.height(workspaceContainer.offsetHeight);
        const background = stageRef.current?.findOne("#canvas-background");
        background?.width(workspaceContainer.offsetWidth);
        background?.height(workspaceContainer.offsetHeight);

        dispatch(onStoreStage(stageRef.current));
    }, []);

    return (
        <div id="workspace">
            <TopBar />
            <div id="workspace-stage-container" onDrop={onDropMaterial} onDragOver={(e) => e.preventDefault()}>
                <div id="shape-menu">
                    <div>
                        <button id="shape-menu-delete-button" onClick={() => onDeleteShape(currentShape)}>
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
                <Stage
                    ref={stageRef}
                    className="workspace-stage-canvas"
                    onTap={onClickTapShape}
                    onClick={onClickTapShape}
                    onMouseDown={onDownShape}
                    onMouseMove={onMoveShape}
                    onMouseUp={onUpShape}
                    onTouchStart={onDownShape}
                    onTouchMove={onMoveShape}
                    onTouchEnd={onUpShape}
                    onContextMenu={onContextMenu}>
                    <Layer name="workspace-layer" ref={layerRef}>
                        {/* <Rect
                            id="canvas-background"
                            listening={false}
                            x={0}
                            y={0}
                            width={stageRef.current?.width()}
                            height={stageRef.current?.height()}
                            fill="#343f4b"
                        /> */}

                        <Rect ref={rectRef} name="rect" fill="rgba(0,0,255,0.5)" visible={false} />

                        {images.map((image: ImageState, index: number) => {
                            return <URLImage key={index} image={image} transformerRef={transformerRef.current!} dispatch={dispatch} imageColor={imageColor} />;
                        })}

                        {texts.map((text: TextState, index: number) => {
                            return (
                                <EditableKonvaText
                                    key={index}
                                    text={text}
                                    textIdx={index}
                                    stageRef={stage}
                                    quillRef={quillRef}
                                    transformerRef={transformerRef.current!}
                                    themeBackgroundColor={themeBackgroundColor}
                                    dispatch={dispatch}
                                />
                            );
                        })}

                        <Transformer name="Transformer" ref={transformerRef} />
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

export default Workspace;
