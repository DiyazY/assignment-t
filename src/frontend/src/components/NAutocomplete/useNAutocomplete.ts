import { createFilterOptions } from "@mui/material/Autocomplete";
import { FoodModel } from "../../models/nutritionModels";
import { search } from "../../utils/nutritionApiManager";
import { debounce, FilterOptionsState } from "@mui/material";
import { useEffect, useState } from "react";

const filter = createFilterOptions<FoodModel>();

const DEBOUNCE_DELAY = 500;

const onSearch = (
  term: string,
  setOptions: (foods: FoodModel[]) => void,
  setLoading: (loading: boolean) => void
) =>
  search(term).then((result) => {
    setOptions(result);
    setLoading(false);
  });

const debouncedSearch = debounce(onSearch, DEBOUNCE_DELAY);

export default function useNAutocomplete(onChange: (food: FoodModel) => void) {
  const [options, setOptions] = useState<FoodModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const onSearch = (term: string) => {
    const debSearch = debouncedSearch;
    if (!term) {
      debouncedSearch.clear();
      setOptions([]);
      setLoading(false);
    } else {
      setLoading(true);
      debSearch(term, setOptions, setLoading);
    }
  };

  useEffect(() => {
    return () => {
      debouncedSearch.clear();
    };
  }, []);

  const onSelect = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string | FoodModel | null
  ) => {
    if (typeof value === "string") {
      onChange({
        name: value,
        calories: 0,
      });
    } else if (value && value.name) {
      // Create a new value from the user input
      onChange({
        name: value.name,
        calories: value.calories,
      });
    } else {
      value && onChange(value);
    }
  };

  return {
    onSearch,
    onSelect,
    options,
    loading,
  };
}

export const filterOptions = (
  options: FoodModel[],
  params: FilterOptionsState<FoodModel>
) => {
  const filtered = filter(options, params);

  const { inputValue } = params;
  // Suggest the creation of a new value
  const isExisting = options.some((option) => inputValue === option.name);
  if (inputValue !== "" && !isExisting) {
    filtered.push({
      name: inputValue,
      calories: 0,
    });
  }

  return filtered;
};

export const getOptionLabel = (option: string | FoodModel) => {
  // Value selected with enter, right from the input
  if (typeof option === "string") {
    return option;
  }
  // Add "xxx" option created dynamically
  if (option.name) {
    return option.name;
  }
  // Regular option
  return option.name;
};
