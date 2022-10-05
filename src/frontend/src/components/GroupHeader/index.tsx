import { Typography } from "@mui/material";
import styles from "./index.module.css";

export interface GroupHeaderProps {
  text: string;
}
export default function GroupHeader({ text }: GroupHeaderProps) {
  return (
    <div className={styles.header} data-testid="header">
      <Typography variant="h4">{text}</Typography>
      <div>2000/2100</div>
    </div>
  );
}
