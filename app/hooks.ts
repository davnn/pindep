import create from "./utils";
import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfig from "../tailwind.config";

const config = resolveConfig(tailwindConfig);

export const {useBreakpoint} = create(config.theme.screens);
