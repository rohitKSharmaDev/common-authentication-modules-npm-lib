import React from "react";
import { Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout.jsx";
import AuthCarouselLayout from "./layouts/AuthCarouselLayout.jsx";
import AuthLayoutTwo from "./layouts/AuthLayoutTwo.jsx";

import LoginPage from "./pages/Login/LoginPage.jsx";
import SignUpPage from "./pages/SignUp/SignUpPage.jsx";
import Set2FA from "./pages/Set2FA/Set2fa.jsx";
// import ForgotPasswordPage from "./pages/ForgotPassword";
// import ResetPasswordPage from "./pages/ResetPassword";
// import TwoFactorPage from "./pages/TwoFactorAuth";
// import AcceptInvitation from "./pages/AcceptInvitation";
// import VerifyEmailPage from "./pages/VerifyEmail";
// import GLoginPage from "./pages/GLogin";

/**
 * createAuthRoutes(authAdapter)
 * - authAdapter.guards should contain guard components (GuestGuard, AuthGuard, SignUpGuard, InviteValidationGuard, etc.).
 * - The library owns layouts/pages and builds the auth route tree.
 *
 * Returns a route object compatible with react-router v6 `useRoutes`.
 */
export function createAuthRoutes(authAdapter) {
  if (!authAdapter || !authAdapter.guards) {
    throw new Error("createAuthRoutes requires authAdapter with guards");
  }

  const {
    GuestGuard = ({ children }) => <>{children}</>,
    SignUpGuard = ({ children }) => <>{children}</>,
    InviteValidationGuard = ({ children }) => <>{children}</>,
    // AuthGuard might be used for certain protected auth pages if needed
    AuthGuard = ({ children }) => <>{children}</>,
  } = authAdapter.guards;

  return {
    path: "/",
    element: <GuestGuard />, // 👈 guest guard wraps the whole auth tree
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />
      },
      {
        element: <AuthCarouselLayout />, // 👈 layout wraps the form area
        children: [
          {
            path: "login",
            element: <LoginPage />
          },
          {
            path: "signup",
            element: <SignUpGuard />, // 👈 guard as route element
            children: [
              {
                index: true,
                element: <SignUpPage />
              }
            ]
          }
        ]
      },
      // {
      //   path: "",
      //   element: <AuthLayout />,
      //   children: [
      //     {
      //       path: "forget-password",
      //       element: <ForgetPass />,
      //     },
      //   ]
      // },
      {
        path: '',
        element: <AuthLayoutTwo />,
        children: [
          {
            path: 'set-2fa',
            element: <Set2FA />
          }
        ]
      },
  ]
    // path: "/",
    // children: [
    //   {
    //     path: "",
    //     element: <GuestGuard />,
    //     children: [
    //       {
    //         path: "/",
    //         element: <Navigate to="/login" replace />
    //       },

    //       // Section: centered layout with forget-password
    //       // {
    //       //   path: "",
    //       //   element: <AuthLayout />,
    //       //   children: [
    //       //     {
    //       //       path: "forget-password",
    //       //       element: <ForgotPasswordPage />
    //       //     }
    //       //   ]
    //       // },

    //       // Section: alternate header layout for set-2fa and reset flows
    //       // {
    //       //   path: "",
    //       //   element: <AuthLayoutTwo />,
    //       //   children: [
    //       //     {
    //       //       path: "set-2fa",
    //       //       element: <TwoFactorPage />
    //       //     }
    //       //   ]
    //       // },

    //       // Section: carousel layout with signup + login
    //       {
    //         path: "",
    //         element: <AuthCarouselLayout />,
    //         children: [
    //           {
    //             path: "",
    //             element: <SignUpGuard />,
    //             children: [
    //               {
    //                 path: "signup",
    //                 element: <SignUpPage />
    //               }
    //             ]
    //           },
    //           {
    //             path: "login",
    //             element: <LoginPage />
    //           }
    //         ]
    //       },

    //       // oauth/google
    //       // {
    //       //   path: "oauth/google",
    //       //   element: <GLoginPage />
    //       // }
    //     ]
    //   },

    //   // accept-invite route wrapped by invite validation guard
    //   // {
    //   //   path: "accept-invite",
    //   //   element: (
    //   //     <InviteValidationGuard>
    //   //       <AcceptInvitation />
    //   //     </InviteValidationGuard>
    //   //   )
    //   // },

    //   // reset password & verify email under AuthLayoutTwo
    //   // {
    //   //   path: "",
    //   //   element: <AuthLayoutTwo />,
    //   //   children: [
    //   //     {
    //   //       path: "reset-password",
    //   //       element: <ResetPasswordPage />
    //   //     },
    //   //     {
    //   //       path: "verify-signup-email",
    //   //       element: <VerifyEmailPage />
    //   //     }
    //   //   ]
    //   // }
    // ]
  };
}
