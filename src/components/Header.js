import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { fade, withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

const styles = (theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  headerContent: {
    width: '100%',
    maxWidth: 446,
  },
  title: {
    flexGrow: 1,
  },
  search: {
    display: 'flex',
    borderRadius: 15,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(1)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: 14,
  },
  toolbarLarge: {
    // height: 90,
    // alignItems: 'center',
    // justifyContent: 'center',
    // // paddingTop: theme.spacing(1),
    // paddingBottom: theme.spacing(3),
  },
  dompet: {
    // flexGrow: 1,
    position: 'absolute',
    bottom: -28,
    width: '100%',
    // border: 'solid pink 2px',
  },
});

const CustomHeader = (props) => {
  const {
    classes,
    className,
    icon = false,
    title = '',
    searchbox = false,
    size = 'normal',
    dompet = false,
    color = 'primary',
    elevation = 0,
    backButton = false,
    IconButtonProps,
    TitleProps = {
      variant: 'h6',
      align: 'center',
    },
    SearchBoxProps = {
      value: '',
      onChange: () => {},
      onClick: () => {},
    },
    ...other
  } = props;

  const router = useRouter();
  const inputElement = useRef(null);

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, []);

  return (
    <AppBar
      position="sticky"
      color={color}
      elevation={elevation}
      className={clsx(classes.root, className)}
      {...other}
    >
      <Box className={classes.headerContent}>
        <Toolbar
          className={clsx({
            [classes.toolbarLarge]: size === 'large' || dompet,
          })}
        >
          {icon && (
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={() => backButton && router.back()}
              {...IconButtonProps}
            >
              {icon}
            </IconButton>
          )}

          {searchbox && (
            <div className={classes.search}>
              <InputBase
                placeholder={title}
                fullWidth
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                ref={inputElement}
                {...SearchBoxProps}
              />
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
            </div>
          )}

          {!searchbox && title && (
            <Typography className={classes.title} noWrap {...TitleProps}>
              {title}
            </Typography>
          )}

          {/* <div className={classes.grow} /> */}
        </Toolbar>
        {/* {dompet} */}
      </Box>
    </AppBar>
  );
};

CustomHeader.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.object,
  icon: PropTypes.node,
  title: PropTypes.string,
  searchbox: PropTypes.bool,
  size: PropTypes.oneOf(['normal', 'large']),
  dompet: PropTypes.node,
  color: PropTypes.string,
  elevation: PropTypes.number,
  backButton: PropTypes.bool,
  IconButtonProps: PropTypes.object,
  TitleProps: PropTypes.object,
  SearchBoxProps: PropTypes.object,
};

export default withStyles(styles)(CustomHeader);
