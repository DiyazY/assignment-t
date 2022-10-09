import { useContext, useEffect, useState } from "react";
import { RestContext } from "../../App";
import { EntryModel } from "../../models/entryModel";
import { format, formatISO, compareDesc } from "date-fns";

export type Filter = { from: Date | null; to: Date | null };

export function useEntries(userName: string = "") {
  const [filter, setFilter] = useState<Filter>({
    from: null,
    to: null,
  });
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
    entries: filterEntries(entries, filter),
    add: async (entry: EntryModel): Promise<void> => {
      try {
        await apiManager?.post(`entries/${userName}`, {
          productName: entry.name,
          consumedAt: formatISO(entry.date),
          calories: entry.calories,
        });
        const entryDate = format(entry.date, "yyyy-MM-dd");
        const hasDay = entries.some(([date, _entries]) => date === entryDate);
        if (hasDay) {
          const sortedEntries: [date: string, entries: EntryModel[]][] =
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
            });
          setEntries(sortedEntries);
        } else {
          const grouped: [date: string, entries: EntryModel[]] = [
            entryDate,
            [entry],
          ];
          const sortedEntries = [grouped, ...entries];
          setEntries(sortedEntries);
        }
      } catch (e) {
        // TODO: if have a time add more clever way of dealing with an exception
        console.error(e);
      }
    },
    setFilter,
  };
}

const getDate = (date: Date | null) =>
  (date && format(date, "yyyy-MM-dd")) || "";

function filterEntries(
  entries: [date: string, entries: EntryModel[]][],
  { from = null, to = null }: Filter
): [date: string, entries: EntryModel[]][] {
  const fromIso = getDate(from);
  const toIso = getDate(to);
  if (fromIso && toIso) {
    return entries.filter(([date, _]) => fromIso <= date && toIso >= date);
  } else if (fromIso) {
    return entries.filter(([date, _]) => fromIso <= date);
  } else if (toIso) {
    return entries.filter(([date, _]) => toIso >= date);
  }
  return entries;
}
