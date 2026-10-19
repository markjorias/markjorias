import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container" style={{ paddingBlock: "clamp(3rem, 8vw, 6rem)" }}>
      <h1>This page isn&apos;t on the drawing</h1>
      <p>The link may be old, or the project may no longer be public.</p>
      <Link href="/">Back to the home page</Link>
    </main>
  );
}
