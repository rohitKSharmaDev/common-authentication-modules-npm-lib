import React, { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import LangSelector from "../components/LangSelector/LangSelector.jsx";
import { Outlet, useLocation } from "react-router";
import { FormattedMessage } from "react-intl";
import { useAuthContext, useAuthAdapter } from "../providers/AuthProvider.jsx";

const AuthLayoutTwo = () => {
  const adapter = useAuthAdapter();
  const ProfileComponent = adapter.components?.ProfileComponent;

  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const { config, sessionAgreementData } = useAuthContext();
  const isPasswordExpired = sessionAgreementData && sessionAgreementData?.passwordExpiry?.expired;

  useEffect(() => {
      if (location.pathname !== "/reset-password" && location.pathname !== "/verify-signup-email") {
        setShowProfile(true);
      }
    }, []);

  return (
    <>
      <Stack height="100vh" overflow='hidden'>
        <Box
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          display="flex"
          backgroundColor="#fff"
          borderBottom=".0625rem solid #dadce0"
          padding=".8125rem 1.25rem"
          height="4.0625rem"
          zIndex="100"
        >
          <Box
            backgroundColor="#fff"
            padding=".8125rem 1.25rem"
            height="4.0625rem"
            alignItems="center"
            marginBottom=".0625rem"
            display="flex"
          >
            <img
              src={config?.activeBrandConfig.brandLogo.src}
              alt=""
              style={{ height: "1.875rem" }}
            />
          </Box>

          <Stack direction='row' gap={2}>
            <LangSelector />
            {showProfile && <ProfileComponent />}
          </Stack>
        </Box>
        {
          isPasswordExpired && <Stack sx={{ display: "flex", flexDirection: 'row', justifyContent: "center", alignItems: 'center', backgroundColor: "#FFF6E0", padding: ".625rem", border: '.0625rem solid #FFEAB8' }}>
            <img
              src={config?.assets?.warningIcon}
              alt="Warning"
              style={{ marginLeft: "6px", marginRight: "6px", width: "14px", height: "14px" }}
            />
            <Typography sx={{fontWeight: "500"}} >
              <FormattedMessage
                id="expiredPswrdMssg"
              />
            </Typography>
          </Stack>
        }
        <Box width='100%' flexGrow='1' overflow='auto'>
          <Box width='100%' height='100%' position={'relative'}>
            <Outlet />
          </Box>
        </Box>
      </Stack>
    </>
  );
};
export default AuthLayoutTwo;
