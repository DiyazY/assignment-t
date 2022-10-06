import { useContext, useEffect, useState } from "react";
import { RestContext } from "../../App";
import { EntryModel } from "../../models/entryModel";

export function useEntries(userName: string = "") {
  const { apiManager } = useContext(RestContext);
  const [groupedEntries, setGroupedEntries] = useState<
    [date: string, entries: EntryModel[]][]
  >([]);
  useEffect(() => {
    const controller = new AbortController();
    apiManager
      ?.get<any[]>(`entries/${userName}`, controller.signal)
      .then((data) => {
        const groups = data
          .map((p) => ({
            date: new Date(p.consumedAt),
            name: p.productName,
            calories: p.calories,
          }))
          .reduce((groups, entry) => {
            const date = entry.date.toISOString().split("T")[0];
            if (!groups.has(date)) {
              groups.set(date, []);
            }
            groups.get(date)?.push(entry);
            return groups;
          }, new Map<string, EntryModel[]>());
        setGroupedEntries(Array.from(groups));
      });
    return () => {
      controller.abort();
    };
  }, [apiManager, userName]);
  return groupedEntries;
}
