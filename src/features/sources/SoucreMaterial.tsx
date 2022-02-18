import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { onDrag } from "./sourceSlice";
import "./SourceMaterial.scss";

const SourceMaterial = (props: { card: { src: string } }) => {
    const dispatch = useAppDispatch();

    const onDragMaterialStart = (e: any) => {
        dispatch(onDrag(e.target.src));
    };

    return (
        <div className="source-material-card">
            <img draggable src={props.card.src} onDragStart={onDragMaterialStart} />
        </div>
    );
};

export default SourceMaterial;
