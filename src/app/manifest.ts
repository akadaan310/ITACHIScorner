import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Itachi's Corner — The Celestial Majlis",
    short_name: "Itachi's Corner",
    description: "Every question opens a new sky. Independent concept — unaffiliated and not yet endorsed.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0A14",
    theme_color: "#0B0A14",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
