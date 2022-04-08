import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useTranslation } from "react-i18next";
import { AiOutlineSetting } from "react-icons/ai";
import { SketchPicker } from "react-color";
import { Stage as StageInterface } from "konva/lib/Stage";
import { Layer as LayerInterface } from "konva/lib/Layer";
import { Image as ImageInterface } from "konva/lib/shapes/Image";
import { Text as TextInterface } from "konva/lib/shapes/Text";
import { BiPlusCircle, BiDoorOpen, BiSave, BiWorld, BiLink, BiChat, BiInfoCircle, BiDownload } from "react-icons/bi";
import "./Header.scss";
import { onDrop, onDownload, ImageState, onDrag, onIsUpdateShape, onEditText } from "../sources/sourceSlice";
import { onChangeTheme } from "../layout/layoutSlice";
import { onImportCanvas, onSaveCanvas, onStoreRect, onStoreStage, onSaveCurrentShape, onStoreTransformer } from "../workspace/workspaceSlice";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Popover from "@mui/material/Popover";
import * as CONST from "../../consts";
import { Transformer } from "konva/lib/shapes/Transformer";

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

// Re-bind canvas should be modularization
const Header = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation(["Layout"]);
    const { themeBackgroundColor, currentCategory } = useAppSelector((state) => state.layout);
    const { stage, isImported, transformer, rectangle, menu } = useAppSelector((state) => state.workspace);
    const { materials, images, image, quillRef, isEditing } = useAppSelector((state) => state.source);
    const [popoverEl, setPopoverEl] = useState<HTMLElement | null>(null);
    const [savePopoverEl, setSavePopoverEl] = useState<HTMLElement | null>(null);
    const [settingPopoverEl, setSettingPopoverEl] = useState<HTMLElement | null>(null);

    const onPopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setPopoverEl(event.currentTarget);
    };

    const onPopoverClose = () => {
        setPopoverEl(null);
    };

    let x1: number, y1: number, x2: number, y2: number;
    const onDownShape = (e: KonvaEventObject<MouseEvent | TouchEvent>, stage: any, rect: any) => {
        if (e.target !== stage) {
            return;
        }

        e.evt.preventDefault();

        x1 = stage.getPointerPosition()!.x;
        y1 = stage.getPointerPosition()!.y;
        x2 = stage.getPointerPosition()!.x;
        y2 = stage.getPointerPosition()!.y;
        rect.visible(true);
        rect.width(0);
        rect.height(0);
    };

    const onMoveShape = (e: KonvaEventObject<MouseEvent | TouchEvent>, stage: any, rect: any) => {
        if (!rect.visible()) {
            return;
        }

        e.evt.preventDefault();

        x2 = stage.getPointerPosition()!.x as number;
        y2 = stage.getPointerPosition()!.y as number;

        rect.setAttrs({
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
        });
    };

    const onUpShape = (e: KonvaEventObject<MouseEvent | TouchEvent>, stage: any, rect: any, transRef: any) => {
        if (!rect.visible()) {
            return;
        }
        e.evt.preventDefault();

        // Update visibility in timeout, so we can check it in click event
        setTimeout(() => {
            rect.visible(false);
        });

        const imageShapes = stage.find(".image")!;
        const textShapes = stage.find(".text")!;

        let box = rect.getClientRect();
        // Select Images
        let selectedImages = imageShapes.filter((image: Konva.Node) => Konva.Util.haveIntersection(box, image.getClientRect()));
        // Select Texts
        let selectedTexts = textShapes.filter((text: Konva.Node) => Konva.Util.haveIntersection(box, text.getClientRect()));
        // Combine Selected Shapes into TransformerNode
        transRef.nodes([...selectedImages, ...selectedTexts]);
    };

    const onContextMenu = (e: KonvaEventObject<MouseEvent>, stage: any, menu: any) => {
        e.evt.preventDefault();

        if (e.target === stage) {
            return;
        }

        // TODO: Latency
        dispatch(onSaveCurrentShape(e.target as ImageInterface | TextInterface));

        const stagePointerPositions = stage!.getPointerPosition();
        menu.style.display = "initial";
        menu.style.top = `${stagePointerPositions!.y - 60}px`;
        menu.style.left = `${stagePointerPositions!.x + 10}px`;
    };

    const onClickTapShape = (event: KonvaEventObject<MouseEvent>, stage: any, rect: any, trans: any) => {
        if (event.target === stage) {
            // Hide shape color picker
            dispatch(onIsUpdateShape({ isUpdating: false }));

            // Clear transformer nodes
            trans.nodes([]);
            return;
        }

        if (rect.visible()) {
            return;
        }

        if ((!event.target.hasName("image") && !event.target.hasName("text")) || isEditing) {
            return;
        }

        const metaPressed = event.evt.shiftKey || event.evt.ctrlKey || event.evt.metaKey;
        const isSelected = trans.nodes().indexOf(event.target)! >= 0;

        if (!metaPressed && !isSelected) {
            // If no key pressed and the node is not selected, select just one
            trans.nodes([event.target]);
        } else if (metaPressed && isSelected) {
            // If we pressed keys and node was selected, we need to remove it from selection:
            const nodes = trans.nodes().slice()!; // use slice to have new copy of array
            // Remove node from array)
            nodes.splice(nodes.indexOf(event.target), 1);
            trans.nodes(nodes);
        } else if (metaPressed && !isSelected) {
            // Add the node into selection
            const nodes = trans.nodes().concat([event.target])!;
            trans.nodes(nodes);
        }
    };

    const onCreateStage = useCallback((stage: StageInterface, trans?: Transformer, quillRef?: any) => {
        const stageLayer = stage.findOne("Layer") as LayerInterface;
        const textItems = document.getElementsByClassName("sources-text-items");
        const imageItems = document.getElementsByClassName("source-material-item");

        for (let i = 0; i < imageItems.length; i++) {
            imageItems[i].addEventListener("dragend", function (e: any) {
                Konva.Image.fromURL(e.target!.src, function (image: ImageInterface) {
                    stageLayer.add(image);
                    image.name("image");
                    image.draggable(true);
                    image.position({ x: stage.getPointerPosition()!.x, y: stage.getPointerPosition()!.y });
                    // Set image to the pointer
                    image.offset({ x: image.width() / 2, y: image.height() / 2 });
                    image.filters([Konva.Filters.RGBA]);
                    image.setAttr("source", e.target.src);

                    image.on("click", (e) => {
                        dispatch(
                            onIsUpdateShape({
                                isUpdating: true,
                                imageRef: e.target,
                            })
                        );
                    });
                });
            });
        }

        for (let i = 0; i < textItems.length; i++) {
            textItems[i].addEventListener("dragend", function (e: any) {
                const textNode = new Konva.Text();
                stageLayer.add(textNode);
                textNode.setText(e.target.innerText);
                // TODO: Should refer to styles
                textNode.fontSize(e.target.offsetHeight / 1.5);
                textNode.name("text");
                textNode.draggable(true);
                textNode.position({ x: stage.getPointerPosition()!.x, y: stage.getPointerPosition()!.y });
                textNode.offset({ x: textNode.width() / 2, y: textNode.height() / 2 });

                textNode.addEventListener("click", (e) => {
                    trans!.visible(false);
                    dispatch(onEditText({ isEditing: true }));

                    // Hide Konva Text
                    textNode.hide();
                    // Get Konva Text Position and Stage Container Position
                    const textPosition = textNode.getAbsolutePosition();
                    const stageBox = stage.container().getBoundingClientRect();
                    const editableAreaPosition = {
                        x: stageBox.left + textPosition?.x,
                        y: stageBox.top + textPosition?.y,
                    };

                    // Connect ReactQuill Editor
                    const quillEditor = quillRef.getEditor();
                    quillRef.hookEditor(quillEditor);

                    // Place Editor Area based on Konva Text
                    quillEditor.root.id = "quill-editor";
                    quillEditor.root.style.position = "absolute";
                    quillEditor.root.style.top = `${editableAreaPosition.y}px`;
                    quillEditor.root.style.left = `${editableAreaPosition.x}px`;
                    quillEditor.root.style.width = "auto";
                    quillEditor.root.style.minWidth = `${textNode.getWidth()}px`;
                    quillEditor.root.style.maxWidth = "500px";
                    quillEditor.root.style.height = "auto";
                    quillEditor.root.style.minHeight = `${textNode.textHeight}px`;
                    quillEditor.root.style.maxHeight = "500px";
                    quillEditor.root.style.color = textNode.getAttr("fill");
                    quillEditor.root.style.fontSize = `${textNode.textHeight}px`;
                    quillEditor.root.style.fontStyle = textNode.getAttr("fontStyle");
                    quillEditor.root.style.resize = "none";
                    quillEditor.root.style.zIndex = "100";
                    quillEditor.root.style.border = `3px double ${themeBackgroundColor}`;
                    quillEditor.root.style.background = "transparent";
                    document.body.appendChild(quillEditor.root);

                    quillEditor.setText(textNode.text().trim());
                    quillEditor.focus();

                    // TODO: React-Quill might be out-of-sync which can fail to get text and formats. A further check is required.
                    quillEditor.root.addEventListener("keydown", (e: KeyboardEvent) => {
                        if (e.code === "Enter") {
                            dispatch(
                                onEditText({
                                    isEditing: false,
                                    text: quillEditor.getText().trim() ? quillEditor.getText() : textNode.text(),
                                })
                            );
                            const editedStyles = quillEditor.getFormat();

                            textNode.visible(true);
                            textNode.setAttr("fill", editedStyles.color ? editedStyles.color : textNode.getAttr("fill"));
                            textNode.setText(quillEditor.getText().trim() ? quillEditor.getText() : textNode.text());

                            if (editedStyles.bold && editedStyles.italic) {
                                textNode.fontStyle("italic bold");
                            } else if (editedStyles.bold) {
                                textNode.fontStyle("bold");
                            } else if (editedStyles.italic) {
                                textNode.fontStyle("italic");
                            } else {
                                textNode.fontStyle("normal");
                            }

                            // Disconnect ReactQuill Editor and Remove from DOM
                            trans!.nodes([]);
                            trans!.visible(true);
                            quillRef.unhookEditor(quillEditor);
                            document.getElementById("quill-editor")?.remove();
                        }
                    });
                });
            });
        }

        const stageContainer = stage.container();
        stageContainer.addEventListener("dragover", function (e) {
            e.preventDefault(); // !important
        });

        stageContainer.addEventListener("drop", function (e) {
            e.preventDefault();
            stage.setPointersPositions(e);
        });
    }, []);

    useEffect(() => {
        if (!stage) {
            return;
        }

        if (!isImported) {
            return;
        }

        onCreateStage(stage, transformer, quillRef);
    }, [materials]);

    return (
        <div id="layout-header" style={{ background: themeBackgroundColor }}>
            <ul>
                {/* <li>
                    <BiPlusCircle className="header-icons" /> {t("HeaderLeft_New")}
                </li> */}
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
                            // Destroy previous Konva Canvas Layer children
                            const prevStageLayer = stage.findOne("Layer") as LayerInterface;
                            prevStageLayer.destroyChildren();

                            const canvasNodes = e.target.files![0];
                            const reader = new FileReader();
                            reader.readAsText(canvasNodes);
                            reader.onload = async (e) => {
                                const stage = Konva.Stage.create(e.target?.result, "workspace-reuse-container") as StageInterface;
                                const stageLayer = stage.findOne("Layer") as LayerInterface;

                                const trans = new Konva.Transformer();
                                stageLayer.add(trans);
                                stageLayer.draw();
                                dispatch(onStoreTransformer({ transformer: trans }));

                                stage.find("Image").forEach((imageNode: ImageInterface | any) => {
                                    console.log(imageNode);
                                    const nativeImage = new window.Image();
                                    nativeImage.crossOrigin = "Anonymous";
                                    nativeImage.onload = async () => {
                                        imageNode.image(nativeImage);
                                        imageNode.cache();
                                        imageNode.filters([Konva.Filters.RGBA]);
                                        imageNode.setAttrs({
                                            red: imageNode.getAttr("red"),
                                            green: imageNode.getAttr("green"),
                                            blue: imageNode.getAttr("blue"),
                                            alpha: imageNode.getAttr("alpha"),
                                        });

                                        imageNode.on("click", (e: MouseEvent) => {
                                            dispatch(
                                                onIsUpdateShape({
                                                    isUpdating: true,
                                                    imageRef: e.target,
                                                })
                                            );
                                        });

                                        // TODO: Does this required in react-konva?
                                        // imageNode.getLayer()?.batchDraw();
                                    };
                                    nativeImage.src = imageNode.getAttr("source");
                                    nativeImage.setAttribute("source", imageNode.getAttr("source"));
                                });

                                stage.find("Text").forEach((textNode: TextInterface | any) => {
                                    stageLayer.add(textNode);
                                    textNode.addEventListener("click", (e: PointerEvent) => {
                                        dispatch(onEditText({ isEditing: true }));
                                        trans.visible(false);

                                        // Hide Konva Text
                                        textNode.hide();
                                        // Get Konva Text Position and Stage Container Position
                                        const textPosition = textNode.getAbsolutePosition();
                                        const stageBox = stage.container().getBoundingClientRect();
                                        const editableAreaPosition = {
                                            x: stageBox.left + textPosition?.x,
                                            y: stageBox.top + textPosition?.y,
                                        };

                                        // Connect ReactQuill Editor
                                        const quillEditor = quillRef.getEditor();
                                        quillRef.hookEditor(quillEditor);

                                        // Place Editor Area based on Konva Text
                                        quillEditor.root.id = "quill-editor";
                                        quillEditor.root.style.position = "absolute";
                                        quillEditor.root.style.top = `${editableAreaPosition.y}px`;
                                        quillEditor.root.style.left = `${editableAreaPosition.x}px`;
                                        quillEditor.root.style.width = "auto";
                                        quillEditor.root.style.minWidth = `${textNode.getWidth()}px`;
                                        quillEditor.root.style.maxWidth = "500px";
                                        quillEditor.root.style.height = "auto";
                                        quillEditor.root.style.minHeight = `${textNode.textHeight}px`;
                                        quillEditor.root.style.maxHeight = "500px";
                                        quillEditor.root.style.color = textNode.getAttr("fill");
                                        quillEditor.root.style.fontSize = `${textNode.textHeight}px`;
                                        quillEditor.root.style.fontStyle = textNode.getAttr("fontStyle");
                                        quillEditor.root.style.resize = "none";
                                        quillEditor.root.style.zIndex = "100";
                                        quillEditor.root.style.border = `3px double ${themeBackgroundColor}`;
                                        quillEditor.root.style.background = "transparent";
                                        document.body.appendChild(quillEditor.root);

                                        quillEditor.setText(textNode.text().trim());
                                        quillEditor.focus();

                                        // TODO: React-Quill might be out-of-sync which can fail to get text and formats. A further check is required.
                                        quillEditor.root.addEventListener("keydown", (e: KeyboardEvent) => {
                                            if (e.code === "Enter") {
                                                dispatch(
                                                    onEditText({
                                                        isEditing: false,
                                                        text: quillEditor.getText().trim() ? quillEditor.getText() : textNode.text(),
                                                    })
                                                );
                                                const editedStyles = quillEditor.getFormat();

                                                textNode.visible(true);
                                                textNode.setAttr("fill", editedStyles.color ? editedStyles.color : textNode.getAttr("fill"));
                                                textNode.setText(quillEditor.getText().trim() ? quillEditor.getText() : textNode.text());

                                                if (editedStyles.bold && editedStyles.italic) {
                                                    textNode.fontStyle("italic bold");
                                                } else if (editedStyles.bold) {
                                                    textNode.fontStyle("bold");
                                                } else if (editedStyles.italic) {
                                                    textNode.fontStyle("italic");
                                                } else {
                                                    textNode.fontStyle("normal");
                                                }

                                                // Disconnect ReactQuill Editor and Remove from DOM
                                                trans.nodes([]);
                                                trans.visible(true);
                                                quillRef.unhookEditor(quillEditor);
                                                document.getElementById("quill-editor")?.remove();
                                            }
                                        });
                                    });
                                });

                                const rect = new Konva.Rect();
                                rect.fill("blue");
                                rect.opacity(0.5);
                                rect.visible(false);
                                rect.position({ x: 150, y: 200 });
                                stageLayer.add(rect);
                                stageLayer.draw();

                                // Update Refs
                                dispatch(onStoreRect({ rect: rect }));
                                dispatch(onStoreStage({ stage: stage }));
                                dispatch(onImportCanvas({ stageRef: stage }));
                                onCreateStage(stage, trans, quillRef);

                                // Pass current stage and rect refs
                                // Re-bind all events to newly created stage
                                stage.on("tap", (e) => {
                                    onClickTapShape(e, stage, rect, trans);
                                });

                                stage.on("click", (e) => {
                                    onClickTapShape(e, stage, rect, trans);
                                });

                                stage.on("touchmove", (e) => {
                                    onMoveShape(e, stage, rect);
                                });

                                stage.on("mousedown", (e) => {
                                    onDownShape(e, stage, rect);
                                });

                                stage.on("mousemove", (e) => {
                                    onMoveShape(e, stage, rect);
                                });

                                stage.on("mouseup", (e) => {
                                    onUpShape(e, stage, rect, trans);
                                });

                                stage.on("contextmenu", (e) => {
                                    onContextMenu(e, stage, menu);
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
                {/* <li>
                    <BiInfoCircle className="header-icons" /> {t("HeaderRight_About")}
                </li> */}
                <li
                    onClick={() => {
                        const stageLayer = stage.find(".workspace-layer")[0];
                        dispatch(onDownload(stageLayer.toDataURL()));
                    }}>
                    <BiDownload className="header-icons" /> {t("HeaderRight_Download")}
                </li>
                <li onMouseEnter={(e) => setSettingPopoverEl(e.currentTarget)} onMouseLeave={() => setSettingPopoverEl(null)}>
                    <AiOutlineSetting className="header-icons" /> {t("HeaderRight_Setting")}
                    <Popover
                        id="mouse-over-popover"
                        open={Boolean(settingPopoverEl)}
                        anchorEl={settingPopoverEl}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        onClose={() => setSettingPopoverEl(null)}>
                        <SketchPicker onChange={(color) => dispatch(onChangeTheme({ themeColor: color.hex }))} color={themeBackgroundColor} />
                    </Popover>
                </li>
            </ul>
        </div>
    );
};

export default Header;
