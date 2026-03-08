import { readFileSync } from "fs";

const active = "liminal-salt";

const css = readFileSync(`css/themes/${active}.css`, "utf-8");
const rootBlock = css.match(/:root\s*\{([^}]+)\}/)?.[1] || "";

function getVar(name) {
	const match = rootBlock.match(new RegExp(`--${name}:\\s*([^;]+)`));
	return match?.[1].trim();
}

export default {
	name: active,
	accent: getVar("accent"),
	background: getVar("background"),
};
