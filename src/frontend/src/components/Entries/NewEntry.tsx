import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { EntryModel } from "../../models/entryModel";
import styles from "./index.module.css";
import { useState } from "react";
import { format } from "date-fns";

export interface NewEntryProps {
  add: (entry: EntryModel) => Promise<void>;
}

function NewEntry({ add }: NewEntryProps) {
  const [open, setOpen] = useState(false);
  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.currentTarget
      .elements as typeof e.currentTarget.elements & {
      date: { value: string };
      name: { value: string };
      calories: { value: string };
    };

    const name = target.name.value;
    const date = target.date.value;
    const calories = target.calories.value;
    add({
      date: new Date(date),
      name,
      calories: parseInt(calories),
    }).then(() => setOpen(false));
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        variant="extended"
        className={styles.floating}
        onClick={() => setOpen(true)}
        data-testid="add-entry"
      >
        <AddIcon />
        Add Item
      </Fab>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm">
        <DialogTitle>Add new entry</DialogTitle>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "100%" },
          }}
          autoComplete="off"
          onSubmit={submitForm}
        >
          <DialogContent>
            <TextField
              required
              label="Date-Time"
              type="datetime-local"
              name="date"
              defaultValue={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                "data-testid": "new-date",
              }}
            />
            <TextField
              required
              label="ProductName"
              type="text"
              name="name"
              inputProps={{
                "data-testid": "new-name",
              }}
            />
            <TextField
              required
              label="Calories"
              type="number"
              name="calories"
              inputProps={{ min: 0, "data-testid": "new-calories" }}
              defaultValue={100}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" type="submit" data-testid="save-entry">
              Add
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

export default NewEntry;
