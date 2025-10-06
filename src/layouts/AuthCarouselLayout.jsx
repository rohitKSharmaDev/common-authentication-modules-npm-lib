import React from "react";
import { Box, Typography, Button, styled, Grid, useMediaQuery, useTheme } from "@mui/material";
import LangSelector from "../components/LangSelector/LangSelector.jsx";
import { Outlet } from "react-router-dom";
import { ArrowCircleLeft, ArrowCircleRight } from "@mui/icons-material";
import Slider from "react-slick";
import { FormattedMessage } from "react-intl";
import { useAuthAdapter, useAuthContext } from "../providers/AuthProvider.jsx";

const BtnY = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 20,
  padding: "10px 8px",
  border: "0px solid",
  marginTop: 5,
  marginBottom: 5,
  borderRadius: 20,
  width: "250px",
  lineHeight: 1.5,
  borderColor: "grey",
  color: "#2F4F4F",
  backgroundColor: "#FFD700",
  "&:hover": {
    backgroundColor: "#FFB800",
    borderColor: "#0062cc",
    boxShadow: "none",
  },
});

const AuthCarouselLayout = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const adapter = useAuthAdapter();
  const { config } = useAuthContext();

  const rtlConfig = adapter.useConfig ? adapter.useConfig() : {};
  const isRtl = rtlConfig?.isRtl ?? config?.activeBrandConfig?.isRtl ?? false;

  const IconComponentLeft = isRtl ? ArrowCircleLeft : ArrowCircleRight;
  const IconComponentRight = isRtl ? ArrowCircleRight : ArrowCircleLeft;

  const NextArrow = ({ onClick }) => (
    <Box
      className="slick-arrow next-arrow"
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        transform: "translateX(-50%)",
        fontSize: "1em",
        opacity: "40%",
        color:"white",
        right: "5px",
        "&:hover": {
          opacity: "150%",
        },
      }}
    >
      <IconComponentLeft
        sx={{
          fontSize: "50px",
          filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5))",
          color: "white"
        }}
      />
    </Box>
  );

  const PrevArrow = ({ onClick }) => (
    <Box
      className="slick-arrow prev-arrow"
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        zIndex: "5",
        left:20,
        color:"white",
        opacity: { lg: "40%", xs: '0%', sm: "40%", md: "40%" },
        "&:hover": {
          opacity: "150%",
        },
      }}
    >
       <IconComponentRight
        sx={{
          fontSize: "50px",
          filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5))",
          color: "white"
        }}
      />
    </Box>
  );

  const slides = config?.activeBrandConfig.authPagesCarouselConfig ? [
    {
      image: config?.activeBrandConfig.authPagesCarouselConfig.imgs[0],
      buttonLabel: <FormattedMessage id={config?.activeBrandConfig.authPagesCarouselConfig.buttonLabels[0]} />,
      buttonLink: config?.activeBrandConfig.authPagesCarouselConfig.buttonLinks[0],
      pleft: config?.activeBrandConfig.authPagesCarouselConfig.ctaPositionsConfig.pleft[0],
      tp: config?.activeBrandConfig.authPagesCarouselConfig.ctaPositionsConfig.tp[0],
      colr: config?.activeBrandConfig.authPagesCarouselConfig.ctaBgColors[0],
      txt: config?.activeBrandConfig.authPagesCarouselConfig.ctaTxtColors[0],
      hover: {
        backgroundColor: '#3a4553',
        boxShadow: '0 3px 5px -1px #0003, 0 5px 8px #00000024, 0 1px 14px #0000001f',
        transition: 'box-shadow .2s ease-out, background-color .2s ease-out'
      }
    },
    {
      image: config?.activeBrandConfig.authPagesCarouselConfig.imgs[1],
      buttonLabel: <FormattedMessage id={config?.activeBrandConfig.authPagesCarouselConfig.buttonLabels[1]} />,
      buttonLink: config?.activeBrandConfig.authPagesCarouselConfig.buttonLinks[1],
      pleft: config?.activeBrandConfig.authPagesCarouselConfig.ctaPositionsConfig.pleft[1],
      tp: config?.activeBrandConfig.authPagesCarouselConfig.ctaPositionsConfig.tp[1],
      colr: config?.activeBrandConfig.authPagesCarouselConfig.ctaBgColors[1],
      txt: config?.activeBrandConfig.authPagesCarouselConfig.ctaTxtColors[1],
      hover: {
        backgroundColor: '#dcc125',
        boxShadow: '0 3px 5px -1px #d1edf633, 0 5px 8px #d1edf624, 0 1px 14px #d1edf61f',
        transition: 'box-shadow .15s ease-out, background-color .15s ease-out'
      }
    },
    {
      image: config?.activeBrandConfig.authPagesCarouselConfig.imgs[2],
      buttonLabel: <FormattedMessage id={config?.activeBrandConfig.authPagesCarouselConfig.buttonLabels[2]} />,
      buttonLink: config?.activeBrandConfig.authPagesCarouselConfig.buttonLinks[2],
      pleft: config?.activeBrandConfig.authPagesCarouselConfig.ctaPositionsConfig.pleft[2],
      tp: config?.activeBrandConfig.authPagesCarouselConfig.ctaPositionsConfig.tp[2],
      colr: config?.activeBrandConfig.authPagesCarouselConfig.ctaBgColors[2],
      txt: config?.activeBrandConfig.authPagesCarouselConfig.ctaTxtColors[2],
      hover: {
        backgroundColor: '#dcc125',
        boxShadow: '0 6px 6px -3px #f6dd3c33, 0 10px 14px 1px #f6dd3c24, 0 4px 18px 3px #f6dd3c1f',
        transition: 'box-shadow .15s ease-out, background-color .15s ease-out'
      }
    },
  ] : null;

  const settings = {
    autoplay: true,
    autoplaySpeed: 5000,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    position : "relative",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    customPaging: (i) => <Box className="custom-dot" key={i}></Box>,
  };

  const customDotStyles = `
      .slick-dots {
        position: absolute;
        bottom: 5px; 
        width: 100%;
        gap: 1px;
        display: flex !important;
        justify-content: center;
        padding: 0;
      }
    
      .custom-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        opacity : 50%;
        background-color: white; 
        margin: 0 5px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.5s ease; 
      }
    
      .custom-dot:hover {
        background-color: white;
        transform: scale(1.2); 
      }
    
      .slick-active .custom-dot {
        background-color: white;
        transform: scale(1.5); 
       
      }
    
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }
    `;

  return (
    <>
      <Box
        position="fixed"
        top="0"
        left="0"
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
        <LangSelector />
      </Box>

      <Grid container backgroundColor="#fff" height="auto">
        <Grid
          item
          xs={12}
          sm={!config?.activeBrandConfig.authPagesCarouselConfig ? 12 : 6}
          lg={!config?.activeBrandConfig.authPagesCarouselConfig ? 12: 6}
        >
          <Outlet />
        </Grid>
        {isLargeScreen && config?.activeBrandConfig.authPagesCarouselConfig ? 
          <>
            <Grid item lg={6} sm={6} xs={0}>
              <style>{customDotStyles}</style>
              <Slider {...settings}>
                {slides.map((slide, index) => (
                  <Box key={index}>
                    <img
                      src={slide.image}
                      alt={`slide-${index}`}
                      style={{
                        height: '100vh',
                        paddingTop: "50px",
                        width: "100%",
                      }}
                    />
                    <Box
                      style={{
                        position: "absolute",
                        top: slide.tp,
                        paddingLeft: slide.pleft,
                      }}
                    >
                      <BtnY
                        variant="contained"
                        sx={{ backgroundColor: slide.colr, color: slide.txt, '&:hover': slide.hover }}
                        onClick={() => (window.location.href = slide.buttonLink)}
                      >
                        <Typography variant="h4">{slide.buttonLabel}</Typography>
                      </BtnY>
                    </Box>
                  </Box>
                ))}
              </Slider>
            </Grid>
          </> : <></>}
      </Grid>
    </>
  );
};

export default AuthCarouselLayout;
