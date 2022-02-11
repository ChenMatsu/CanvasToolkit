import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { onDrag } from "./sourceSlice";
import "./SourceMaterial.scss";

const SourceMaterial = (props: any) => {
    const dispatch = useAppDispatch();

    const onDragMaterialStart = (e: any) => {
        dispatch(onDrag(e.target.src));
    };

    return (
        <div className="source-material-card">
            <img draggable src={props.card.src} width={60} height={60} onDragStart={onDragMaterialStart} />
        </div>
    );
};

export default SourceMaterial;
