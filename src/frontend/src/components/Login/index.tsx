import { Box, Button, Dialog, DialogTitle, TextField } from "@mui/material";
import { login } from "../../utils/restApiManager";

export interface LoginProps {
  setToken: (token: string) => void;
}

function Login({ setToken }: LoginProps) {
  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    // Preventing the page from reloading
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
          "& .MuiTextField-root": { m: 1, width: "20ch" },
          "& .MuiButtonBase-root": { m: 1, width: "80%", alignSelf: "center" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={submitForm}
      >
        <TextField required label="Username" type="text" name="username" />
        <TextField required label="Password" type="password" name="password" />
        <Button variant="contained" type="submit">
          Login
        </Button>
      </Box>
    </Dialog>
  );
}

export default Login;
