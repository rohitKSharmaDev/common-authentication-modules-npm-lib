import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import Loader from "../../components/common/Loader.jsx";
import { useIntl } from "react-intl";

import { useAuth, useAuthContext } from "../../providers/AuthProvider.jsx";

const GLoginPage = () => {
  const { onAuthSuccess } = useAuth();
  const { notify } = useAuthContext();

  const navigate = useNavigate();
  const intl = useIntl();

  const getMessage = (id) => intl.formatMessage({ id });

  const showSnackBar = (msg) => {
    notify(getMessage(msg), "error");
  };

  const replaceQueryParams = () => {
    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, "", url);
  };

  const isJwt = (token) => {
    if (typeof token !== "string") return false;
    const parts = token.split(".");
    return parts.length >= 2;
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");
    const errorFromUrl = queryParams.get("error");

    if (tokenFromUrl) {
      if (!isJwt(tokenFromUrl)) {
        showSnackBar("Invalid Token Request");
        navigate("/login");

      } else {
        onAuthSuccess({ token: tokenFromUrl });
        navigate("/dashboard");
      }
      replaceQueryParams();
    } else if (errorFromUrl) {
      let errMsg = "sm-went-wrong-contact-support";
      if (
        errorFromUrl == "account_not_found" ||
        errorFromUrl == "access_denied" ||
        errorFromUrl == "account_blocked"
      )
        errMsg = errorFromUrl;

      showSnackBar(errMsg);
      replaceQueryParams();
      navigate("/login");
    }
  }, [location.search]);

  return <Loader />;
};

export default GLoginPage;
