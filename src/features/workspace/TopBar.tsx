import { useRef } from "react";
import ReactQuill from "react-quill";
import { BiUndo, BiRedo, BiDroplet, BiLock, BiLockOpen, BiCopy, BiTrash } from "react-icons/bi";
import "./TopBar.scss";

const TopBar = () => {
    const quillRef = useRef<ReactQuill>(null);

    return (
        <div id="workspace-topbar">
            <ul>
                <li>
                    <BiUndo className="workspace-topbar-icons" onClick={() => quillRef.current?.getEditor()} />
                </li>
                <li>
                    <BiRedo className="workspace-topbar-icons" />
                </li>
                <li style={{ width: "100%" }}>
                    <ReactQuill ref={quillRef}>
                        <article style={{ display: "none" }}></article>
                    </ReactQuill>
                </li>
            </ul>
            <ul>
                <li>
                    <BiDroplet className="workspace-topbar-icons" />
                </li>
                <li>
                    <BiLock className="workspace-topbar-icons" />
                </li>
                <li>
                    <BiCopy className="workspace-topbar-icons" />
                </li>
                <li>
                    <BiTrash className="workspace-topbar-icons" />
                </li>
            </ul>
        </div>
    );
};

export default TopBar;
