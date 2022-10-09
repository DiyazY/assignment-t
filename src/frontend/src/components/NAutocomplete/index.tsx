import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FoodModel } from "../../models/nutritionModels";
import { CircularProgress } from "@mui/material";

import useNAutocomplete, {
  filterOptions,
  getOptionLabel,
} from "./useNAutocomplete";

export interface NAutocompleteProps {
  name: string;
  onChange: (food: FoodModel) => void;
  value: FoodModel | null;
}

export default function NAutocomplete({
  name,
  onChange,
  value = null,
}: NAutocompleteProps) {
  const { onSearch, onSelect, options, loading } = useNAutocomplete(onChange);

  return (
    <Autocomplete
      data-testid="nautocomplete"
      value={value}
      onChange={onSelect}
      filterOptions={filterOptions}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options}
      getOptionLabel={getOptionLabel}
      renderOption={(props, option) => (
        <li {...props} data-testid="nutrition-option">
          {option.name} ({option.calories})
        </li>
      )}
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={(e) => onSearch(e.target.value)}
          label="Food search"
          data-testid="nutrition-select"
          required
          name={name}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
