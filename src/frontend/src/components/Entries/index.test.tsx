import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import Entries from ".";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BASE_URL, RestApiManager } from "../../utils/restApiManager";
import { RestContext } from "../../App";
import { formatISO, format } from "date-fns";
import userEvent from "@testing-library/user-event";

const fakeResponse = [
  ...[...Array(10)].map((i) => ({
    consumedAt: formatISO(new Date(2022, 10, 23)),
    productName: "Apple",
    calories: 123,
    id: i,
  })),
  ...[...Array(10)].map((i) => ({
    consumedAt: formatISO(new Date(2022, 10, 24)),
    productName: "Orange",
    calories: 321,
    id: 20 + i,
  })),
];

const server = setupServer(
  rest.get(`${BASE_URL}/api/entries/`, (req, res, ctx) => {
    return res(ctx.json(fakeResponse));
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

describe("testing entries", () => {
  test("it should render 20 entries for 2 days", async () => {
    render(
      <RestContext.Provider
        value={{ apiManager: new RestApiManager(""), profile: null }}
      >
        <Entries threshold={2100} />
      </RestContext.Provider>
    );

    const entries = await screen.findAllByTestId("entry");
    expect(entries.length).toBe(20);

    const headers = await screen.findAllByTestId("header");
    expect(headers.length).toBe(2);
  });

  test("it should add a new entry, it will also create a new group section", async () => {
    server.use(
      rest.post(`${BASE_URL}/api/entries/`, (req, res, ctx) => {
        return res(
          ctx.json({
            consumedAt: formatISO(new Date()),
            productName: "Beshparmaq",
            calories: 500,
            id: 100,
          })
        );
      })
    );
    render(
      <RestContext.Provider
        value={{ apiManager: new RestApiManager(""), profile: null }}
      >
        <Entries threshold={2100} />
      </RestContext.Provider>
    );

    const entries = await screen.findAllByTestId("entry");
    expect(entries.length).toBe(20);

    const button = screen.getByTestId("add-entry");
    await userEvent.click(button);

    const dateInput = screen.getByTestId("new-date");
    expect(dateInput).toBeInTheDocument();
    fireEvent.change(dateInput, {
      target: { value: format(new Date(), "yyyy-MM-dd'T'HH:mm") },
    });

    const nameInput = screen.getByTestId("nutrition-select");
    expect(nameInput).toBeInTheDocument();
    await userEvent.type(nameInput, "Beshparmaq");

    const caloriesInput = screen.getByTestId("new-calories");
    expect(caloriesInput).toBeInTheDocument();
    await userEvent.type(caloriesInput, "500");

    const saveButton = screen.getByTestId("save-entry");
    await userEvent.click(saveButton);

    await waitFor(async () => {
      const entriesWithNewlyAdded = await screen.findAllByTestId("entry");
      expect(entriesWithNewlyAdded.length).toBe(21);
    });
    await waitFor(async () => {
      const headers = await screen.findAllByTestId("header");
      expect(headers.length).toBe(3); // 3 groups
    });
  });

  test("it should add a new entry, but it will not create a new group section", async () => {
    server.use(
      rest.post(`${BASE_URL}/api/entries/`, (req, res, ctx) => {
        return res(
          ctx.json({
            consumedAt: formatISO(new Date(2022, 10, 23)),
            productName: "Beshparmaq",
            calories: 500,
            id: 100,
          })
        );
      })
    );
    render(
      <RestContext.Provider
        value={{ apiManager: new RestApiManager(""), profile: null }}
      >
        <Entries threshold={2100} />
      </RestContext.Provider>
    );

    const entries = await screen.findAllByTestId("entry");
    expect(entries.length).toBe(20);

    const button = screen.getByTestId("add-entry");
    await userEvent.click(button);

    const dateInput = screen.getByTestId("new-date");
    expect(dateInput).toBeInTheDocument();
    fireEvent.change(dateInput, {
      target: { value: format(new Date(2022, 10, 23), "yyyy-MM-dd'T'HH:mm") }, // this date is already in a test set
    });

    const autocomplete = screen.getByTestId("nutrition-select");
    const input = within(autocomplete).getByRole("combobox");
    autocomplete.focus();
    await userEvent.type(input, "Beshparmaq");
    expect(input).toHaveValue("Beshparmaq");
    const selection = screen.getAllByText(/Beshparmaq/i)[0];
    await userEvent.click(selection);

    const caloriesInput = screen.getByTestId("new-calories");
    expect(caloriesInput).toBeInTheDocument();
    await userEvent.type(caloriesInput, "500");

    const saveButton = screen.getByTestId("save-entry");
    await userEvent.click(saveButton);

    await waitFor(async () => {
      const entriesWithNewlyAdded = await screen.findAllByTestId("entry");
      expect(entriesWithNewlyAdded.length).toBe(21);
    });
    await waitFor(async () => {
      const headers = await screen.findAllByTestId("header");
      expect(headers.length).toBe(2); // 2 groups
    });
  });

  test("it should not add a new entry because one required field is empty(name)", async () => {
    render(
      <RestContext.Provider
        value={{ apiManager: new RestApiManager(""), profile: null }}
      >
        <Entries threshold={2100} />
      </RestContext.Provider>
    );

    const entries = await screen.findAllByTestId("entry");
    expect(entries.length).toBe(20);

    const button = screen.getByTestId("add-entry");
    await userEvent.click(button);

    const dateInput = screen.getByTestId("new-date");
    expect(dateInput).toBeInTheDocument();
    fireEvent.change(dateInput, {
      target: { value: format(new Date(), "yyyy-MM-dd'T'HH:mm") },
    });

    const caloriesInput = screen.getByTestId("new-calories");
    expect(caloriesInput).toBeInTheDocument();
    await userEvent.type(caloriesInput, "500");

    const saveButton = screen.getByTestId("save-entry");
    await userEvent.click(saveButton);

    await waitFor(async () => {
      const entriesWithNewlyAdded = await screen.findAllByTestId("entry");
      expect(entriesWithNewlyAdded.length).toBe(20);
    });
    await waitFor(async () => {
      const headers = await screen.findAllByTestId("header");
      expect(headers.length).toBe(2);
    });
  });

  test("it should render only 10 entries with a filter is set up to {from: 2022-10-24, to: null}", async () => {
    render(
      <RestContext.Provider
        value={{ apiManager: new RestApiManager(""), profile: null }}
      >
        <Entries threshold={2100} />
      </RestContext.Provider>
    );

    const filterInput = screen.getByTestId("filter-from");
    expect(filterInput).toBeInTheDocument();
    fireEvent.change(filterInput, {
      target: { value: "2022-11-24" },
    });

    await userEvent.click(screen.getByTestId("filter-entries"));
    await waitFor(async () => {
      const entries = await screen.findAllByTestId("entry");
      expect(entries.length).toBe(10);
    });
    await waitFor(async () => {
      const headers = await screen.findAllByTestId("header");
      expect(headers.length).toBe(1);
    });
  });

  test("it should render only 10 entries with a filter is set up to {from: null, to: 2022-10-23}", async () => {
    render(
      <RestContext.Provider
        value={{ apiManager: new RestApiManager(""), profile: null }}
      >
        <Entries threshold={2100} />
      </RestContext.Provider>
    );

    const filterInput = screen.getByTestId("filter-to");
    expect(filterInput).toBeInTheDocument();
    fireEvent.change(filterInput, {
      target: { value: "2022-11-23" },
    });

    await userEvent.click(screen.getByTestId("filter-entries"));
    const entries = await screen.findAllByTestId("entry");
    expect(entries.length).toBe(10);
    const headers = await screen.findAllByTestId("header");
    expect(headers.length).toBe(1);
  });

  test("it should render only 10 entries with a filter is set up to {from: 2022-10-23, to: 2022-10-24}", async () => {
    render(
      <RestContext.Provider
        value={{ apiManager: new RestApiManager(""), profile: null }}
      >
        <Entries threshold={2100} />
      </RestContext.Provider>
    );

    const filterInputFrom = screen.getByTestId("filter-from");
    expect(filterInputFrom).toBeInTheDocument();
    fireEvent.change(filterInputFrom, {
      target: { value: "2022-11-23" },
    });
    const filterInputTo = screen.getByTestId("filter-to");
    expect(filterInputTo).toBeInTheDocument();
    fireEvent.change(filterInputTo, {
      target: { value: "2022-11-24" },
    });

    await userEvent.click(screen.getByTestId("filter-entries"));
    const entries = await screen.findAllByTestId("entry");
    expect(entries.length).toBe(20);
    const headers = await screen.findAllByTestId("header");
    expect(headers.length).toBe(2);
  });
});
