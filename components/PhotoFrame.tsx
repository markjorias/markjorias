import Image from "next/image";
import styles from "./PhotoFrame.module.css";

type Props = { hasPhoto: boolean; alt: string };

export default function PhotoFrame({ hasPhoto, alt }: Props) {
  return (
    <figure className={styles.frame}>
      {hasPhoto ? (
        <Image className={styles.photo} src="/photo.jpg" alt={alt} width={480} height={480} priority />
      ) : (
        <svg className={styles.placeholder} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="99" height="99" />
          <line x1="0" y1="0" x2="100" y2="100" />
          <line x1="100" y1="0" x2="0" y2="100" />
        </svg>
      )}
      {!hasPhoto && <figcaption className={styles.caption}>Photo, 1:1</figcaption>}
    </figure>
  );
}
