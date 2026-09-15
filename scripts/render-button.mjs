import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

// Render the code-native badge layout with the existing avatar embedded in memory.
// This avoids external-image restrictions in SVG rasterisers and leaves the art intact.
const source = new URL("../assets/buttons/julians-corner-88x31.svg", import.meta.url);
const avatar = readFileSync(new URL("../assets/img/logo.png", import.meta.url));
const svg = readFileSync(source, "utf8").replace(
  '../img/logo.png',
  'data:image/png;base64,' + avatar.toString("base64")
);
const output = fileURLToPath(new URL("../assets/buttons/julians-corner-88x31.png", import.meta.url));
execFileSync("magick", ["-background", "none", "svg:-", "-strip", "PNG32:" + output], { input: svg });
console.log("Rendered 88 × 31 button: " + output);
