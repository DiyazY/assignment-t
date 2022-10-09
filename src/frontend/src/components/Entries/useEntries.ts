import { useContext, useEffect, useState } from "react";
import { RestContext } from "../../App";
import { EntryModel } from "../../models/entryModel";
import { format, formatISO, compareDesc } from "date-fns";

export type Filter = { from: Date | null; to: Date | null };

export function useEntries(userName: string = "") {
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    apiManager
      ?.get<any[]>(`entries/${userName}`, controller.signal)
      .then((data) => {
        const groups = data
          .map((p) => ({
            date: new Date(p.consumedAt),
            name: p.productName,
            calories: p.calories,
            id: p.id,
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
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      controller.abort();
    };
  }, [apiManager, userName]);
  return {
    entries: filterEntries(entries, filter),
    add: async (entry: EntryModel): Promise<void> => {
      try {
        const savedEntry =
          (await apiManager?.post<any, EntryModel>(`entries/${userName}`, {
            productName: entry.name,
            consumedAt: formatISO(entry.date),
            calories: entry.calories,
          })) || entry;
        const entryDate = format(entry.date, "yyyy-MM-dd");
        const hasDay = entries.some(([date, _entries]) => date === entryDate);
        if (hasDay) {
          const sortedEntries: [date: string, entries: EntryModel[]][] =
            entries.map(([date, entries]) => {
              if (date === entryDate) {
                return [
                  date,
                  [{ id: savedEntry.id, ...entry }, ...entries].sort((p, n) =>
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
            [{ id: savedEntry.id, ...entry }],
          ];
          const sortedEntries = [grouped, ...entries];
          setEntries(sortedEntries);
        }
      } catch (e) {
        // TODO: if have a time add more clever way of dealing with an exception
        console.error(e);
      }
    },
    remove: async (id: number): Promise<void> => {
      const removedEntry = await apiManager?.delete<any>(`entries/${id}`);

      if (removedEntry) {
        const entryDate = format(
          new Date(removedEntry.consumedAt),
          "yyyy-MM-dd"
        );
        const sortedEntries: [date: string, entries: EntryModel[]][] =
          entries.map(([date, entries]) => {
            if (date === entryDate) {
              return [date, entries.filter((p) => p.id !== id)];
            } else {
              return [date, entries];
            }
          });
        setEntries(sortedEntries);
      }
    },
    update: async (entry: EntryModel) => {
      const updatedEntry = await apiManager?.put<any, EntryModel>(
        `entries/${entry.id}`,
        {
          productName: entry.name,
          consumedAt: formatISO(entry.date),
          calories: entry.calories,
          id: entry.id,
        }
      );
      if (updatedEntry) { // TODO: update remove add have similar code structures... could be polished!
        const entryDate = format(entry.date, "yyyy-MM-dd");
        const sortedEntries: [date: string, entries: EntryModel[]][] =
          entries.map(([date, entries]) => {
            if (date === entryDate) {
              return [
                date,
                entries.map((p) => (p.id === entry.id ? entry : p)),
              ];
            } else {
              return [date, entries];
            }
          });
        setEntries(sortedEntries);
      }
    },
    setFilter,
    loading,
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
