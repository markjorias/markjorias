import Image from "next/image";
import styles from "./PhotoFrame.module.css";

type Props = { hasPhoto: boolean; alt: string };

export default function PhotoFrame({ hasPhoto, alt }: Props) {
  const initials = alt.trim().split(/\s+/).map((part) => part[0]).join("");
  return (
    <figure className={styles.frame}>
      {hasPhoto ? (
        <Image className={styles.photo} src="/photo.jpg" alt={alt} width={480} height={480} priority />
      ) : (
        <div className={styles.monogram} aria-hidden="true"><span>{initials}</span></div>
      )}
      {!hasPhoto && <figcaption className={styles.caption}>Code &amp; design</figcaption>}
    </figure>
  );
}
