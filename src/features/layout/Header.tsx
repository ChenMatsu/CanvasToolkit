import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useTranslation } from "react-i18next";
import { BiPlusCircle, BiDoorOpen, BiSave, BiWorld, BiLink, BiChat, BiInfoCircle, BiDownload } from "react-icons/bi";
import "./Header.scss";
import { onDownload } from "../sources/sourceSlice";

const Header = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation(["Layout"]);

    const { stage } = useAppSelector((state) => state.workspace);

    return (
        <div id="layout-header">
            <ul>
                <li>
                    <BiPlusCircle className="header-icons" /> {t("HeaderLeft_New")}
                </li>
                <li>
                    <BiDoorOpen className="header-icons" /> {t("HeaderLeft_Open")}
                </li>
                <li>
                    <BiSave className="header-icons" /> {t("HeaderLeft_Save")}
                </li>
            </ul>

            <ul>
                <li>
                    <BiWorld className="header-icons" /> {t("HeaderRight_Language")}
                </li>
                <a href="https://www.facebook.com/ZDtech.TW/" target="_blank">
                    <li>
                        <BiLink className="header-icons" /> {t("HeaderRight_Link")}
                    </li>
                </a>
                <a href="https://www.zerodimension.com.tw/main/Default.aspx" target="_blank">
                    <li>
                        <BiChat className="header-icons" /> {t("HeaderRight_Chat")}
                    </li>
                </a>

                <li>
                    <BiInfoCircle className="header-icons" /> {t("HeaderRight_About")}
                </li>
                <li
                    onClick={() => {
                        dispatch(onDownload(stage.toDataURL()));
                    }}>
                    <BiDownload className="header-icons" /> {t("HeaderRight_Download")}
                </li>
            </ul>
        </div>
    );
};

export default Header;
