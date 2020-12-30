import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import formatCurrency from 'utils/formatCurrency';
import getValue from 'utils/getValueOfLinearProgress';

const useStyles = makeStyles(() => ({
  root: {
    margin: '16px 0',
  },
  campaignImage: {
    borderRadius: 8,
    objectFit: 'fill',
    width: '100%',
    maxWidth: 140,
    height: 105,
    cursor: 'pointer',
  },
  campaignTitle: {
    fontSize: 12,
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '-webkit-line-clamp': 3,
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    cursor: 'pointer',
  },
  buttonDonasi: {
    borderRadius: 5,
    // margin: 4,
    height: 33,
    // width: 100,
    fontSize: 12,
    fontWeight: 400,
  },
  author: {
    fontSize: 10,
    fontWeight: 400,
  },
  fundedDaysLeftTitle: {
    fontSize: 10,
    fontWeight: 400,
  },
  fundedDaysLeftValue: {
    fontSize: 11,
    fontWeight: 600,
  },
}));

const CampaignBox = ({ campaign }) => {
  const classes = useStyles();
  const router = useRouter();

  const handleDonateBtn = () => {
    if (localStorage.getItem('token')) {
      router.push({
        pathname: '/campaign/[slug]/donation-amount',
        query: { slug: campaign.slug },
      });
    } else {
      router.push(`/login`);
    }
  };

  return (
    <>
      <Grid container className={classes.root}>
        <Grid item>
          <ButtonBase
            onClick={() =>
              router.push({
                pathname: '/campaign/[slug]',
                query: { slug: campaign.slug },
              })
            }
          >
            <img
              src={
                campaign.images[0]?.url ||
                'https://via.placeholder.com/600x400?text=No%20Image'
              }
              className={classes.campaignImage}
              alt=""
              aria-hidden="true"
            />
          </ButtonBase>
        </Grid>
        <Grid item container xs direction="column" style={{ marginLeft: 8 }}>
          <Grid item container style={{ padding: 0 }}>
            <Grid item xs>
              <Typography
                variant="body2"
                gutterBottom
                className={classes.campaignTitle}
                onClick={() =>
                  router.push({
                    pathname: '/campaign/[slug]',
                    query: { slug: campaign.slug },
                  })
                }
              >
                {campaign.title}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                color="secondary"
                variant="contained"
                className={classes.buttonDonasi}
                // onClick={() =>
                //   router.push({
                //     pathname: '/campaign/[slug]/donation-amount',
                //     query: { slug: campaign.slug },
                //   })
                // }
                onClick={handleDonateBtn}
              >
                Donasi
              </Button>
            </Grid>
          </Grid>
          <Typography className={classes.author} gutterBottom>
            {campaign.campaigner.full_name}
          </Typography>
          <LinearProgress
            value={getValue(campaign.donation_funded, campaign.donation_target)}
            variant="determinate"
            style={{ margin: '4px 0' }}
          />

          <Grid item container>
            <Grid item xs container direction="column">
              <Typography className={classes.fundedDaysLeftTitle} gutterBottom>
                Terkumpul
              </Typography>
              <Typography className={classes.fundedDaysLeftValue}>
                Rp {formatCurrency.format(campaign.donation_funded)}
              </Typography>
            </Grid>
            <Grid item xs container direction="column">
              <Typography
                className={classes.fundedDaysLeftTitle}
                align="right"
                gutterBottom
              >
                Sisa hari
              </Typography>
              <Typography className={classes.fundedDaysLeftValue} align="right">
                {campaign.is_never_end ? (
                  <span style={{ fontSize: 18 }}>∞</span>
                ) : (
                  campaign.days_left
                )}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
    </>
  );
};

CampaignBox.propTypes = {
  campaign: PropTypes.object,
};

export default CampaignBox;
