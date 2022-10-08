import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
  })),
  ...[...Array(10)].map((i) => ({
    consumedAt: formatISO(new Date(2022, 10, 24)),
    productName: "Orange",
    calories: 321,
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

test("renders 20 entries for 2 days", async () => {
  render(
    <RestContext.Provider value={{ apiManager: new RestApiManager("") }}>
      <Entries threshold={2100} />
    </RestContext.Provider>
  );

  const entries = await screen.findAllByTestId("entry");
  expect(entries.length).toBe(20);

  const headers = await screen.findAllByTestId("header");
  expect(headers.length).toBe(2);
});

test("adds a new entry, it will also create a new group section", async () => {
  server.use(
    rest.post(`${BASE_URL}/api/entries`, (req, res, ctx) => {
      return res(ctx.status(201));
    })
  );
  render(
    <RestContext.Provider value={{ apiManager: new RestApiManager("") }}>
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

  const nameInput = screen.getByTestId("new-name");
  expect(nameInput).toBeInTheDocument();
  await userEvent.type(nameInput, "Beshparmaq");

  const caloriesInput = screen.getByTestId("new-calories");
  expect(caloriesInput).toBeInTheDocument();
  await userEvent.clear(caloriesInput);
  await userEvent.type(caloriesInput, "500");

  const saveButton = screen.getByTestId("save-entry");
  await userEvent.click(saveButton);

  await waitFor(
    async () => {
      const entriesWithNewlyAdded = await screen.findAllByTestId("entry");
      expect(entriesWithNewlyAdded.length).toBe(21);
    },
    { timeout: 100 }
  );
  await waitFor(
    async () => {
      const headers = await screen.findAllByTestId("header");
      expect(headers.length).toBe(3); // 3 groups
    },
    { timeout: 100 }
  );
});

test("adds a new entry, but it will not create a new group section", async () => {
  server.use(
    rest.post(`${BASE_URL}/api/entries`, (req, res, ctx) => {
      return res(ctx.status(201));
    })
  );
  render(
    <RestContext.Provider value={{ apiManager: new RestApiManager("") }}>
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

  const nameInput = screen.getByTestId("new-name");
  expect(nameInput).toBeInTheDocument();
  await userEvent.type(nameInput, "Beshparmaq");

  const caloriesInput = screen.getByTestId("new-calories");
  expect(caloriesInput).toBeInTheDocument();
  await userEvent.clear(caloriesInput);
  await userEvent.type(caloriesInput, "500");

  const saveButton = screen.getByTestId("save-entry");
  await userEvent.click(saveButton);

  await waitFor(
    async () => {
      const entriesWithNewlyAdded = await screen.findAllByTestId("entry");
      expect(entriesWithNewlyAdded.length).toBe(21);
    },
    { timeout: 100 }
  );
  await waitFor(
    async () => {
      const headers = await screen.findAllByTestId("header");
      expect(headers.length).toBe(2); // 2 groups
    },
    { timeout: 100 }
  );
});

test("won't a new entry", async () => {
  server.use(
    rest.post(`${BASE_URL}/api/entries`, (req, res, ctx) => {
      return res(ctx.status(201));
    })
  );
  render(
    <RestContext.Provider value={{ apiManager: new RestApiManager("") }}>
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
  await userEvent.clear(caloriesInput);
  await userEvent.type(caloriesInput, "500");

  const saveButton = screen.getByTestId("save-entry");
  await userEvent.click(saveButton);

  await waitFor(
    async () => {
      const entriesWithNewlyAdded = await screen.findAllByTestId("entry");
      expect(entriesWithNewlyAdded.length).toBe(20);
    },
    { timeout: 100 }
  );
  await waitFor(
    async () => {
      const headers = await screen.findAllByTestId("header");
      expect(headers.length).toBe(2);
    },
    { timeout: 100 }
  );
});