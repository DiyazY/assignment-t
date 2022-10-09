export interface ProfileModel {
  role: "User" | "Admin";
  threshold: number;
  userName: string;
}
