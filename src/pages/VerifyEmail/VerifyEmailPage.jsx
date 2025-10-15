import React from "react";
import { Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSearchParams } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import Loader from "../../components/common/Loader.jsx";
import { FormattedMessage } from "react-intl";
import { useAuthContext } from "../../providers/AuthProvider.jsx";

const VerifyEmailPage = () => {
  const { config } = useAuthContext();

  const [searchParams] = useSearchParams();
  const [exists, setExists] = useState(false);

  const verifyUserEmail = async () => {
    const params = {
      token: searchParams.get("token"),
      pwd: searchParams.get("pwd"),
    };
    try {
      await config.services.verifyEmail(params);
      setExists(true);
      setTimeout(() => {
        location.href = "/login";
      }, 4000);

    } catch (error) {
        location.href = "/login";
    }
  }

  useLayoutEffect(() => {
    verifyUserEmail();
  }, []);

  return exists ? (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack maxWidth={"21.9rem"} minWidth={"21.5rem"}>
        <Typography sx={{ fontSize: "18px", fontWeight: "700" }}>
          <FormattedMessage id="Done" />
        </Typography>
      </Stack>
      <Stack
        maxWidth={"21.9rem"}
        bgcolor={"#4CAF50"}
        minHeight={"4rem"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        padding={"10px"}
        borderRadius={"5px"}
      >
        <Stack mr={"20px"}>
          <CheckCircleIcon
            sx={{
              width: "30px",
              height: "30px",
              fill: "rgba(255, 255, 255, 0.7)",
            }}
          />
        </Stack>
        <Stack>
          <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            <FormattedMessage id="succss" />
          </Typography>
          <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            <FormattedMessage id="emailVerifiedMsg" />
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  ) : (
    <Loader />
  );
};

export default VerifyEmailPage;
