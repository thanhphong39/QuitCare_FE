import React from "react";
import AuthenTemplate from "../components/authen-template";
import Navbar_authen from "../components/authen-navbar/Navbar-authen";

function Login() {

  return <>
    <Navbar_authen />
    <AuthenTemplate isLogin={true}></AuthenTemplate>
  </>
}

export default Login;
