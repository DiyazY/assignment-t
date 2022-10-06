import { render, screen } from "@testing-library/react";
import Entries from ".";
import { EntryModel } from "../../models/entryModel";

jest.mock("./useEntries.ts", () => ({
  useEntries: (): [date: string, entries: EntryModel[]][] => [
    [
      "2022-11-23",
      [...Array(10)].map((i) => ({
        date: new Date(2022, 10, 23),
        name: "Apple",
        calories: 123,
      })),
    ],
    [
      "2022-11-24",
      [...Array(10)].map((i) => ({
        date: new Date(2022, 10, 24),
        name: "Orange",
        calories: 321,
      })),
    ],
  ],
}));

// beforeAll(() => {});
// afterEach(() => {});
// afterAll(() => {});

test("renders 20 entries for 2 days", async () => {
  render(<Entries threshold={2100} />);
  const entries = await screen.findAllByTestId("entry");
  const headers = await screen.findAllByTestId("header");
  expect(entries.length).toBe(20);
  expect(headers.length).toBe(2);
});
