import { DragEvent, useCallback, useEffect, useRef } from "react";
import { Stage, Layer, Group, Image, Rect, Text, Transformer } from "react-konva";
import { Stage as StageType } from "konva/lib/Stage";
import { Rect as RectType } from "konva/lib/shapes/Rect";
import { Layer as LayerType } from "konva/lib/Layer";
import { Image as ImageType } from "konva/lib/shapes/Image";
import { Text as TextType } from "konva/lib/shapes/Text";
import { KonvaEventObject } from "konva/lib/Node";
import { Transformer as TransformerType } from "konva/lib/shapes/Transformer";
import Konva from "konva";
import useImage from "use-image";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { onDrop, onClickTap, onMouseDown, onMouseMove, onMouseUp, ImageState, TextState } from "../sources/sourceSlice";
import { onStoreStage } from "./workspaceSlice";
import TopBar from "./TopBar";
import * as CONST from "../../consts";
import "./Workspace.scss";

const URLImage = ({ image, transformerRef }: { image: { src: string; x: number; y: number }; transformerRef: TransformerType }) => {
    const [img] = useImage(image.src, "anonymous");
    const imageRef = useRef<ImageType>(null);

    useEffect(() => {
        if (img) {
            const imageNodes = transformerRef.nodes().concat([imageRef.current!]);
            transformerRef.nodes(imageNodes);

            // Matsu: Save Image Source to ImageRef in order to export as JSON Format Canvas Node
            imageRef.current?.setAttr("source", img?.src);
        }
    }, [img]);

    return (
        <Image
            draggable
            ref={imageRef}
            name="image"
            image={img}
            x={image.x}
            y={image.y}
            offsetX={img ? img.width / 2 : 0}
            offsetY={img ? img.height / 2 : 0}
            onDragMove={(e) => e.evt.preventDefault()}
            onDragEnd={(e) => e.evt.preventDefault()}
        />
    );
};

const EditableText = ({
    text,
    stageRef,
    transformerRef,
}: {
    text: { content: string; x: number; y: number; size: number };
    stageRef: StageType;
    transformerRef: TransformerType;
}) => {
    const textRef = useRef<TextType>(null);

    const onEditText = () => {
        const textPosition = textRef.current!.getAbsolutePosition();
        const stageBox = stageRef.container().getBoundingClientRect();

        const editableAreaPosition = {
            x: stageBox.left + textPosition?.x,
            y: stageBox.top + textPosition?.y,
        };

        const textarea = document.createElement("textarea");
        document.body.appendChild(textarea);

        textRef.current?.visible(false);
        textarea.value = textRef.current!.text();
        textarea.style.position = "absolute";
        textarea.style.top = editableAreaPosition.y + "px";
        textarea.style.left = editableAreaPosition.x + "px";
        textarea.style.background = "transparent";
        textarea.style.resize = "none";
        textarea.style.width = textRef.current!.width().toString();
        textarea.style.fontSize = textRef.current!.height().toString();

        textarea.focus();

        textarea.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.code === "Enter") {
                textRef.current!.text(textarea.value);
                // layer.draw();
                document.body.removeChild(textarea);

                textRef.current?.visible(true);
            }
        });

        textarea.addEventListener("blur", (e: FocusEvent) => {
            document.body.removeChild(textarea);

            textRef.current?.visible(true);
        });
    };

    return <Text draggable ref={textRef} name="text" x={text.x} y={text.y} text={text.content} fontSize={text.size} onClick={onEditText} />;
};

const Workspace = () => {
    const dispatch = useAppDispatch();
    let workspaceTopbar = document.getElementById("workspace-topbar") as HTMLDivElement;
    let workspaceContainer = document.getElementById("workspace-stage-container")! as HTMLDivElement;
    // let workspaceStage = document.getElementsByClassName("workspace-stage-canvas")[0]! as HTMLDivElement;
    // let workspaceStageContent = document.getElementsByClassName("konvajs-content")[0]! as HTMLDivElement;
    let menuNode = document.getElementById("shape-menu")! as HTMLDivElement;
    let deleteNode = document.getElementById("shape-menu-delete-button") as HTMLDivElement;
    let currentShape: any;
    const stageRef = useRef<StageType>(null);
    const layerRef = useRef<LayerType>(null);
    const rectRef = useRef<RectType>(null);
    const transformerRef = useRef<TransformerType>(null);
    const { stage } = useAppSelector((state) => state.workspace);
    const { currentCategory } = useAppSelector((state) => state.layout);
    const { image, images, text, texts, transformer } = useAppSelector((state) => state.source);

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
        if (rectRef.current?.visible()) {
            return;
        }

        if (event.target === stageRef.current) {
            transformerRef.current?.nodes([]);
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

        // dispatch(
        //     onClickTap({
        //         event: event,
        //         stage: stageRef.current,
        //         selectionRect: rectRef.current,
        //         transformer: transformerRef.current,
        //         isSelected: isSelected,
        //     })
        // );
    };
    var x1: number, y1: number, x2: number, y2: number;

    const onDownShape = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (e.target !== stageRef.current) {
            return;
        }
        e.evt.preventDefault();

        // dispatch(onMouseDown({ stage: stageRef.cu    rrent }));

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
            // x: Math.min(transformer.selection.x1, transformer.selection.x2),
            // y: Math.min(transformer.selection.y1, transformer.selection.y2),
            // width: Math.abs(transformer.selection.x2 - transformer.selection.x1),
            // height: Math.abs(transformer.selection.y2 - transformer.selection.y1),
        });

        // dispatch(
        //     onMouseMove({
        //         stage: stageRef.current,
        //     })
        // );
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
        // dispatch(
        //     onMouseUp({
        //         stage: stageRef.current,
        //         selectionRect: rectRef.current,
        //         transformerRef: transformerRef.current,
        //     })
        // );
    };

    const onContextMenu = (e: KonvaEventObject<PointerEvent>) => {
        e.evt.preventDefault();

        if (e.target === stageRef.current) {
            return;
        }

        currentShape = e.target;
        menuNode.style.display = "initial";
        menuNode.style.top = stageRef.current!.getPointerPosition()!.y - 60 + "px";
        menuNode.style.left = stageRef.current!.getPointerPosition()!.x + 10 + "px";
    };

    const onDeleteShape = () => {
        deleteNode!.addEventListener("click", () => {
            // TODO: Fixing Delete Transformer
            // const tr = layerRef.current?.findOne("#Transformer");
            // tr?.visible(false);
            currentShape.destroy();
        });

        deleteNode?.click();
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
        // workspaceStage = document.getElementsByClassName("workspace-stage-canvas")[0] as HTMLDivElement;
        // workspaceStageContent = document.getElementsByClassName("konvajs-content")[0] as HTMLDivElement;
        menuNode = document.getElementById("shape-menu") as HTMLDivElement;
        deleteNode = document.getElementById("shape-menu-delete-button") as HTMLDivElement;

        const ht = workspaceTopbar.offsetHeight + 4 + "px";
        workspaceContainer.style.height = `calc(100% - ${ht})`;
        // workspaceStage.style.height = `calc(100% - ${ht})`;
        // workspaceStageContent.style.height = `calc(100% - ${ht})`;
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
                        <button id="shape-menu-delete-button" onClick={onDeleteShape}>
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
                            return <URLImage key={index} image={image} transformerRef={transformerRef.current!} />;
                        })}

                        {texts.map((text: TextState, index: number) => {
                            return <EditableText key={index} text={text} stageRef={stage} transformerRef={transformerRef.current!} />;
                        })}

                        <Transformer name="Transformer" ref={transformerRef} />
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

export default Workspace;
