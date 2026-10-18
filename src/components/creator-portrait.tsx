import Image from "next/image";
import { creator } from "@/lib/config/creator";

/** One disclosed owner-supplied concept image, art-directed for each placement. */
export function CreatorPortrait({ variant = "editorial", className = "", priority = false, caption = true }: {
  variant?: "hero" | "editorial" | "about" | "learn" | "book" | "avatar";
  className?: string;
  priority?: boolean;
  caption?: boolean;
}) {
  return <figure className={`creator-portrait creator-portrait-${variant} ${className}`}>
    <div className="creator-portrait-media">
      {creator.portrait.enabled ? <Image src={creator.portrait.src} alt={creator.portrait.alt} fill priority={priority} sizes={variant === "avatar" ? "64px" : variant === "learn" ? "160px" : "(min-width: 1024px) 480px, (min-width: 640px) 380px, 80vw"} /> : <div className="portrait-fallback"><span className="portrait-fallback-arch" aria-hidden="true" /><span>ITACHI</span><small>Da&rsquo;wah x Dialogues</small></div>}
    </div>
    {caption && variant !== "avatar" && <figcaption>{creator.portrait.enabled ? "Concept portrait · approval pending" : "A space for the creator · image withheld"}</figcaption>}
  </figure>;
}
