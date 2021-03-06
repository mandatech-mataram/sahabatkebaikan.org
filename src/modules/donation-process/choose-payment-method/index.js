import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// import Loading from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

import useGetList from 'libs/hooks/useGetList';
import { useRouter } from 'next/router';
import { useDonation } from 'context/donation.context';
import { createDonation } from 'services/donation.service';
import { useToast } from 'libs/toast';
import Loading from 'components/Loading';
import PayWithZipayWallet from '../pay-with-zipay-wallet';
import DataNotFound from 'components/DataNotFound';
import * as fbq from 'libs/fbpixel';
import { createAffiliateConversion } from 'services/affiliate.service';
import Image from 'next/image';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    background: theme.palette.background.paper,
    '& > *': {
      margin: '8px 0',
    },
  },
  bankIcon: {
    // width: 48,
    // height: 32,
    // objectFit: 'contain',
    borderRadius: 8,
  },
}));

const PaymentMethod = () => {
  const classes = useStyles();
  const router = useRouter();
  const { donationValue, setDonationValue } = useDonation();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openPayWithZipayWallet, setOpenPayWithZipayWallet] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleClosePayWithZipayWallet = () => {
    setOpenPayWithZipayWallet(false);
  };

  const { slug } = router.query;

  const { data, error, isFetching } = useGetList('/payment-methods', {
    _page: 1,
    _pageSize: 10,
    _sort: 'code',
    _order: 'ASC',
    _q: '',
  });

  // console.log('paymentMethod', data);
  const handleSelectPaymentMethod = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setDonationValue({
      ...donationValue,
      payment_method: paymentMethod,
    });
    if (paymentMethod.code === 'zipay-wallet') {
      setOpenPayWithZipayWallet(true);
    } else {
      setOpenConfirmDialog(true);
    }
  };

  const handleCreateDonation = async () => {
    handleCloseConfirmDialog();
    setDonationValue({
      ...donationValue,
      payment_method_id: selectedPaymentMethod.id,
    });

    try {
      setIsLoading(true);

      const data = await createDonation(
        donationValue.full_name,
        donationValue.email,
        donationValue.phone,
        donationValue.campaign_id,
        donationValue.donation_amount,
        donationValue.infaq_amount,
        donationValue.is_anonymous,
        donationValue.note,
        selectedPaymentMethod.id
      );

      setIsLoading(false);
      if (data.donation_payment.redirect_url) {
        openInNewTab(data.donation_payment.redirect_url);
      }

      if (donationValue.campaign?.campaigner?.pixel_id) {
        fbq.init(donationValue.campaign.campaigner.pixel_id);
        fbq.event('Purchase', donationValue.campaign.campaigner.pixel_id, {
          content_name: donationValue.campaign.title,
          value: donationValue.donation_amount + donationValue.infaq_amount,
          donation_value: donationValue.donation_amount,
          infaq_value: donationValue.infaq_amount,
          currency: 'IDR',
          campaign_url: `${window.location.origin}/campaign/${slug}`,
          source: window.location.hostname,
        });
      }

      // create affiliate conversion
      try {
        const affiliateId = Cookies.get('affiliateId');
        if (affiliateId) {
          await createAffiliateConversion(affiliateId, data.id);
        }
      } catch (error) {
        toast.showMessage(error.message, 'error');
      }

      router.push(`/campaign/${slug}/summary/${data.id}`);
    } catch (error) {
      if (error.response) {
        toast.showMessage(error.response.data.message, 'error');
      } else if (error.request) {
        toast.showMessage('Network Error', 'error');
      } else {
        toast.showMessage(error.message, 'error');
      }
      setIsLoading(false);
    }
  };

  const openInNewTab = (url) => {
    const win = window.open(url, '_blank');
    win.focus();
  };

  useEffect(() => {
    if (slug) {
      if (donationValue && !donationValue.campaign_id) {
        router.push(`/campaign/${slug}/donation-amount`);
      }
    }
  }, [slug]);

  return (
    <Box className={classes.root}>
      <Grid container style={{ background: '#DEDEDE', padding: 14, margin: 0 }}>
        <Typography variant="body2">Pembayaran Instan</Typography>
      </Grid>
      <List component="nav" aria-label="transfer-payment">
        {isFetching ? (
          <Loading open hideBackdrop />
        ) : data?.length ? (
          data
            .filter(
              (paymentMethod) =>
                paymentMethod.is_enabled &&
                (paymentMethod.payment_gateway.code === 'zipay' ||
                  paymentMethod.name === 'QRIS')
            )
            .map((paymentMethod) => (
              <ListItem
                key={paymentMethod.id}
                button
                style={{ paddingLeft: 24 }}
                onClick={() => handleSelectPaymentMethod(paymentMethod)}
              >
                <ListItemIcon>
                  {/* <img
                    className={classes.bankIcon}
                    alt="bank-icon"
                    src={paymentMethod.image} */}
                  <Image
                    alt="bank-icon"
                    src={paymentMethod.image}
                    width={48}
                    height={32}
                    quality={60}
                    className={classes.bankIcon}
                    placeholder="blur"
                    blurDataURL={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAABCAYAAAAb4BS0AAAAD0lEQVR42mMM9Q6tZ4ACAA8YAXYxKl3dAAAAAElFTkSuQmCC`}
                  />
                </ListItemIcon>
                <Box ml={1}>
                  <Typography variant="body2">
                    {paymentMethod.name === 'QRIS'
                      ? 'QRIS (dapat digunakan di m-banking semua bank, ShopeePay, OVO, Gopay, DANA, dll)'
                      : paymentMethod.name}
                  </Typography>
                </Box>
              </ListItem>
            ))
        ) : error ? (
          <p style={{ color: 'red' }}>{error.message}</p>
        ) : (
          <DataNotFound />
        )}
      </List>

      <Grid container style={{ background: '#DEDEDE', padding: 14, margin: 0 }}>
        <Typography variant="body2">
          Transfer Bank (diverifikasi otomatis)
        </Typography>
      </Grid>

      <List component="nav" aria-label="transfer-payment">
        {isFetching ? (
          <Loading open hideBackdrop />
        ) : data?.length ? (
          data
            .filter(
              (paymentMethod) =>
                paymentMethod.is_enabled &&
                paymentMethod.payment_gateway.code === 'moota'
            )
            .map((paymentMethod) => (
              <ListItem
                key={paymentMethod.id}
                button
                style={{ paddingLeft: 24 }}
                onClick={() => handleSelectPaymentMethod(paymentMethod)}
              >
                <ListItemIcon>
                  <img
                    className={classes.bankIcon}
                    alt="bank-icon"
                    src={paymentMethod.image}
                  />
                </ListItemIcon>
                <Box ml={1}>
                  <Typography variant="body2">
                    {paymentMethod.name === 'QRIS'
                      ? 'QRIS (dapat digunakan di ShopeePay, OVO, Gopay, DANA, dll)'
                      : paymentMethod.name}
                  </Typography>
                </Box>
              </ListItem>
            ))
        ) : error ? (
          <p style={{ color: 'red' }}>{error.message}</p>
        ) : (
          <DataNotFound />
        )}
      </List>

      {/* <Grid container style={{ background: '#DEDEDE', padding: 14, margin: 0 }}> */}
      {/*   <Typography variant="body2"> */}
      {/*     Bayar dengan Flip (diverifikasi otomatis) */}
      {/*   </Typography> */}
      {/* </Grid> */}
      <List
        component="nav"
        aria-label="transfer-payment"
        style={{ marginTop: -20 }}
      >
        {isFetching ? (
          <Loading open hideBackdrop />
        ) : data?.length ? (
          data
            .filter(
              (paymentMethod) =>
                paymentMethod.is_enabled &&
                paymentMethod.payment_gateway.code === 'flip'
            )
            .map((paymentMethod) => (
              <ListItem
                key={paymentMethod.id}
                button
                style={{ paddingLeft: 24 }}
                onClick={() => handleSelectPaymentMethod(paymentMethod)}
              >
                <ListItemIcon>
                  <img
                    className={classes.bankIcon}
                    alt="bank-icon"
                    src={paymentMethod.image}
                    width={40}
                    height={40}
                  />
                </ListItemIcon>
                <Box ml={1}>
                  <Typography variant="body2">
                    {/* {paymentMethod.name === 'QRIS' */}
                    {/*   ? 'QRIS (dapat digunakan di ShopeePay, OVO, Gopay, DANA, dll)' */}
                    {/*   : paymentMethod.name} */}
                    {/* via{' '}
                      {paymentMethod.payment_gateway.name} */}
                    {paymentMethod.name === 'QRIS'
                      ? 'QRIS (dapat digunakan di ShopeePay, OVO, Gopay, DANA, dll)'
                      : paymentMethod.payment_gateway.code === 'flip'
                      ? 'Transfer dari berbagai bank melalui Flip'
                      : paymentMethod.payment_gateway.name}
                  </Typography>
                  {/* <Typography variant="caption" color="textSecondary">
                  Bayar dengan saldo Dompet Kebaikan Anda
                </Typography> */}
                </Box>
              </ListItem>
            ))
        ) : error ? (
          <p style={{ color: 'red' }}>{error.message}</p>
        ) : (
          <DataNotFound />
        )}
      </List>

      <Grid container style={{ background: '#DEDEDE', padding: 14, margin: 0 }}>
        <Typography variant="body2">
          Virtual Account (diverifikasi otomatis)
        </Typography>
      </Grid>
      <List component="nav" aria-label="transfer-payment">
        {isFetching ? (
          <Loading open hideBackdrop />
        ) : data?.length ? (
          data
            .filter(
              (paymentMethod) =>
                paymentMethod.is_enabled &&
                paymentMethod.payment_gateway.code === 'oy' &&
                paymentMethod.name !== 'QRIS'
            )
            .map((paymentMethod) => (
              <ListItem
                key={paymentMethod.id}
                button
                style={{ paddingLeft: 24 }}
                onClick={() => handleSelectPaymentMethod(paymentMethod)}
              >
                <ListItemIcon>
                  <img
                    className={classes.bankIcon}
                    alt="bank-icon"
                    src={paymentMethod.image}
                  />
                </ListItemIcon>
                <Box ml={1}>
                  <Typography variant="body2">
                    {paymentMethod.name === 'QRIS'
                      ? 'QRIS (dapat digunakan di ShopeePay, OVO, Gopay, DANA, dll)'
                      : paymentMethod.name}
                    {/* via{' '}
                      {paymentMethod.payment_gateway.name} */}
                  </Typography>
                  {/* <Typography variant="caption" color="textSecondary">
                  Bayar dengan saldo Dompet Kebaikan Anda
                </Typography> */}
                </Box>
              </ListItem>
            ))
        ) : error ? (
          <p style={{ color: 'red' }}>{error.message}</p>
        ) : (
          <DataNotFound />
        )}
      </List>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        maxWidth="xs"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>{`Anda yakin membayar dengan ${selectedPaymentMethod?.name} via ${selectedPaymentMethod?.payment_gateway?.name}?`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Anda tidak dapat mengubah cara pembayaran setelah memilihnya.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Ganti</Button>
          <Button
            onClick={handleCreateDonation}
            variant="contained"
            color="secondary"
          >
            Ya
          </Button>
        </DialogActions>
      </Dialog>

      <PayWithZipayWallet
        open={openPayWithZipayWallet}
        onClose={handleClosePayWithZipayWallet}
      />

      <Loading open={isLoading} hideBackdrop />
    </Box>
  );
};

export default PaymentMethod;
