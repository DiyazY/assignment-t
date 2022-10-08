import { useContext, useEffect, useState } from "react";
import { RestContext } from "../../App";
import { EntryModel } from "../../models/entryModel";
import { format, formatISO, compareDesc } from "date-fns";

export function useEntries(userName: string = "") {
  const { apiManager } = useContext(RestContext);
  const [entries, setEntries] = useState<
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
            const date = format(entry.date, "yyyy-MM-dd");
            if (!groups.has(date)) {
              groups.set(date, []);
            }
            groups.get(date)?.push(entry);
            return groups;
          }, new Map<string, EntryModel[]>());
        setEntries(Array.from(groups));
      });
    return () => {
      controller.abort();
    };
  }, [apiManager, userName]);
  return {
    entries,
    add: async (entry: EntryModel): Promise<void> => {
      try {
        await apiManager?.post(`entries/${userName}`, {
          productName: entry.name,
          consumedAt: formatISO(entry.date),
          calories: entry.calories,
        });
        const entryDate = format(entry.date, "yyyy-MM-dd");
        const hasDay = entries.some(([date, entries]) => date === entryDate);
        if (hasDay) {
          setEntries(
            entries.map(([date, entries]) => {
              if (date === entryDate) {
                return [
                  date,
                  [entry, ...entries].sort((p, n) =>
                    compareDesc(p.date, n.date)
                  ),
                ];
              } else {
                return [date, entries];
              }
            })
          );
        } else {
          const grouped: [date: string, entries: EntryModel[]] = [
            entryDate,
            [entry],
          ];
          const sortedEntries = [...entries, grouped];
          setEntries(sortedEntries);
        }
      } catch (e) {
        // TODO: if have a time add more clever way of dealing with an exception
        console.error(e);
      }
    },
  };
}
