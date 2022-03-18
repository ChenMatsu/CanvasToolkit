import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { onSiderActive } from "./layoutSlice";
import { useTranslation } from "react-i18next";
import { BiLayout, BiText, BiPhotoAlbum, BiCategory, BiFullscreen, BiCloudUpload } from "react-icons/bi";
import "./Sider.scss";
import { useEffect } from "react";

const Sider = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation(["Layout"]);
    const { currentCategory, themeBackgroundColor } = useAppSelector((state) => state.layout);

    const SIDER_ITEMS = [
        {
            key: "elements",
            icon: <BiCategory className="sider-icons" />,
            text: `${t("SiderMenu_Element")}`,
        },
        {
            key: "templates",
            icon: <BiLayout className="sider-icons" />,
            text: `${t("SiderMenu_Template")}`,
        },
        {
            key: "texts",
            icon: <BiText className="sider-icons" />,
            text: `${t("SiderMenu_Text")}`,
        },
        {
            key: "photos",
            icon: <BiPhotoAlbum className="sider-icons" />,
            text: `${t("SiderMenu_Image")}`,
        },
        {
            key: "upload",
            icon: <BiCloudUpload className="sider-icons" />,
            text: `${t("SiderMenu_Upload")}`,
        },
        {
            key: "resizes",
            icon: <BiFullscreen className="sider-icons" />,
            text: `${t("SiderMenu_Resize")}`,
        },
    ];

    useEffect(() => {
        dispatch(onSiderActive({ prevCategory: "", curCategory: currentCategory }));
    }, [dispatch]);

    return (
        <div id="layout-sider" style={{ background: themeBackgroundColor }}>
            <ul>
                {SIDER_ITEMS.map((item) => (
                    <li
                        className="sider-lists"
                        id={item.key}
                        key={item.key}
                        onClick={() => dispatch(onSiderActive({ prevCategory: currentCategory, curCategory: item.key }))}>
                        {item.icon}
                        <h6>{item.text}</h6>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sider;
