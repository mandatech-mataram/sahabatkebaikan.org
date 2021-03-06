import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  donationStatus: {
    borderRadius: 20,
    marginLeft: 4,
    height: 25,
    width: 80,
    fontSize: 9,
    fontWeight: 400,
    cursor: 'default',
    textTransform: 'capitalize',
  },
  paid: {
    color: '#41CE34',
    border: '1px solid #41CE34',
  },
  pending: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    border: '1px solid',
  },
  cancelled: {
    color: '#868686',
    border: '1px solid #868686',
  },
  expired: {
    color: '#d32323',
    border: '1px solid #d32323',
  },
}));

function formatStatus(status) {
  switch (status) {
    case 'paid':
      return 'Berhasil';
    case 'pending':
      return 'Tertunda';
    case 'cancelled':
      return 'Dibatalkan';
    case 'expired':
      return 'Expired';

    default:
      break;
  }
}

const CampaignStatus = ({ status }) => {
  const classes = useStyles();

  return (
    <Button
      variant="outlined"
      className={clsx(classes.donationStatus, {
        [classes.paid]: status === 'paid',
        [classes.pending]: status === 'pending',
        [classes.cancelled]: status === 'cancelled',
        [classes.expired]: status === 'expired',
      })}
    >
      {formatStatus(status)}
    </Button>
  );
};

CampaignStatus.propTypes = {
  status: PropTypes.string,
};

export default CampaignStatus;
