import { forwardRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material';
import { useAuthAdapter } from '../../providers/AuthProvider.jsx';

const headerSX = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' },
};

const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow = true,
      children,
      subheader,
      content = true,
      contentSX = {
        p: '16px'
      },
      darkTitle,
      divider = true,
      elevation,
      secondary,
      shadow,
      sx = {},
      title,
      codeHighlight = false,
      codeString,
      modal = false,
      ...others
    },
    ref
  ) => {
    const adapter = useAuthAdapter();
    const themeContrast = adapter?.themeContrast ? adapter.themeContrast : false;

    return (
      <Card
        elevation={elevation || 0}
        ref={ref}
        {...others}
        sx={{
          position: 'relative',
          border: border ? '1px solid' : 'none',
          borderRadius: '4px',
          borderColor: theme.palette.divider,
          ...(((themeContrast && boxShadow) || shadow) && {
            boxShadow: shadow ? shadow : theme.customShadows.z1,
          }),
          ...(codeHighlight && {
            '& pre': {
              m: 0,
              p: '12px !important',
              fontFamily: theme.typography.fontFamily,
              fontSize: '0.75rem',
            },
          }),
          ...(modal && {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: `calc( 100% - 50px)`, sm: 'auto' },
            '& .MuiCardContent-root': {
              overflowY: 'auto',
              minHeight: 'auto',
              maxHeight: `calc(100vh - 200px)`,
            },
          }),
          ...sx,
        }}
      >
        {/* card header and action */}
        {!darkTitle && title && (
          <CardHeader
            sx={headerSX}
            titleTypographyProps={{ variant: 'subtitle1' }}
            title={title}
            action={secondary}
            subheader={subheader}
          />
        )}
        {darkTitle && title && (
          <CardHeader sx={headerSX} title={<Typography variant="h4">{title}</Typography>} action={secondary} />
        )}

        {/* content & header divider */}
        {title && divider && <Divider />}

        {/* card content */}
        {content && <CardContent sx={contentSX}>{children}</CardContent>}
        {!content && children}

        {/* card footer - clipboard & highlighter  */}
        {codeString && (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Highlighter codeString={codeString} codeHighlight={codeHighlight} />
          </>
        )}
      </Card>
    );
  }
);

export default MainCard;
