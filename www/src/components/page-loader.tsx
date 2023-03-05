import { Loader } from "@mantine/core";

const PageLoader = () => {
  return (
    <div
      className="grid place-items-center w-full h-full"
    >
      <Loader variant="dots" />
    </div>
  );
};

export default PageLoader;
