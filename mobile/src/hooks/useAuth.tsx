import { useContext } from "react";

import { AuthContext, AuthContexDataProps } from "../context/AuthContext";

export function useAuth(): AuthContexDataProps {
  const context = useContext(AuthContext);

  return context;
}
