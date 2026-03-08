import liminalSalt from "./liminalSalt.js";

const active = "liminal-salt";

// Map theme names to their data modules
const themes = {
	"liminal-salt": liminalSalt,
};

const data = themes[active];

export default {
	name: active,
	accent: data?.ui.dark.accent,
	background: data?.ui.dark.background,
};
