import React from "react";
import { Grid, useMediaQuery, useTheme, Box } from "@mui/material";
import LangSelector from "../components/LangSelector/LangSelector.jsx";
import { Outlet } from "react-router";
import { FormattedMessage } from 'react-intl';

const AuthLayout = ({ activeBrandConfig }) => {
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
          backgroundColor: "#fff",
          borderBottom: ".0625rem solid #dadce0",
          padding: ".8125rem 1.25rem",
          height: "4.0625rem",
          zIndex: "100"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            padding: ".8125rem 1.25rem",
          }}
        >
          <img
            src={activeBrandConfig.brandLogo.src}
            alt=""
            style={{ height: "1.875rem" }}
          />
        </Box>

        <LangSelector />
      </Box>

      <Box
        position="relative"
        overflow="hidden"
        backgroundColor="#fff"
        minHeight="100vh"
      >
        <Grid container sx={{
          marginTop: '65px',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundSize: 'calc(49% + 0.625rem) 100%',
          minHeight: 'calc(100vh - 4.0625rem)',
          backgroundRepeat: 'no-repeat',
          backgroundPositionX: 'right',
          backgroundPositionY: 'center',
          backgroundImage: !isSmScreen ? `url(${activeBrandConfig.forgetPasswordPageSideImg(theme.direction)})` : ''
        }}>
          <Grid
            item
            xs={12}
            sm={activeBrandConfig.forgetPasswordPageSideImg(theme.direction) ? 6 : 12}
            lg={activeBrandConfig.forgetPasswordPageSideImg(theme.direction) ? 6 : 12}
            md={activeBrandConfig.forgetPasswordPageSideImg(theme.direction) ? 6 : 12}
          >
            <Outlet />
          </Grid>
          {
            activeBrandConfig.forgetPasswordPageSideImg(theme.direction) && !isSmScreen ?
              <Grid item sm={6} md={6} lg={6} sx={{ position: 'relative' }}>
                {
                  activeBrandConfig.loginActinBtnHref ? <Box
                    position="absolute"
                    top="20px"
                    left="30%"
                  >
                    <a href={activeBrandConfig.loginActinBtnHref}
                      style={{
                        display: 'inline-block',
                        textAlign: 'center',
                        fontSize: "1.125rem",
                        borderRadius: "1.25rem",
                        visibility: isSmScreen ? "hidden" : "",
                        textDecoration: "none",
                        color: "#fff",
                        lineHeight: "2.75rem",
                        width: "11.875rem",
                        zIndex: "1rem",
                        background: "linear-gradient(90deg,#3394F6 25.16%,#AA5AD6 46.27%,#EE6A7E 78.13%)",
                        padding: '0 16px'
                      }}
                    >
                      <FormattedMessage id="schedule-a-call" />
                    </a>
                  </Box> : <></>
                }
              </Grid>
            : <></>
          }
        </Grid>
      </Box>
    </>
  );
};

export default AuthLayout;
