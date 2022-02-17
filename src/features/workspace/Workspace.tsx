import React, { DragEvent, useCallback, useEffect, useRef } from "react";
import { Stage, Layer, Image, Rect, Transformer } from "react-konva";
import { Stage as StageType } from "konva/lib/Stage";
import { Rect as RectType } from "konva/lib/shapes/Rect";
import { Transformer as TransformerType } from "konva/lib/shapes/Transformer";
import useImage from "use-image";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { onDrop, onClickTap, onMouseDownTouchStart, onMouseMoveTouchMove } from "../sources/sourceSlice";
import { onStoreStage } from "./workspaceSlice";
import TopBar from "./TopBar";
import "./Workspace.scss";
import { KonvaEventObject } from "konva/lib/Node";

const URLImage = ({ image }: { image: { src: string; x: number; y: number } }) => {
    const [img] = useImage(image.src);
    return <Image image={img} x={image.x} y={image.y} offsetX={img ? img.width / 2 : 0} offsetY={img ? img.height / 2 : 0} />;
};

const Workspace = () => {
    const dispatch = useAppDispatch();

    let workspace = document.getElementById("workspace-stage-container")!;
    const stageRef = useRef<StageType>(null);
    const rectRef = useRef<RectType>(null);
    const transformerRef = useRef<TransformerType>(null);
    const { image, images, transformer } = useAppSelector((state) => state.source);

    const onDropMaterial = (event: DragEvent) => {
        event.preventDefault();

        stageRef.current?.setPointersPositions(event);
        dispatch(
            onDrop({
                ...image,
                ...stageRef.current?.getPointerPosition(),
            })
        );
    };

    const fitStageIntoParentContainer = useCallback(() => {
        const workspaceWidth = workspace.offsetWidth;
        const workspaceHeight = workspace.offsetHeight;

        stageRef.current?.width(workspaceWidth);
        stageRef.current?.height(workspaceHeight);
    }, []);

    useEffect(() => {
        window.addEventListener("resize", fitStageIntoParentContainer);

        return () => {
            window.removeEventListener("resize", fitStageIntoParentContainer);
        };
    }, []);

    useEffect(() => {
        workspace = document.getElementById("workspace-stage-container") as HTMLDivElement;
        stageRef.current?.width(workspace.offsetWidth);
        stageRef.current?.height(workspace.offsetHeight);

        const background = stageRef.current?.findOne("#canvas-background");
        background?.width(workspace.offsetWidth);
        background?.height(workspace.offsetHeight);

        dispatch(onStoreStage(stageRef.current));
    }, []);

    const onSelectionClickTap = (event: KonvaEventObject<MouseEvent>) => {
        if (rectRef.current?.visible()) {
            return;
        }

        if (event.target === stageRef.current) {
            transformerRef.current?.nodes([]);
            return;
        }

        const isSelected = transformerRef.current?.nodes().indexOf(event.target)! >= 0;

        const nodes = transformerRef.current!.nodes().concat([event.target]);
        // console.log(nodes);
        transformerRef.current?.nodes(nodes);
        dispatch(
            onClickTap({
                event: event,
                stage: stageRef.current,
                selectionRect: rectRef.current,
                transformer: transformerRef.current,
                isSelected: isSelected,
            })
        );
    };

    const onSelectionMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();
        if (e.target !== stageRef.current) {
            return;
        }

        dispatch(onMouseDownTouchStart({ stage: stageRef.current, selectionRect: rectRef.current }));
    };

    const onSelectionMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();
        // console.log(rectRef.current?.visible());
        if (!rectRef.current?.visible()) {
            return;
        }

        dispatch(
            onMouseMoveTouchMove({
                stage: stageRef.current,
                selectionRect: rectRef.current,
                transformer: {
                    ...transformer,
                },
            })
        );
    };

    return (
        <div id="workspace">
            <TopBar />
            <div id="workspace-stage-container" onDrop={onDropMaterial} onDragOver={(e) => e.preventDefault()}>
                <Stage
                    ref={stageRef}
                    className="workspace-stage-canvas"
                    onTap={onSelectionClickTap}
                    onClick={onSelectionClickTap}
                    onMouseMove={onSelectionMouseMove}
                    // onTouchMove={onSelectionMouseMove}
                    onMouseDown={onSelectionMouseDown}>
                    <Layer>
                        <Rect
                            id="canvas-background"
                            listening={false}
                            x={0}
                            y={0}
                            width={stageRef.current?.width()}
                            height={stageRef.current?.height()}
                            fill="#343f4b"
                        />
                        <Transformer ref={transformerRef} />
                        <Rect ref={rectRef} fill="rgba(0,0,255,0.5)" visible={false} />
                        {images.map((image: any, index: number) => {
                            return <URLImage key={index} image={image} />;
                        })}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

export default Workspace;
