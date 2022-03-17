import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useTranslation } from "react-i18next";
import { BiPlusCircle, BiDoorOpen, BiSave, BiWorld, BiLink, BiChat, BiInfoCircle, BiDownload } from "react-icons/bi";
import "./Header.scss";
import { onDownload } from "../sources/sourceSlice";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Popover from "@mui/material/Popover";

const LanguageButtonsComponent = () => {
    const { i18n } = useTranslation();
    return (
        <>
            <Button onClick={() => i18n.changeLanguage("Taiwan")} key="Taiwan">
                繁體中文
            </Button>
            <Button onClick={() => i18n.changeLanguage("US")} key="US">
                English
            </Button>
            <Button onClick={() => i18n.changeLanguage("Japanese")} key="Japanese">
                日本語
            </Button>
        </>
    );
};

const Header = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation(["Layout"]);
    const { stage } = useAppSelector((state) => state.workspace);
    const [popoverEl, setPopoverEl] = useState<HTMLElement | null>(null);

    const onPopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setPopoverEl(event.currentTarget);
    };

    const onPopoverClose = () => {
        setPopoverEl(null);
    };

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
                <li onMouseEnter={onPopoverOpen} onMouseLeave={onPopoverClose}>
                    <BiWorld className="header-icons" /> {t("HeaderRight_Language")}
                    <Popover
                        id="mouse-over-popover"
                        open={Boolean(popoverEl)}
                        anchorEl={popoverEl}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        onClose={onPopoverClose}>
                        <ButtonGroup orientation="vertical" aria-label="vertical outlined button group">
                            <LanguageButtonsComponent />
                        </ButtonGroup>
                    </Popover>
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
