import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { onDragText, onSwitchMaterials, onUploadImages } from "./sourceSlice";
import SourceMaterial from "./SoucreMaterial";
import { BiCloudUpload } from "react-icons/bi";
import "./Sources.scss";
import * as CONST from "../../consts";
import CIRCLE_T1 from "../../assets/images/1-circle-1.svg";
import RECT_T1 from "../../assets/images/2-rect-1.svg";
import TRIANGLE_T1 from "../../assets/images/3-triangle-1.svg";
import TRIANGLE2_T1 from "../../assets/images/4-triangle2-1.svg";
import POLY_T1 from "../../assets/images/5-poly-1.svg";
import POLY2_T1 from "../../assets/images/6-poly-1.svg";
import ARROW_T1 from "../../assets/images/7-arrow-1.svg";
import CIRCLE_T2 from "../../assets/images/1-circle-2.svg";
import RECT_T2 from "../../assets/images/2-rect-2.svg";
import TRIANGLE_T2 from "../../assets/images/3-triangle-2.svg";
import TRIANGLE2_T2 from "../../assets/images/4-triangle2-2.svg";
import POLY_T2 from "../../assets/images/5-poly-2.svg";
import POLY2_T2 from "../../assets/images/6-poly-2.svg";
import ARROW_T2 from "../../assets/images/7-arrow-2.svg";
import CIRCLE_T3 from "../../assets/images/1-circle-3.svg";
import RECT_T3 from "../../assets/images/2-rect-3.svg";
import TRIANGLE_T3 from "../../assets/images/3-triangle-3.svg";
import TRIANGLE2_T3 from "../../assets/images/4-triangle2-3.svg";
import POLY_T3 from "../../assets/images/5-poly-3.svg";
import POLY2_T3 from "../../assets/images/6-poly-3.svg";
import ARROW_T3 from "../../assets/images/7-arrow-3.svg";
import Cloud from "../../assets/images/cloud.svg";
import Lighten from "../../assets/images/lightning.svg";
import Moon from "../../assets/images/moon.svg";
import Focus from "../../assets/images/focus.svg";
import Star from "../../assets/images/star.svg";

const ELEMENTS = [
    {
        src: CIRCLE_T1,
    },
    {
        src: CIRCLE_T2,
    },
    {
        src: CIRCLE_T3,
    },
    {
        src: RECT_T1,
    },
    {
        src: RECT_T2,
    },
    {
        src: RECT_T3,
    },
    {
        src: TRIANGLE_T1,
    },
    {
        src: TRIANGLE_T2,
    },
    {
        src: TRIANGLE_T3,
    },
    {
        src: TRIANGLE2_T1,
    },
    {
        src: TRIANGLE2_T2,
    },
    {
        src: TRIANGLE2_T3,
    },
    {
        src: POLY_T1,
    },
    {
        src: POLY_T2,
    },
    {
        src: POLY_T3,
    },
    {
        src: POLY2_T1,
    },
    {
        src: POLY2_T2,
    },
    {
        src: POLY2_T3,
    },
    {
        src: ARROW_T1,
    },
    {
        src: ARROW_T2,
    },
    {
        src: ARROW_T3,
    },
    {
        src: Cloud,
    },
    {
        src: Moon,
    },
    {
        src: Lighten,
    },
    {
        src: Star,
    },
    {
        src: Focus,
    },
];

const TEMPLATES = [
    {
        src: "https://api.polotno.dev/templates/2021-10-25-instagram-story-pink-blue.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-10-25-instagram-story-greeting-ducklings.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-10-25-instagram-story-fashion-style.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-10-25-instagram-story-female-fashion.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-10-16-instagram-story-wedding-invitation.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-10-16-instagram-story-watermelon-sale.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-10-16-instagram-story-trick-treat.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-10-16-instagram-story-snowman-christmas.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-10-16-instagram-story-question-answer.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-10-16-instagram-story-leaf-flowers.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-10-16-instagram-story-bingo-notification.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-10-16-instagram-story-beach-waves.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-08-30-instagram-story-halloween-party.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-08-01-instagram-story-sale-black.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-08-01-instagram-story-recycle-waste.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-08-01-instagram-story-new-fashion.jpg",
    },
    {
        src: "https://api.polotno.dev/templates/2021-08-01-instagram-story-health-medical.jpg",
    },
];

const PHOTOS = [
    {
        src: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
    },
    {
        src: "https://cdn.pixabay.com/photo/2021/08/25/20/42/field-6574455__340.jpg",
    },
    {
        src: "https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg",
    },
    {
        src: "data:image/jpeg;base64,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",
    },
    {
        src: "data:image/jpeg;base64,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",
    },
    {
        src: "https://pbs.twimg.com/media/DfkhrO1XUAEYkdw.jpg",
    },
    {
        src: "https://media.istockphoto.com/photos/hot-air-balloons-flying-over-the-botan-canyon-in-turkey-picture-id1297349747?b=1&k=20&m=1297349747&s=170667a&w=0&h=oH31fJty_4xWl_JQ4OIQWZKP8C6ji9Mz7L4XmEnbqRU=",
    },
    {
        src: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        src: "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    },
    {
        src: "https://images.pexels.com/photos/624015/pexels-photo-624015.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    },
    {
        src: "https://images.pexels.com/photos/5137664/pexels-photo-5137664.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    },
    {
        src: "https://images.pexels.com/photos/839462/pexels-photo-839462.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    },
    {
        src: "https://images.pexels.com/photos/6004828/pexels-photo-6004828.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    },
    {
        src: "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    },
    {
        src: "https://images.pexels.com/photos/814499/pexels-photo-814499.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    },
];

const elements: any = [...ELEMENTS];
const templates: any = [...TEMPLATES];
const photos: any = [...PHOTOS];
const resizes: any = [...TEMPLATES];

const Sources = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation(["Sources"]);
    const { currentCategory } = useAppSelector((state) => state.layout);
    const { isLoading, materials } = useAppSelector((state) => state.source);

    const onSelectedSider = () => {
        switch (currentCategory) {
            case CONST.default.SIDER_ITEMS.ELEMENTS:
                dispatch(onSwitchMaterials({ categoryItems: elements }));
                break;
            case CONST.default.SIDER_ITEMS.TEMPLATES:
                dispatch(onSwitchMaterials({ categoryItems: templates }));
                break;
            case CONST.default.SIDER_ITEMS.TEXTS:
                dispatch(onSwitchMaterials({ categoryItems: [] }));
                break;
            case CONST.default.SIDER_ITEMS.PHOTOS:
                dispatch(onSwitchMaterials({ categoryItems: photos }));
                break;
            case CONST.default.SIDER_ITEMS.UPLOAD:
                dispatch(onSwitchMaterials({ categoryItems: [] }));
                break;
            case CONST.default.SIDER_ITEMS.RESIZES:
                dispatch(onSwitchMaterials({ categoryItems: resizes }));
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        onSelectedSider();
    }, [currentCategory]);

    return (
        <div id="sources">
            {(() => {
                switch (currentCategory) {
                    case CONST.default.SIDER_ITEMS.UPLOAD:
                        return (
                            <div id="sources-operations">
                                <h3>{t("UploadTitle")}</h3>
                                <input
                                    id="sources-upload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    onChange={async (e) => {
                                        const images: string[] = [];
                                        const onGetImage = async () => {
                                            for (let i = 0; i < e.target.files!.length; i++) {
                                                await new Promise((resolve, reject) => {
                                                    const reader = new FileReader();
                                                    reader.readAsDataURL(e.target.files![i]);
                                                    reader.onload = (e) => {
                                                        resolve(e.target?.result);
                                                    };
                                                }).then((image: any) => images.push(image));
                                            }
                                        };
                                        await onGetImage();

                                        dispatch(onUploadImages({ images: images }));
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        document.getElementById("sources-upload")?.click();
                                    }}>
                                    <BiCloudUpload style={{ fontSize: "175%", verticalAlign: "bottom" }} /> {t("UploadButton")}
                                </button>
                            </div>
                        );
                    case CONST.default.SIDER_ITEMS.TEXTS:
                        return (
                            <div id="sources-text-boxes">
                                <h1
                                    className="sources-text-items"
                                    draggable
                                    onDragStart={(e) => {
                                        dispatch(onDragText({ text: e.currentTarget.innerText, size: e.currentTarget.getBoundingClientRect().height / 2 }));
                                    }}>
                                    {t("Title")}
                                </h1>
                                <h3
                                    className="sources-text-items"
                                    draggable
                                    onDragStart={(e) => {
                                        dispatch(onDragText({ text: e.currentTarget.innerText, size: e.currentTarget.getBoundingClientRect().height / 2 }));
                                    }}>
                                    {t("Subtitle")}
                                </h3>
                                <p
                                    className="sources-text-items"
                                    draggable
                                    onDragStart={(e) => {
                                        dispatch(onDragText({ text: e.currentTarget.innerText, size: e.currentTarget.getBoundingClientRect().height / 2 }));
                                    }}>
                                    {t("Paragraph")}
                                </p>
                            </div>
                        );
                }
            })()}

            <div
                id="sources-material"
                style={{
                    gridTemplateColumns: currentCategory === CONST.default.SIDER_ITEMS.ELEMENTS ? "1fr 1fr 1fr" : "1fr 1fr",
                }}>
                {isLoading ? <h3>Loading....</h3> : materials.map((card: any) => <SourceMaterial key={card.src} card={card} />)}
            </div>
        </div>
    );
};

export default Sources;
