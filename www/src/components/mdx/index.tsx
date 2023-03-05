import { MDXComponents } from "mdx/types";
import A from "./a";
import CODE from "./code";

import H1 from "./h1";
import LI from "./li";
import UL from "./ul";

const defaultComponents: MDXComponents = {
  a: A,
  code: CODE,
  h1: H1,
  li: LI,
  ul: UL,
};

export default defaultComponents;
