const UL: React.FC<JSX.IntrinsicElements["ul"]> = (props) => (
  <ul className="pl-1 list-disc list-inside">{props.children}</ul>
);

export default UL;
