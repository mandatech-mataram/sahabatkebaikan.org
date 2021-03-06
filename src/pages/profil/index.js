import { useEffect, useState } from 'react';
import Router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';
import Header from 'components/Header';
import Layout from 'components/Layout';
import ProfileInfo from 'modules/profile/info/screen';
import NotLoggedIn from 'modules/profile/not-logged-in/screen';
import MenuItem from 'modules/profile/menu-item/screen';
import { getProfile } from 'services/auth.service';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const ProfileSkeleton = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box style={{ height: 110, width: 110 }}>
        <Skeleton variant="circle" width={110} height={110} />
      </Box>

      <Skeleton variant="text" width="100%" height={40} animation="wave" />
      <Skeleton variant="text" width="100%" height={40} animation="wave" />
      <Skeleton variant="text" width="100%" height={40} animation="wave" />
      <Skeleton variant="text" width="100%" height={40} animation="wave" />
      <Skeleton variant="text" width="100%" height={40} animation="wave" />
    </div>
  );
};

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const getProfileData = async () => {
    setIsLoading(true);
    if (localStorage.getItem('token') && localStorage.getItem('data_login')) {
      try {
        const dataLogin = JSON.parse(localStorage.getItem('data_login'));

        const data = await getProfile(dataLogin.user.id);

        setProfile(data);
      } catch (_) {
        localStorage.removeItem('token');
        localStorage.removeItem('data_login');
        Router.push('/login?redirect=profil');
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    getProfileData();
  }, []);

  return (
    <>
      <Layout menu={2} withBottomNav header={<Header title="Profil Saya" />}>
        {isLoading ? (
          <ProfileSkeleton />
        ) : !profile ? (
          <NotLoggedIn />
        ) : (
          <ProfileInfo profile={profile} />
        )}
        <MenuItem profile={profile} />
      </Layout>
    </>
  );
};

export default ProfilePage;
