import { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { onStoreQuill, onUpdateShape } from "../sources/sourceSlice";
import { CompactPicker } from "react-color";
import { Popover } from "@mui/material";
import ReactQuill from "react-quill";
import { BiUndo, BiRedo, BiDroplet, BiLock, BiLockOpen, BiCopy, BiTrash, BiPaint } from "react-icons/bi";
import "./TopBar.scss";

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
    const [settingPopoverEl, setSettingPopoverEl] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (quillRef.current) {
            dispatch(onStoreQuill({ quillRef: quillRef.current }));
        }
    }, [quillRef.current]);

    return (
        <div id="workspace-topbar">
            <ul>
                {/* <li>
                    <BiUndo className="workspace-topbar-icons" onClick={() => quillRef.current?.getEditor()} />
                </li>
                
                <li>
                    <BiRedo className="workspace-topbar-icons" />
                </li> */}

                <li style={{ width: "100%", visibility: isEditing ? "visible" : "hidden" }}>
                    <ReactQuill
                        ref={quillRef}
                        modules={{
                            toolbar: toolbar,
                        }}
                        style={{
                            width: "max-content",
                            zIndex: 1000,
                        }}>
                        <div style={{ display: "none" }} />
                    </ReactQuill>
                </li>

                <li
                    style={{ width: "100%", visibility: isEditingImage ? "visible" : "hidden" }}
                    onMouseEnter={(e) => setSettingPopoverEl(e.currentTarget)}
                    onMouseLeave={() => setSettingPopoverEl(null)}>
                    <BiPaint className="workspace-topbar-icons" />
                    <Popover
                        id="mouse-over-popover"
                        open={Boolean(settingPopoverEl)}
                        anchorEl={settingPopoverEl}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        onClose={() => setSettingPopoverEl(null)}>
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
                    </Popover>
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
                {/* <li>
                    <BiTrash className="workspace-topbar-icons" />
                </li> */}
            </ul>
        </div>
    );
};

export default TopBar;
