import { useContext } from "react";
import { UserContext } from "./UserContext";
import SCUVMS from "./pages/SCUVMS";
import RegisterAndLogin from "./pages/RegisterAndLogin";

export default function Routes() {
  const { id } = useContext(UserContext);

  return (id) ? <SCUVMS /> : <SCUVMS />;
}