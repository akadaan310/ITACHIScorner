import Link from "next/link";
import { PublicHeader } from "@/components/public-content";
export default function NotFound() { return <div className="public-page"><PublicHeader label="404" title={<>A little off the path.<br /><em>Let’s find your way.</em></>}><p>This page could not be found.</p></PublicHeader><div className="shell"><Link href="/" className="btn btn-primary">Back to the Corner <span aria-hidden="true">↗</span></Link></div></div>; }
