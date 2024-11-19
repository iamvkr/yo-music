import { useState } from "react";

const userContext = () => {
  const [user, setuser] = useState({
    isLoggedIn: undefined,
    userData: null
  });
  return {user, setuser};
}

export default userContext;