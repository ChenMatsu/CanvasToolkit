interface ChildProps {
  children: React.ReactNode;
}

const Content = (props: ChildProps) => {
  return <div id="layout-content">{props.children}</div>;
};

export default Content;
