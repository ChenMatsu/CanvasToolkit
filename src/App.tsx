import React from "react";
import Content from "./features/layout/Content";
import Header from "./features/layout/Header";
import Sider from "./features/layout/Sider";
import Sources from "./features/workspace/Sources";
import Workspace from "./features/workspace/Workspace";

function App() {
    return (
        <div className="App">
            <Header />
            <Content>
                <Sider />
                <Sources />
                <Workspace />
            </Content>
        </div>
    );
}

export default App;
