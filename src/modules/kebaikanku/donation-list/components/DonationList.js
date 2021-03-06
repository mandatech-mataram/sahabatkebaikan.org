import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Box from '@material-ui/core/Box';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Loading from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CampaignBoxSkeleton from 'components/CampaignBoxSkeleton';
import CampaignStatus from './CampaignStatus';
import useInfiniteLoadDonations from '../hooks/useInfiniteLoadDonations';
import DataNotFound from 'components/DataNotFound';
import Image from 'next/image';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    background: theme.palette.background.paper,
    marginBottom: 100,
    display: 'flex',
    flexDirection: 'column',
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  groupHeader: {
    background: theme.palette.background.default,
  },
  image: {
    maxWidth: 190,
    marginRight: 8,
  },
  img: {
    borderRadius: 8,
  },
  campaignTitle: {
    fontSize: 12,
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '-webkit-line-clamp': 2,
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    cursor: 'pointer',
  },
  donationStatus: {
    borderRadius: 20,
    marginLeft: 4,
    height: 25,
    width: 80,
    fontSize: 9,
    fontWeight: 400,
    cursor: 'default',
  },
}));

const DonationList = ({ status }) => {
  const classes = useStyles();
  const [params] = useState({
    _page: 1,
    _pageSize: 10,
    _sort: 'created_at',
    _order: 'DESC',
    _q: '',
    _campaign_id: '',
    _status: status || null,
  });
  const router = useRouter();
  let message = '';

  switch (status) {
    case 'pending':
      message = 'Alhamdulillah. Tidak ada donasi yang tertunda.';
      break;
    case 'paid':
      message =
        'Wah belum ada donasimu yang berhasil nih. Yuk klik tab donasi di tengah bawah lalu selesaikan donasimu!';
      break;
    case 'expired':
      message = 'Alhamdulillah belum ada donasimu yang gagal.';
      break;
    default:
      message = 'Maaf, tidak ada data ditemukan.';
      break;
  }

  const {
    data,
    isFetching,
    error,
    isLoadingInitialData,
    isReachingEnd,
    loadMore,
  } = useInfiniteLoadDonations('/donations/group-by-month', params);

  return (
    <div className={classes.root}>
      {isLoadingInitialData ? (
        [1, 2, 3, 4, 5, 6].map((i) => <CampaignBoxSkeleton key={i} />)
      ) : data?.length ? (
        data.map((group, i) => (
          <div key={i}>
            <Box
              display="flex"
              justifyContent="space-between"
              px={2}
              py={1}
              className={classes.groupHeader}
            >
              <Typography variant="caption">
                {group.month} ~{' '}
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(group.total_donation_amount)}
              </Typography>
              <Typography variant="caption">
                {group.total_donation} Donasi
              </Typography>
            </Box>
            {group.donations.map((donation, i) => (
              <Box key={i} m={2}>
                <Grid
                  container
                  style={{ margin: '16px 0' }}
                  onClick={() =>
                    router.push(
                      `/campaign/${donation.campaign.slug}/summary/${donation.id}`
                    )
                  }
                >
                  <Grid item xs={4}>
                    <ButtonBase className={classes.image}>
                      <Image
                        alt={donation.campaign.title}
                        src={
                          donation.campaign.images[0]?.url ||
                          'https://via.placeholder.com/600x400?text=No%20Image'
                        }
                        className={classes.img}
                        placeholder="blur"
                        blurDataURL={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAABCAYAAAAb4BS0AAAAD0lEQVR42mMM9Q6tZ4ACAA8YAXYxKl3dAAAAAElFTkSuQmCC`}
                        width={160}
                        height={90}
                      />
                    </ButtonBase>
                  </Grid>
                  <Grid item container xs>
                    <Grid item xs container direction="column">
                      <Grid item xs>
                        <Typography
                          gutterBottom
                          variant="subtitle1"
                          className={classes.campaignTitle}
                        >
                          {donation.campaign.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(donation.donation_amount)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <CampaignStatus status={donation.status} />
                    </Grid>
                  </Grid>
                </Grid>
                <Divider />
              </Box>
            ))}
          </div>
        ))
      ) : error ? (
        <div style={{ marginTop: 50 }}>
          <DataNotFound message={error.message} />
        </div>
      ) : (
        <div style={{ marginTop: 50 }}>
          <DataNotFound message={message} />
        </div>
      )}

      {isFetching && !isLoadingInitialData && (
        <Box
          width="100%"
          mt={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Loading color="secondary" size={20} />
        </Box>
      )}

      {!isReachingEnd && data.length ? (
        <Box
          width="100%"
          mt={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button onClick={loadMore} disabled={isFetching} color="secondary">
            Muat lagi
          </Button>
        </Box>
      ) : null}
    </div>
  );
};

DonationList.propTypes = {
  status: PropTypes.string,
};

export default DonationList;
