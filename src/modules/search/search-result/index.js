import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CampaignBox from 'components/CampaignBox';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 16,
    background: theme.palette.background.paper,
  },
}));

const SearchResult = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {campaigns.map((campaign) => (
        <CampaignBox key={campaign.id} campaign={campaign} />
      ))}
    </Box>
  );
};

export default SearchResult;

const campaigns = [
  {
    id: 1,
    title: 'Bahagiakan Ribuan Mustahiq di Karawang Melalui Zakat Anda',
    images: [
      'https://sahabatkebaikan.org/wp-content/uploads/2020/07/zakatKu-1.jpg',
    ],
    target: 1000000,
    funded: 500000,
    daysLeft: 28,
    author: 'Baitul MaalKu',
  },
  {
    id: 2,
    title:
      'Yuk Ikut Distribusi 10.000 Wakaf Al-Qur’an untuk Santri dan Masyarakat Muslim di Pelosok Karawang dan Jawa Barat',
    images: [
      'https://sahabatkebaikan.org/wp-content/uploads/2020/07/wakaf-Al-Quran.png',
    ],
    target: 90000000,
    funded: 11200000,
    daysLeft: 77,
    author: 'Baitul MaalKu',
  },
  {
    id: 3,
    title:
      'Bantu Anak-anak Dhuafa di Karawang untuk Memenuhi Kebutuhan Biaya Pendidikan Mereka',
    images: [
      'https://sahabatkebaikan.org/wp-content/uploads/2020/07/Beasiswa-AmanahKu.jpg',
    ],
    target: 32100000,
    funded: 3400000,
    daysLeft: 120,
    author: 'Baitul MaalKu',
  },
  {
    id: 4,
    title:
      'INBox – Infaq Nasi Box untuk Jama’ah Shalat Jum’at di Masjid Pelosok dan Pesisir Karawang',
    images: [
      'https://sahabatkebaikan.org/wp-content/uploads/2020/10/20201008_152909.jpg',
    ],
    target: 5400000,
    funded: 5390000,
    daysLeft: 23,
    author: 'Baitul MaalKu',
  },
];
