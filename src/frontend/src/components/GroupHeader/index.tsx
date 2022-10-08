import { Box, Typography } from "@mui/material";
import styles from "./index.module.css";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";

export interface GroupHeaderProps {
  text: string;
  threshold: number;
  current: number;
}
export default function GroupHeader({
  text,
  threshold,
  current,
}: GroupHeaderProps) {
  return (
    <div className={styles.header} data-testid="header">
      <Typography variant="h5">{text}</Typography>
      <Box sx={{ width: "70%" }}>
        <LinearProgressWithLabel value={current} threshold={threshold} />
      </Box>
    </div>
  );
}

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number; threshold: number }
) {
  const value = (props.value * 100) / props.threshold;
  const color = value >= 100 ? "error" : value >= 80 ? "warning" : "success";
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1, ml: 2 }}>
        <LinearProgress
          data-testid="linear-progress"
          variant="determinate"
          {...props}
          value={value}
          color={color}
        />
      </Box>
      <Box sx={{ minWidth: 70 }}>
        <Typography variant="body2" color="text.secondary">
          {`${props.value}/${props.threshold}`}
        </Typography>
      </Box>
    </Box>
  );
}
