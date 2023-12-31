import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { RestContext } from "../../App";
import { ProfileModel } from "../../models/profileModel";
import Entries from "../Entries";
import StatsPanel from "./StatsPanel";

function AdminView() {
  const { apiManager } = useContext(RestContext);
  const [selectedUser, setSelectedUser] = useState<ProfileModel | null>(null);
  const [profiles, setProfiles] = useState<ProfileModel[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    apiManager
      ?.get<ProfileModel[]>("profile", controller.signal)
      .then((profiles) => setProfiles(profiles))
      .catch((err) => {
        console.log(err);
      });
    return () => {
      controller.abort();
    };
  }, [apiManager]);
  return (
    <>
      <Box
        component="div"
        sx={{
          width: "100%",
          // "& .MuiTextField-root": { m: 1 },
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <FormControl sx={{ m: 1, width: "50%" }} size="small">
          <InputLabel id="select-user">Select user</InputLabel>
          <Select
            labelId="select-user"
            id="select-user"
            value={selectedUser?.userName || ""}
            label="User"
            onChange={(e) => {
              const prof = profiles.find((p) => p.userName === e.target.value);
              prof && setSelectedUser(prof);
            }}
          >
            {profiles.map((p) => (
              <MenuItem key={p.userName} value={p.userName}>
                {p.userName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedUser && <StatsPanel userName={selectedUser.userName} />}
      </Box>
      {selectedUser && (
        <Entries
          threshold={selectedUser.threshold || 0}
          userName={selectedUser.userName}
        />
      )}
    </>
  );
}

export default AdminView;
