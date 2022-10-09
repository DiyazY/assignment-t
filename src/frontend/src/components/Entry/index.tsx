import { Fab, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { EntryModel } from "../../models/entryModel";
import ConsumedIcon from "@mui/icons-material/DataUsage";
import styles from "./index.module.css";
import { format } from "date-fns";
import { useContext } from "react";
import { RestContext } from "../../App";
import DeleteIcon from "@mui/icons-material/Delete";
import EditEntry from "./EditEntry";
export interface EntryProps {
  entry: EntryModel;
  remove: (id: number) => void;
  update: (entry: EntryModel) => Promise<void>;
}

export default function Entry({ entry, remove, update }: EntryProps) {
  const { profile } = useContext(RestContext);
  
  return (
    <ListItem alignItems="flex-start" data-testid="entry">
      <ListItemText
        primary={entry.name}
        secondary={format(entry.date, "HH:mm")}
      />
      <ListItemIcon style={{ alignSelf: "center", margin: 0 }}>
        <ConsumedIcon color="warning" />
        <span className={styles.calories}>{entry.calories}</span>
      </ListItemIcon>
      {profile?.role === "Admin" && (
        <>
          <ListItemIcon>
            <EditEntry entry={entry} update={update} />
          </ListItemIcon>
          <ListItemIcon>
            <Fab
              color="warning"
              size="small"
              aria-label="delete"
              data-testid="remove-entry"
              onClick={() => entry.id && remove(entry.id)}
            >
              <DeleteIcon />
            </Fab>
          </ListItemIcon>
        </>
      )}
    </ListItem>
  );
}
