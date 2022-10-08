import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { login } from "../../utils/restApiManager";

export interface LoginProps {
  setToken: (token: string) => void;
}

function Login({ setToken }: LoginProps) {
  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    const username = target.username.value;
    const password = target.password.value;
    login(username, password).then((token) => setToken(token));
  };
  return (
    <Dialog open>
      <DialogTitle>Login</DialogTitle>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1 },
        }}
        autoComplete="off"
        onSubmit={submitForm}
      >
        <DialogContent>
          <TextField required label="Username" type="text" name="username" />
          <TextField
            required
            label="Password"
            type="password"
            name="password"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" type="submit">
            Login
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default Login;
