import { useTranslation } from "react-i18next";
import { BiLayout, BiText, BiPhotoAlbum, BiCategory, BiFullscreen } from "react-icons/bi";
import SourceMaterial from "./SoucreMaterial";
import "./Sources.scss";

const cards: any = [];
//
for (let i = 0; i < 1; i++) {
    cards.push({
        src: "https://api.polotno.dev/basic-shapes/2-rect-1.svg",
    });
}

const Sources = () => {
    const { t } = useTranslation(["Layout"]);

    return (
        <div id="sources">
            {/* <input /> */}
            <div id="sources-material">
                {cards.map((card: any) => (
                    <SourceMaterial key={card.src} card={card} />
                ))}
            </div>
        </div>
    );
};

export default Sources;
