// src/user/oauth2/OAuth2RedirectHandler.jsx
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ACCESS_TOKEN } from "./constants";

function OAuth2RedirectHandler() {
  const history = useHistory();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      localStorage.setItem(ACCESS_TOKEN, token);
      history.push("/profile");
    } else {
      history.push("/login", { error: error || "Google login failed!" });
    }
  }, [history]);

  return <div>Redirecting...</div>;
}

export default OAuth2RedirectHandler;
