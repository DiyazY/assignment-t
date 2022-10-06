import { Typography } from "@mui/material";
import styles from "./index.module.css";

export interface GroupHeaderProps {
  text: string;
  threshold: number;
  current:number;
}
export default function GroupHeader({ text,threshold ,current}: GroupHeaderProps) {
  return (
    <div className={styles.header} data-testid="header">
      <Typography variant="h4">{text}</Typography>
      <div>{current}/{threshold}</div>
    </div>
  );
}
