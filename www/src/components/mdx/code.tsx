import { writeText } from "@tauri-apps/api/clipboard";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import hljs from "highlight.js";
import { notifications } from "@mantine/notifications";

const CODE: React.FC<JSX.IntrinsicElements["code"]> = (props) => {
  let highlighted;
  try {
    highlighted = hljs.highlight(props.children?.toString() ?? "", {
      language: props.className?.replace("language-", "") ?? "plaintext",
    });
  } catch (e: any) {
    if (
      e.message ==
      `Unknown language: "${props.className?.replace("language-", "")}"`
    ) {
      highlighted = hljs.highlight(props.children?.toString() ?? "", {
        language: "plaintext",
      });
    }
  }

  const copyCode = async () => {
    let code = props.children?.toString();
    if (!code) return;

    code = code.replace(/\n$/g, "");
    await writeText(code);

    notifications.show({
      id: "clipboard-copy",
      message: "Copied to clipbaord!",
      color: "green",
      icon: <IconCheck />,
    });
  };

  return (
    <div className="relative [&:hover>button]:opacity-100 [&>button]:opacity-0">
      <button
        className="absolute p-1 top-3 right-3 rounded-md z-10 shadow-lg bg-black bg-opacity-30 transition-opacity"
        onClick={copyCode}
      >
        <IconCopy color="white" />
      </button>
      <code
        className="hljs flex flex-col pr-5 w-full h-full code-border font-mono"
        dangerouslySetInnerHTML={{
          __html: highlighted?.value ?? "Error rendering code",
        }}
      />
    </div>
  );
};

export default CODE;
