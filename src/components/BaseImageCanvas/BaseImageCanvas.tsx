import styles from "./BaseImageCanvas.module.scss";

type Props = {
  image: string;
  children?: React.ReactNode;
};

export default function BaseImageCanvas({ image, children }: Props) {
  return (
    <div className={styles.canvas}>
      <img src={image} className={styles.image} />
      {children}
    </div>
  );
}
