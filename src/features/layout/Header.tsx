import Konva from "konva";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useTranslation } from "react-i18next";
import { AiOutlineSetting } from "react-icons/ai";
import { Image as ImageType } from "konva/lib/shapes/Image";
import { BiPlusCircle, BiDoorOpen, BiSave, BiWorld, BiLink, BiChat, BiInfoCircle, BiDownload } from "react-icons/bi";
import "./Header.scss";
import { onDownload } from "../sources/sourceSlice";
import { onSaveCanvas } from "../workspace/workspaceSlice";
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
    const [savePopoverEl, setSavePopoverEl] = useState<HTMLElement | null>(null);

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
                <li
                    onClick={() => {
                        document.getElementById("header-left-import")?.click();
                    }}>
                    <input
                        id="header-left-import"
                        type="file"
                        accept="application/json"
                        multiple={false}
                        hidden
                        onChange={(e) => {
                            const canvasNodes = e.target.files![0];
                            const reader = new FileReader();
                            reader.readAsText(canvasNodes);
                            reader.onload = async (e) => {
                                const stage = Konva.Node.create(e.target?.result, "workspace-stage-container");
                                stage.find("Image").forEach((imageNode: ImageType) => {
                                    const nativeImage = new window.Image();
                                    nativeImage.onload = () => {
                                        imageNode.image(nativeImage);
                                        imageNode.getLayer()?.batchDraw();
                                    };
                                    nativeImage.src = imageNode.getAttr("source");
                                });
                            };
                        }}
                    />
                    <BiDoorOpen className="header-icons" />
                    {t("HeaderLeft_Open")}
                </li>
                <li
                    onMouseEnter={(e) => setSavePopoverEl(e.currentTarget)}
                    onMouseLeave={() => setSavePopoverEl(null)}
                    onClick={() => {
                        dispatch(onSaveCanvas({ canvasJSON: stage.toJSON() }));
                    }}>
                    <BiSave className="header-icons" /> {t("HeaderLeft_Save")}
                    {/* <Popover
                        id="mouse-over-popover"
                        open={Boolean(savePopoverEl)}
                        anchorEl={savePopoverEl}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        onClose={() => setSavePopoverEl(null)}>
                        {t("HeaderLeft_SavePopover")}
                    </Popover> */}
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
                <li>
                    <AiOutlineSetting className="header-icons" /> {t("HeaderRight_Setting")}
                </li>
            </ul>
        </div>
    );
};

export default Header;
