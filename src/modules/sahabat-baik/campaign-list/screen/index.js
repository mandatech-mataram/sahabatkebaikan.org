import { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Loading from '@material-ui/core/CircularProgress';
import CampaignBox from 'components/CampaignBox';
import { Button } from '@material-ui/core';
import { useInfiniteLoad } from 'libs/hooks/useInfiniteLoad';
import CampaignBoxSkeleton from 'components/CampaignBoxSkeleton';
import DataNotFound from 'components/DataNotFound';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    background: theme.palette.background.paper,
    marginBottom: 100,
    padding: '16px 16px',
    marginTop: 8,
  },
  campaignImage: {
    objectFit: 'fill',
    width: 140,
    height: 90,
    borderRadius: 6,
    cursor: 'pointer',
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
  buttonDonasi: {
    borderRadius: 5,
    marginLeft: 'auto',
    height: 33,
    // width: 100,
    fontSize: 12,
    fontWeight: 400,
  },
  author: {
    fontSize: 10,
    fontWeight: 400,
  },
  fundedTitle: {
    fontSize: 10,
    fontWeight: 400,
  },
  fundedValue: {
    fontSize: 11,
    fontWeight: 600,
  },
}));

const CampaignList = ({ profile }) => {
  const classes = useStyles();
  const [params] = useState({
    _page: 1,
    _pageSize: 7,
    _sort: 'created_at',
    _order: 'DESC',
    _q: '',
    _category_id: '',
    _published: true,
    _is_active: true,
    _campaigner_id: profile ? profile.id : null,
  });

  const {
    data,
    isFetching,
    error,
    isLoadingInitialData,
    isReachingEnd,
    loadMore,
  } = useInfiniteLoad('/campaigns', params);

  return (
    <Box className={classes.root}>
      <Typography variant="subtitle2" style={{ marginBottom: 16 }}>
        Campaign aktif oleh penggalang ini
      </Typography>

      {isLoadingInitialData ? (
        [1, 2, 3, 4].map((i) => <CampaignBoxSkeleton key={i} />)
      ) : data?.length ? (
        data.map((campaign) => (
          <CampaignBox key={campaign.id} campaign={campaign} />
        ))
      ) : error ? (
        <p style={{ color: 'red' }}>{error.message}</p>
      ) : (
        <DataNotFound />
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

      {!isReachingEnd && (
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
      )}
    </Box>
  );
};

CampaignList.propTypes = {
  profile: PropTypes.object,
};

export default CampaignList;
