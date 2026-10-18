import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Itachi's Corner",
    short_name: "Itachi's Corner",
    description: "Da'wah, learning and thoughtful dialogue. Independent concept — unaffiliated and not yet endorsed.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0B0D",
    theme_color: "#0B0B0D",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
