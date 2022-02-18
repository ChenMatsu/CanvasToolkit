import React, { DragEvent, useCallback, useEffect, useRef } from "react";
import { Stage, Layer, Image, Rect, Transformer } from "react-konva";
import { Stage as StageType } from "konva/lib/Stage";
import { Rect as RectType } from "konva/lib/shapes/Rect";
import { Transformer as TransformerType } from "konva/lib/shapes/Transformer";
import Konva from "konva";
import useImage from "use-image";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { onDrop, onClickTap, onMouseDown, onMouseMove, onMouseUp } from "../sources/sourceSlice";
import { onStoreStage } from "./workspaceSlice";
import TopBar from "./TopBar";
import "./Workspace.scss";
import { KonvaEventObject } from "konva/lib/Node";

const URLImage = ({ image }: { image: { src: string; x: number; y: number } }) => {
    const [img] = useImage(image.src, "anonymous");
    return <Image draggable image={img} x={image.x} y={image.y} offsetX={img ? img.width / 2 : 0} offsetY={img ? img.height / 2 : 0} />;
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

    const onClickTapShape = (event: KonvaEventObject<MouseEvent>) => {
        if (rectRef.current?.visible()) {
            return;
        }

        console.log(event);

        console.log(stageRef);
        if (event.target === stageRef.current) {
            transformerRef.current?.nodes([]);
            return;
        }

        console.log(transformerRef.current?.getNodes());
        // const isSelected = transformerRef.current?.nodes().indexOf(event.target)! >= 0;
        const nodes = transformerRef.current!.nodes().concat([event.target]);
        console.log(nodes);
        transformerRef.current?.nodes(nodes);

        // if (!action.payload.isSelected) {
        //     action.payload.transformer.nodes([action.payload.event.target]);
        // }
        // const nodes = action.payload.transformer.nodes().concat([action.payload.event.target]);
        // action.payload.transformer.nodes(nodes);
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

        // dispatch(onMouseDown({ stage: stageRef.current }));

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
            // x: Math.min(transformer.selection.x1, transformer.selection.x2),
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
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

        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
            rectRef.current?.visible(false);
        });

        const shapes = stageRef.current?.find(".rect")!;
        const box = rectRef.current?.getClientRect();
        const selected = shapes.filter((shape: any) => Konva.Util.haveIntersection(box, shape.getClientRect()));
        transformerRef.current?.nodes(selected);
        // dispatch(
        //     onMouseUp({
        //         stage: stageRef.current,
        //         selectionRect: rectRef.current,
        //         transformerRef: transformerRef.current,
        //     })
        // );
    };

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

    return (
        <div id="workspace">
            <TopBar />
            <div id="workspace-stage-container" onDrop={onDropMaterial} onDragOver={(e) => e.preventDefault()}>
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
                    onTouchEnd={onUpShape}>
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
                        <Rect ref={rectRef} name="rect" fill="rgba(0,0,255,0.5)" visible={false} />
                        {images.map((image: any, index: number) => {
                            return <URLImage key={index} image={image} />;
                        })}
                        <Transformer ref={transformerRef} />
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

export default Workspace;
