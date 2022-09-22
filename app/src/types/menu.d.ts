type ServiceName = "RESIZE" | "CROP" | "SLICE" | "COLOR";
interface Service {
  text: ServiceName;
  path: `/${string}`;
  icon: JSX.Element;
}

type RefDictionary = {
  [key in ServiceName]: React.RefObject<HTMLDivElement>;
};

type AppPaths = "/" | "/resize" | "/crop" | "/slice" | "/color";

type ServiceDictionary = {
  [key in AppPaths]: Service[];
};

interface Size {
  width: number;
  height: number;
}
