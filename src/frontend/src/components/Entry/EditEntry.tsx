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
import { EntryModel } from "../../models/entryModel";
import { useState } from "react";
import { format } from "date-fns";
import NAutocomplete from "../NAutocomplete";
import { FoodModel } from "../../models/nutritionModels";
import EditIcon from "@mui/icons-material/Edit";

export interface NewEntryProps {
  entry: EntryModel;
  update: (entry: EntryModel) => Promise<void>;
}

function EditEntry({ entry, update }: NewEntryProps) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FoodModel | null>({
    name: entry.name,
    calories: entry.calories,
  });
  const [calories, setCalories] = useState<number>(entry.calories);
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
    update({
      id: entry.id,
      date: new Date(date),
      name,
      calories: parseInt(calories),
    }).then(() => {
      setOpen(false);
    });
  };

  const onSelect = (food: FoodModel) => {
    setSelectedProduct(food);
    setCalories(food.calories);
  };

  return (
    <>
      <Fab
        color="info"
        size="small"
        aria-label="edit"
        data-testid="edit-entry"
        onClick={() => setOpen(true)}
      >
        <EditIcon />
      </Fab>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm">
        <DialogTitle>Editing entry</DialogTitle>
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
              defaultValue={format(entry.date, "yyyy-MM-dd'T'HH:mm")}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                "data-testid": "update-date",
              }}
            />
            <NAutocomplete
              value={selectedProduct}
              name="name"
              onChange={onSelect}
            />
            <TextField
              required
              value={calories}
              onChange={(e) => {
                const val = e.target.value || "0";
                setCalories(parseInt(val));
              }}
              label="Calories"
              type="number"
              name="calories"
              inputProps={{ min: 0, "data-testid": "update-calories" }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              data-testid="update-entry"
            >
              Update
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

export default EditEntry;
