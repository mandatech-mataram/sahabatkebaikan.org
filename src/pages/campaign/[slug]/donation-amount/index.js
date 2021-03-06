import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/ChevronLeft';
import Header from 'components/Header';
import Layout from 'components/Layout';
import Loading from 'components/Loading';
import DonationAmountScreen from 'modules/donation-process/choose-donation-amount';
import { getCampaignDetail } from 'services/campaign.service';
import * as fbq from 'libs/fbpixel';

const useStyles = makeStyles(() => ({
  headerRoot: {
    borderBottom: 'solid 1px lightgrey',
    // borderBottomColor: theme.palette.background.default,
    // boxShadow: '0px 1px 6px rgba(0, 0, 0, 0.25)',
  },
}));

const DonationAmount = ({ slug }) => {
  const classes = useStyles();
  const { data, isFetching, error } = getCampaignDetail(slug);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    if (data?.campaigner?.pixel_id) {
      fbq.init(data.campaigner.pixel_id);
      fbq.pageview(data.campaigner.pixel_id);
      fbq.event('AddToCart', data.campaigner.pixel_id, {
        content_name: data.title,
        value: 100000,
        currency: 'IDR',
        campaign_url: `${window.location.origin}/campaign/${slug}`,
        source: window.location.hostname,
      });
    }
    // if (!localStorage.getItem('token')) {
    //   router.push(`/login?redirect=/campaign/${slug}`);
    // }
  }, [data]);

  return (
    <Layout
      header={
        <Header
          title="Tentukan Nominal Donasi"
          color="inherit"
          elevation={0}
          TitleProps={{ variant: 'body1', align: 'center' }}
          classes={{
            root: classes.headerRoot,
          }}
          icon={<BackIcon />}
          backButton={true}
        />
      }
    >
      {data ? (
        <DonationAmountScreen campaign={data} />
      ) : (
        error && (
          <div>
            <p>Tidak dapat menampilkan campaign</p>
          </div>
        )
      )}
      <Loading open={isFetching} hideBackdrop />
    </Layout>
  );
};

export async function getServerSideProps({ params }) {
  return {
    props: {
      slug: params.slug,
    },
  };
}

DonationAmount.propTypes = {
  slug: PropTypes.string,
};

export default DonationAmount;
