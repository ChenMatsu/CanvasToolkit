import { useTranslation } from "react-i18next";
import { BiLayout, BiText, BiPhotoAlbum, BiCategory, BiFullscreen } from "react-icons/bi";
import "./Sider.scss";

const Sider = () => {
    const { t } = useTranslation(["Layout"]);

    return (
        <div id="layout-sider">
            <ul>
                <li>
                    <BiLayout className="sider-icons" />
                    <h6>{t("SiderMenu_Template")}</h6>
                </li>
                <li>
                    <BiCategory className="sider-icons" />
                    <h6>{t("SiderMenu_Element")}</h6>
                </li>
                <li>
                    <BiText className="sider-icons" />
                    <h6>{t("SiderMenu_Text")}</h6>
                </li>
                <li>
                    <BiPhotoAlbum className="sider-icons" />
                    <h6>{t("SiderMenu_Image")}</h6>
                </li>
                <li>
                    <BiFullscreen className="sider-icons" />
                    <h6>{t("SiderMenu_Resize")}</h6>
                </li>
            </ul>
        </div>
    );
};

export default Sider;
