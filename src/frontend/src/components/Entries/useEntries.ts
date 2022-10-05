import { useEffect, useState } from "react";
import { EntryModel } from "../../models/entryModel";

const data = [
  { date: new Date(), name: "Apple", calories: 200 },
  { date: new Date(), name: "Vegeterian Pita", calories: 27 },
  {
    date: new Date(),
    name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et augue accumsan, commodo purus eu, pulvinar sapien. Integer elementum porttitor elementum. Vivamus sit amet luctus massa. Phasellus dignissim pellentesque nisl, vel consequat nunc sagittis vel. Ut sit amet tincidunt magna, at varius tortor. Nulla dapibus mi id orci gravida, eget imperdiet metus dapibus. In a risus vitae tortor sollicitudin pretium. Integer sed nibh ut odio mollis condimentum nec sed lacus.",
    calories: 200,
  },
  { date: new Date(), name: "p2", calories: 27 },
  { date: new Date(), name: "p1", calories: 200 },
  { date: new Date(), name: "p2", calories: 27 },
  { date: new Date(), name: "p1", calories: 2000 },
  { date: new Date(), name: "p2", calories: 27 },
  { date: new Date(), name: "p1", calories: 200 },
  { date: new Date(), name: "p2", calories: 27 },
  { date: new Date(2021, 1, 1), name: "p3", calories: 206 },
  { date: new Date(2021, 1, 1), name: "p4", calories: 205 },
  { date: new Date(2021, 1, 1), name: "p5", calories: 203 },
  { date: new Date(2021, 1, 1), name: "p3", calories: 206 },
  { date: new Date(2021, 1, 1), name: "p4", calories: 205 },
  { date: new Date(2021, 1, 1), name: "p5", calories: 203 },
  { date: new Date(2021, 1, 1), name: "p3", calories: 206 },
  { date: new Date(2021, 1, 1), name: "p4", calories: 205 },
  { date: new Date(2021, 1, 1), name: "p5", calories: 203 },
  { date: new Date(2021, 1, 1), name: "p3", calories: 206 },
  { date: new Date(2021, 1, 1), name: "p4", calories: 205 },
  { date: new Date(2021, 1, 1), name: "p5", calories: 203 },
  { date: new Date(2021, 1, 1), name: "p3", calories: 206 },
  { date: new Date(2021, 1, 1), name: "p4", calories: 205 },
  { date: new Date(2021, 1, 1), name: "p5", calories: 203 },
  { date: new Date(2022, 1, 1), name: "p3", calories: 206 },
  { date: new Date(2022, 1, 1), name: "p3", calories: 206 },
  { date: new Date(2022, 1, 1), name: "p3", calories: 206 },
  { date: new Date(2022, 1, 1), name: "p3", calories: 206 },
  { date: new Date(2022, 1, 1), name: "p3", calories: 206 },
  { date: new Date(2022, 1, 1), name: "p3", calories: 206 },
  { date: new Date(2022, 1, 1), name: "p3", calories: 206 },
  { date: new Date(2022, 1, 1), name: "p3", calories: 206 },
  { date: new Date(2022, 1, 1), name: "p3", calories: 206 },
  { date: new Date(2022, 1, 1), name: "p3", calories: 206 },
];

export function useEntries(userName: string) {
  const [groupedEntries, setGroupedEntries] = useState<
    [date: string, entries: EntryModel[]][]
  >([]);
  useEffect(() => {
    // todo: add api call here
    const groups = data.reduce((groups, entry) => {
      const date = entry.date.toISOString().split("T")[0];
      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date)?.push(entry);
      return groups;
    }, new Map<string, EntryModel[]>());
    setGroupedEntries(Array.from(groups));
  }, []);
  return groupedEntries;
}
