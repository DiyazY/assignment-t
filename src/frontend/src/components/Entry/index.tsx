import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { EntryModel } from "../../models/entryModel";
import ConsumedIcon from "@mui/icons-material/DataUsage";
import styles from "./index.module.css";
import { format } from "date-fns";

export interface EntryProps {
  entry: EntryModel;
}

export default function Entry({ entry }: EntryProps) {
  return (
    <ListItem alignItems="flex-start" data-testid="entry">
      <ListItemText
        primary={entry.name}
        secondary={format(entry.date, "HH:mm")}
      />
      <ListItemIcon>
        <ConsumedIcon color="warning" />
        <span className={styles.calories}>{entry.calories}</span>
      </ListItemIcon>
    </ListItem>
  );
}
