import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { onDrag, onDragText } from "./sourceSlice";
import * as CONST from "../../consts";
import "./SourceMaterial.scss";

const SourceMaterial = ({ card }: { card: { src: string } }) => {
    const dispatch = useAppDispatch();
    const { currentCategory } = useAppSelector((state) => state.layout);

    const onDragMaterialStart = (e: React.DragEvent<HTMLImageElement>) => {
        switch (currentCategory) {
            // case CONST.default.SIDER_ITEMS.TEXTS:
            //     dispatch(onDragText({ text: e.currentTarget.innerText }));
            //     break;
            default:
                dispatch(onDrag(e.currentTarget.src));
                break;
        }
    };

    return (
        <div className="source-material-card">
            <img
                className="source-material-item"
                style={{ objectFit: currentCategory === CONST.default.SIDER_ITEMS.ELEMENTS ? "contain" : "cover" }}
                draggable
                src={card.src}
                onDragStart={onDragMaterialStart}
            />
        </div>
    );
};

export default SourceMaterial;
