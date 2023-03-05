import { open } from "@tauri-apps/api/shell";

const A: React.FC<JSX.IntrinsicElements["a"]> = (props) => {
  const openLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!props.href) return;

    open(props.href);
  };

  return <a className="underline" href={props.href} onClick={openLink}>{props.children}</a>;
};

export default A;
