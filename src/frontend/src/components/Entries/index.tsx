import { CircularProgress, Divider, List, ListSubheader } from "@mui/material";
import { Fragment } from "react";
import Entry from "../Entry";
import GroupHeader from "../GroupHeader";
import FilterHeader from "./Filter";
import NewEntry from "./NewEntry";
import { useEntries } from "./useEntries";

export interface EntriesProps {
  threshold: number;
  userName?: string;
}

function Entries({ threshold, userName }: EntriesProps): JSX.Element {
  const { entries, add, setFilter, loading, remove, update } =
    useEntries(userName);
  return (
    <>
      <FilterHeader setFilter={setFilter} />
      {loading ? (
        <CircularProgress />
      ) : (
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            position: "relative",
            overflow: "auto",
            maxHeight: "90vh",
            "& ul": { padding: 0 },
          }}
          subheader={<li />}
        >
          {entries.map(([date, entries]) => {
            const sumOfConsumedCalories = entries.reduce(
              (prev, curr) => prev + curr.calories,
              0
            );
            return (
              <li key={`grouped-by-${date}`}>
                <ul>
                  <ListSubheader>
                    <GroupHeader
                      text={date}
                      threshold={threshold}
                      current={sumOfConsumedCalories}
                    />
                  </ListSubheader>
                  {entries.map((entry, i) => (
                    <Fragment key={`entry-${date}-${i}`}>
                      <Entry entry={entry} remove={remove} update={update} />
                      {entries.length - 1 !== i && <Divider />}
                    </Fragment>
                  ))}
                </ul>
              </li>
            );
          })}
        </List>
      )}
      <NewEntry add={add} />
    </>
  );
}
export default Entries;
