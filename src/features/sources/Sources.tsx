import { useTranslation } from "react-i18next";
import { BiLayout, BiText, BiPhotoAlbum, BiCategory, BiFullscreen } from "react-icons/bi";
import SourceMaterial from "./SoucreMaterial";
import "./Sources.scss";

import CIRCLE_T1 from "../../assets/images/1-circle-1.svg";
import RECT_T1 from "../../assets/images/2-rect-1.svg";
import TRIANGLE_T1 from "../../assets/images/3-triangle-1.svg";
import TRIANGLE2_T1 from "../../assets/images/4-triangle2-1.svg";
import POLY_T1 from "../../assets/images/5-poly-1.svg";
import POLY2_T1 from "../../assets/images/6-poly-1.svg";
import ARROW_T1 from "../../assets/images/7-arrow-1.svg";

const ELEMENTS = [
    {
        src: CIRCLE_T1,
    },
    {
        src: RECT_T1,
    },
    {
        src: TRIANGLE_T1,
    },
    {
        src: TRIANGLE2_T1,
    },
    {
        src: POLY_T1,
    },
    {
        src: POLY2_T1,
    },
    {
        src: ARROW_T1,
    },
];

const cards: any = [...ELEMENTS];

const Sources = () => {
    const { t } = useTranslation(["Layout"]);

    return (
        <div id="sources">
            <div id="sources-material">
                {cards.map((card: any) => (
                    <SourceMaterial key={card.src} card={card} />
                ))}
            </div>
        </div>
    );
};

export default Sources;
