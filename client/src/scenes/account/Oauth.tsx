import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";

const Oauth = () => {
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const navigate = useNavigate();

  const token = query.get("token");

  useEffect(() => {
    if (token) navigate(`/account/new-password/${token}`);
  }, [token]);

  return <div></div>;
};

export default Oauth;
