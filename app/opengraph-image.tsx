import { ImageResponse } from "next/og";

export const alt = "Joseph Orias, computer science student and designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#EDF1F2";
const GRID = "#C8D6EC";
const INK = "#1C4596";
const INK_HEADING = "#163A82";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: PAPER,
          backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          padding: 72,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 56,
            borderTop: `2px solid ${INK}`,
            borderBottom: `2px solid ${INK}`,
            borderLeft: `2px dashed ${INK}`,
          }}
        >
          <div style={{ fontSize: 112, fontWeight: 700, color: INK_HEADING, lineHeight: 1 }}>Joseph Orias</div>
          <div style={{ marginTop: 28, fontSize: 40, color: INK }}>Computer science student and designer</div>
        </div>
      </div>
    ),
    size,
  );
}
