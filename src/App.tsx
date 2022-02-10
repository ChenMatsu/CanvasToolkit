import React from "react";
import Content from "./features/layout/Content";
import Header from "./features/layout/Header";
import Sider from "./features/layout/Sider";
import Workspace from "./features/workspace/workspace";

function App() {
  return (
    <div className="App">
      <Header />
      <Content>
        <Sider />
        <Workspace />
      </Content>
    </div>
  );
}

export default App;
