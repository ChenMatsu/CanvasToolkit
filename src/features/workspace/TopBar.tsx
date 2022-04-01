import { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { CompactPicker } from "react-color";
import ReactQuill from "react-quill";
import { BiUndo, BiRedo, BiDroplet, BiLock, BiLockOpen, BiCopy, BiTrash } from "react-icons/bi";
import "./TopBar.scss";
import { onStoreQuill, onUpdateShape } from "../sources/sourceSlice";

// React-Quill Custom Toolbar
const toolbar = [
    ["bold", "italic"],
    [{ color: [] }],
    // [{ color: [] }, { background: [] }],
    // [{ indent: "-1" }, { indent: "+1" }],
];

const TopBar = () => {
    const dispatch = useAppDispatch();
    const quillRef = useRef<ReactQuill>(null);
    const { isEditing, isEditingImage, imageColor } = useAppSelector((state) => state.source);

    useEffect(() => {
        if (quillRef.current) {
            dispatch(onStoreQuill(quillRef.current));
        }
    }, [quillRef.current]);

    return (
        <div id="workspace-topbar">
            <ul>
                <li>
                    <BiUndo className="workspace-topbar-icons" onClick={() => quillRef.current?.getEditor()} />
                </li>
                
                <li>
                    <BiRedo className="workspace-topbar-icons" />
                </li>

                <li style={{ width: "100%", visibility: isEditing ? "visible" : "hidden" }}>
                    <ReactQuill
                        ref={quillRef}
                        modules={{
                            toolbar: toolbar,
                        }}
                        style={{
                            zIndex: 1000,
                        }}>
                        <div style={{ display: "none" }} />
                    </ReactQuill>
                </li>

                <li style={{ width: "100%", display: isEditingImage ? "block" : "none" }}>
                    <CompactPicker
                        color={imageColor.hex}
                        onChange={(color) =>
                            dispatch(
                                onUpdateShape({
                                    red: color.rgb.r,
                                    green: color.rgb.g,
                                    blue: color.rgb.b,
                                    hex: color.hex,
                                })
                            )
                        }
                    />
                </li>
            </ul>
            <ul>
                {/* <li>
                    <BiDroplet className="workspace-topbar-icons" />
                </li>
                <li>
                    <BiLock className="workspace-topbar-icons" />
                </li>
                <li>
                    <BiCopy className="workspace-topbar-icons" />
                </li> */}
                <li>
                    <BiTrash className="workspace-topbar-icons" />
                </li>
            </ul>
        </div>
    );
};

export default TopBar;
