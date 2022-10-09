import { Box, Fab, TextField } from "@mui/material";
import { useState } from "react";
import { Filter } from "./useEntries";
import FilterListIcon from "@mui/icons-material/FilterList";

export interface FilterProps {
  setFilter: (filter: Filter) => void;
}

function FilterHeader({ setFilter }: FilterProps) {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const onFilter = () =>
    setFilter({
      from: (from && new Date(from)) || null,
      to: (to && new Date(to)) || null,
    });

  return (
    <Box
      component="div"
      sx={{
        width: "100%",
        "& .MuiTextField-root": { m: 1 },
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <TextField
        type="date"
        label="From"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{ "data-testid": "filter-from" }}
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      ></TextField>
      <TextField
        type="date"
        label="To"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{ "data-testid": "filter-to" }}
        value={to}
        onChange={(e) => setTo(e.target.value)}
      ></TextField>
      <Fab
        color="primary"
        aria-label="filter"
        variant="extended"
        onClick={onFilter}
        data-testid="filter-entries"
      >
        <FilterListIcon />
        Filter Out
      </Fab>
    </Box>
  );
}

export default FilterHeader;
