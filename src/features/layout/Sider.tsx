import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { onSiderActive } from "./layoutSlice";
import { useTranslation } from "react-i18next";
import { BiLayout, BiText, BiPhotoAlbum, BiCategory, BiFullscreen } from "react-icons/bi";
import "./Sider.scss";
import { useEffect } from "react";

const Sider = () => {
    const dispatch = useAppDispatch();
    const { siderItem } = useAppSelector((state) => state.layout);
    const { t } = useTranslation(["Layout"]);

    const SIDER_ITEMS = [
        {
            key: "template",
            icon: <BiLayout className="sider-icons" />,
            text: `${t("SiderMenu_Template")}`,
        },
        {
            key: "element",
            icon: <BiCategory className="sider-icons" />,
            text: `${t("SiderMenu_Element")}`,
        },
        {
            key: "text",
            icon: <BiText className="sider-icons" />,
            text: `${t("SiderMenu_Text")}`,
        },
        {
            key: "photoAlbum",
            icon: <BiPhotoAlbum className="sider-icons" />,
            text: `${t("SiderMenu_Image")}`,
        },
        {
            key: "resize",
            icon: <BiFullscreen className="sider-icons" />,
            text: `${t("SiderMenu_Resize")}`,
        },
    ];

    useEffect(() => {
        dispatch(onSiderActive({ curItem: siderItem }));
    }, [dispatch]);

    return (
        <div id="layout-sider">
            <ul>
                {SIDER_ITEMS.map((item) => (
                    <li
                        className="sider-lists"
                        id={item.key}
                        key={item.key}
                        onClick={() => dispatch(onSiderActive({ prevItem: siderItem, curItem: item.key }))}>
                        {item.icon}
                        <h6>{item.text}</h6>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sider;
