import { Divider, List, ListSubheader } from "@mui/material";
import { Fragment } from "react";
import Entry from "../Entry";
import GroupHeader from "../GroupHeader";
import { useEntries } from "./useEntries";

export interface EntriesProps {
  userName: string;
}

function Entries({ userName }: EntriesProps):JSX.Element {
  const groupedEntries = useEntries(userName);
  return (
    <>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          position: "relative",
          overflow: "auto",
          maxHeight: "100vh",
          "& ul": { padding: 0 },
        }}
        subheader={<li />}
      >
        {groupedEntries.map(([date, entries]) => (
          <li key={`grouped-by-${date}`}>
            <ul>
              <ListSubheader>
                <GroupHeader text={date} />
              </ListSubheader>
              {entries.map((entry, i) => (
                <Fragment key={`entry-${date}-${i}`}>
                  <Entry entry={entry} />
                  {entries.length - 1 !== i && <Divider />}
                </Fragment>
              ))}
            </ul>
          </li>
        ))}
      </List>
    </>
  );
}
export default Entries;
