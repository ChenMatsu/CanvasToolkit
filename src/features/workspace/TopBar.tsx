import { BiUndo, BiRedo, BiDroplet, BiLock, BiLockOpen, BiCopy, BiTrash } from "react-icons/bi";
import "./TopBar.scss";

const TopBar = () => {
    return (
        <div id="workspace-topbar">
            <ul>
                <li>
                    <BiUndo className="workspace-topbar-icons" />
                </li>
                <li>
                    <BiRedo className="workspace-topbar-icons" />
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
