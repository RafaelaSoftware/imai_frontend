import { extendTheme, theme as base } from "@chakra-ui/react";

import colors from "./foundations/colors";

const fonts = {
  heading: `var(--font-gotham), ${base.fonts?.heading}`,
  body: `var(--font-nunito), ${base.fonts?.body}`,
};

const overrides = {
  fonts,
  colors,
};

export default extendTheme(overrides);
