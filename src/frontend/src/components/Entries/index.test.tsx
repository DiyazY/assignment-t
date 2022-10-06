import { render, screen } from "@testing-library/react";
import Entries from ".";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BASE_URL, RestApiManager } from "../../utils/restApiManager";
import { RestContext } from "../../App";

const fakeResponse = [
  ...[...Array(10)].map((i) => ({
    consumedAt: new Date(2022, 10, 23).toISOString(),
    productName: "Apple",
    calories: 123,
  })),
  ...[...Array(10)].map((i) => ({
    consumedAt: new Date(2022, 10, 24).toISOString(),
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
      <Entries threshold={2100}/>
    </RestContext.Provider>
  );
  const entries = await screen.findAllByTestId("entry");
  expect(entries.length).toBe(20);
  const headers = await screen.findAllByTestId("header");
  expect(headers.length).toBe(2);
});
