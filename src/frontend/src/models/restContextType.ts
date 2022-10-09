import { RestApiManager } from "../utils/restApiManager";
import { ProfileModel } from "./profileModel";

export type RestContextType = {
  apiManager: RestApiManager | null;
  profile: ProfileModel | null
};
