import {
  act,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { wait } from "@testing-library/user-event/dist/utils";
import { rest } from "msw";
import { setupServer } from "msw/node";
import NAutocomplete from ".";
import { FoodModel } from "../../models/nutritionModels";

const fakeResponse = {
  branded: [
    { food_name: "Chicken", nf_calories: 100 },
    { food_name: "grilled chicken", nf_calories: 150 },
    { food_name: "grilled beef", nf_calories: 250 },
    { food_name: "avocado chicken sandwich", nf_calories: 750 },
  ],
  common: [
    { food_name: "Chicken-common", nf_calories: 100 },
    { food_name: "grilled chicken-common", nf_calories: 150 },
    { food_name: "grilled beef-common", nf_calories: 400 },
    { food_name: "avocado chicken sandwich-common", nf_calories: 750 },
    { food_name: "apple chicken sandwich-common", nf_calories: 750 },
  ],
};

const server = setupServer(
  rest.get(
    "https://trackapi.nutritionix.com/v2/search/instant",
    (req, res, ctx) => {
      return res(ctx.json(fakeResponse));
    }
  )
);

let onChange: (food: FoodModel) => void;

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
});
beforeEach(() => {
  onChange = jest.fn(function (v) {
    console.log("selected");
  });
});
afterAll(() => server.close());

describe("testing NAutocomplete", () => {
  test("it should return chicken matches when the user searches for 'chicken'", async () => {
    render(<NAutocomplete name="nutrition" onChange={onChange} value={null} />);
    const autocomplete = screen.getByTestId("nutrition-select");
    const input = within(autocomplete).getByRole("combobox");
    autocomplete.focus();
    await userEvent.type(input, "chicken");
    expect(input).toHaveValue("chicken");

    await waitFor(() => {
      const options = screen.getAllByTestId("nutrition-option");

      expect(options.length).toBe(8); // 7 items from Nutrition API and one is free typing version
    });
  });

  test("it should return beef matches when the user searches for 'beef'", async () => {
    render(<NAutocomplete name="nutrition" onChange={onChange} value={null} />);
    const autocomplete = screen.getByTestId("nutrition-select");
    const input = within(autocomplete).getByRole("combobox");
    autocomplete.focus();
    await userEvent.type(input, "beef");
    expect(input).toHaveValue("beef");

    await waitFor(() => {
      const options = screen.getAllByTestId("nutrition-option");

      expect(options.length).toBe(3); // 2 items from Nutrition API and one is free typing version
    });
  });

  test("onChange should be called once when the user selects an option", async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      render(
        <NAutocomplete name="nutrition" onChange={onChange} value={null} />
      );
    });
    const autocomplete = screen.getByTestId("nutrition-select");
    const input = within(autocomplete).getByRole("combobox");
    autocomplete.focus();
    await userEvent.type(input, "beef");
    expect(input).toHaveValue("beef");
    await wait(600);
    const selection = screen.getAllByText(/grilled beef-common/i)[0];
    // await userEvent.click(selection);

    act(() => {
      selection.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith({
      name: "grilled beef-common",
      calories: 400,
    });
  });

  test("onChange should be called once when the user selects an free typed option", async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      render(
        <NAutocomplete name="nutrition" onChange={onChange} value={null} />
      );
    });
    const autocomplete = screen.getByTestId("nutrition-select");
    const input = within(autocomplete).getByRole("combobox");
    autocomplete.focus();
    await userEvent.type(input, "eggs");
    expect(input).toHaveValue("eggs");
    await wait(600);
    const selection = screen.getAllByText(/eggs/i)[0];
    // await userEvent.click(selection);

    act(() => {
      selection.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith({
      name: "eggs",
      calories: 0, // default is 0
    });
  });

  test("it should return 0 matches when the user cleans the input box", async () => {
    render(<NAutocomplete name="nutrition" onChange={onChange} value={null} />);
    const autocomplete = screen.getByTestId("nutrition-select");
    const input = within(autocomplete).getByRole("combobox");
    autocomplete.focus();
    await userEvent.type(input, "beef");
    expect(input).toHaveValue("beef");
    await userEvent.clear(input);
    await waitFor(() => {
      const options = screen.queryAllByTestId("nutrition-option")
      expect(options.length).toBe(0);
    });
  });
});
