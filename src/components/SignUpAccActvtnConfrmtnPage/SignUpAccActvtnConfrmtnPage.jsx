import { Stack, Box, Typography, Button, Link } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router';
import { useAuthContext } from "../../providers/AuthProvider.jsx";

const SignUpAccActvtnConfrmtnPage = ({pageFor}) => {
  const navigate = useNavigate();

  const { config } = useAuthContext();

  const handleRedirectLogin = async () => {
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: `calc(100vh)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '400px', pt: '65px', margin: '0 auto', textAlign: 'center' }}
    >
      <Box>
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path opacity="0.3" d="M50.88 25.5391L51.1127 22.9486L51.6363 17.0057L46.1091 15.6952L43.6654 15.1162L42.3854 12.861L39.5054 7.74096L34.2982 10.0571L32 11.0933L29.7018 10.0571L24.4945 7.71048L21.6145 12.8305L20.3345 15.0857L17.8909 15.6648L12.3636 16.9752L12.8872 22.8876L13.12 25.4781L11.4909 27.4591L7.73816 31.9695L11.4909 36.4495L13.12 38.4305L12.8872 41.021L12.3636 46.9943L17.8909 48.3048L20.3345 48.8838L21.6145 51.1391L24.4945 56.2286L29.6727 53.8819L32 52.8762L34.2982 53.9124L39.4763 56.259L42.3563 51.1391L43.6363 48.8838L46.08 48.3048L51.6073 46.9943L51.0836 41.0514L50.8509 38.461L52.48 36.48L56.2327 32L52.48 27.52L50.88 25.5391ZM26.4436 46.3848L15.3891 34.7733L19.6945 30.2629L26.4436 37.3638L43.4618 19.4743L47.7673 23.9848L26.4436 46.3848Z" fill="#2CA87F" />
          <path d="M64 31.9695L56.9018 23.4667L57.8909 12.221L47.3891 9.7219L41.8909 0L32 4.44952L22.1091 0L16.6109 9.7219L6.10909 12.1905L7.09818 23.4667L0 31.9695L7.09818 40.4724L6.10909 51.7486L16.6109 54.2476L22.1091 64L32 59.52L41.8909 63.9695L47.3891 54.2476L57.8909 51.7486L56.9018 40.5029L64 31.9695ZM52.5091 36.48L50.88 38.461L51.1127 41.0514L51.6364 46.9943L46.1091 48.3048L43.6655 48.8838L42.3855 51.139L39.5055 56.259L34.3273 53.9124L32 52.8762L29.7018 53.9124L24.5236 56.259L21.6436 51.1695L20.3636 48.9143L17.92 48.3352L12.3927 47.0248L12.9164 41.0514L13.1491 38.461L11.52 36.48L7.76727 32L11.52 27.4895L13.1491 25.5086L12.8873 22.8876L12.3636 16.9752L17.8909 15.6648L20.3345 15.0857L21.6145 12.8305L24.4945 7.71048L29.6727 10.0571L32 11.0933L34.2982 10.0571L39.4764 7.71048L42.3564 12.8305L43.6364 15.0857L46.08 15.6648L51.6073 16.9752L51.0836 22.9181L50.8509 25.5086L52.48 27.4895L56.2327 31.9695L52.5091 36.48Z" fill="#2CA87F" />
          <path d="M26.443 37.3333L19.6939 30.2324L15.3884 34.7733L26.443 46.3848L47.7957 23.9543L43.4902 19.4133L26.443 37.3333Z" fill="#2CA87F" />
        </svg>
      </Box>

      <Typography variant="h3" mt={'35px'}>
        {pageFor == 'signup' ? <FormattedMessage id="signUpSuccss" /> : <FormattedMessage id="accActSuccss" /> }
      </Typography>

      <Typography variant="body" mt={'30px'} fontWeight="bold">
        {pageFor == 'signup' ? <FormattedMessage id="signUpSuccssMsg" /> : <FormattedMessage id="accActSuccssMsg" />}
        
      </Typography>

      <Button variant="contained" fullWidth sx={{ height: '44px', mt: '20px' }} onClick={handleRedirectLogin}>
        <FormattedMessage id="sign-in" />
      </Button>

      {
        (config?.activeBrandConfig?.termsOfServiceLink && config?.activeBrandConfig?.privacyPolicyLink) ? 
          <Stack direction={'row'} spacing={.3} mt={'5px'}>
            <Typography variant="subtitle2">
              <FormattedMessage id="By signing up, you agree to our" />
            </Typography>
            <Typography variant="subtitle2">
              <Link href={config?.activeBrandConfig?.privacyPolicyLink} target="_blank" underline='hover'>
                <FormattedMessage id="privacy-policy" />
              </Link>
            </Typography>
            <Typography variant="subtitle2">&amp;</Typography>
            <Typography variant="subtitle2">
              <Link href={config?.activeBrandConfig?.termsOfServiceLink} target="_blank" underline='hover'>
                <FormattedMessage id="terms-of-service" />
              </Link>
            </Typography>
          </Stack>
        : <></>
      }

    </Box>
  );
};

export default SignUpAccActvtnConfrmtnPage;