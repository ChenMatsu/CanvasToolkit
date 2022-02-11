import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { Stage as StageType } from "konva/lib/Stage";
import { DragEvent, useCallback, useEffect, useRef } from "react";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";

import { onDrop } from "../sources/sourceSlice";
import TopBar from "./TopBar";
import "./Workspace.scss";

const URLImage = ({ image }: { image: { src: string; x: number; y: number } }) => {
    const [img] = useImage(image.src);
    return (
        <Image
            image={img}
            x={image.x}
            y={image.y}
            offsetX={img ? img.width / 2 : 0}
            offsetY={img ? img.height / 2 : 0}
        />
    );
};

const MainWorkspace = () => {
    const dispatch = useAppDispatch();
    const stageRef = useRef<StageType>(null);

    const { image, images } = useAppSelector((state) => state.source);

    const onDropMaterial = (event: DragEvent) => {
        event.preventDefault();
        stageRef.current?.setPointersPositions(event);
        console.log(stageRef.current?.getPointerPosition());

        console.log(image);
        dispatch(
            onDrop({
                ...image,
                ...stageRef.current?.getPointerPosition(),
            })
        );
    };

    let workspace = document.getElementById("workspace-stage-container")!;
    const fitStageIntoParentContainer = useCallback(() => {
        const workspaceWidth = workspace.offsetWidth;
        const workspaceHeight = workspace.offsetHeight;
        console.log(workspaceWidth);
        console.log(workspaceHeight);

        // let widthScale = workspaceWidth / window.innerWidth;

        stageRef.current?.width(workspaceWidth);
        stageRef.current?.height(workspaceHeight);
        // stageRef.current?.scale({ x: widthScale, y: widthScale });
    }, []);

    useEffect(() => {
        window.addEventListener("resize", fitStageIntoParentContainer);
    }, []);

    useEffect(() => {
        workspace = document.getElementById("workspace-stage-container") as HTMLDivElement;
        console.log(workspace);
        stageRef.current?.width(workspace.offsetWidth);
        stageRef.current?.height(workspace.offsetHeight);
    }, []);

    return (
        <div id="workspace">
            <TopBar />
            <div id="workspace-stage-container" onDrop={onDropMaterial} onDragOver={(e) => e.preventDefault()}>
                <Stage
                    className="workspace-stage-canvas"
                    ref={stageRef}
                    // width={workspace ? workspace.offsetWidth : undefined}
                    // height={workspace ? workspace.offsetHeight : undefined}
                >
                    <Layer>
                        {images.map((image: any, index: number) => {
                            return <URLImage key={index} image={image} />;
                        })}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

export default MainWorkspace;
