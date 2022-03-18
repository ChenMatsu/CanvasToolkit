import { useAppSelector } from "../../app/hooks";
import "./Content.scss";

interface ChildProps {
    children: React.ReactNode;
}

const Content = (props: ChildProps) => {
    const { themeBackgroundColor } = useAppSelector((state) => state.layout);

    return (
        <div id="layout-content" style={{ background: themeBackgroundColor }}>
            {props.children}
        </div>
    );
};

export default Content;
