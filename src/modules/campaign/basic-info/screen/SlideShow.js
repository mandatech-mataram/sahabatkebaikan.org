import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import PropTypes from 'prop-types';
import { Carousel } from 'react-responsive-carousel';
import ReactPlayer from 'react-player';
import { bool } from 'prop-types';
import Image from 'next/image';

// eslint-disable-next-line no-unused-vars
const VideoSlide = ({ url, isSelected }) => (
  <ReactPlayer width="100%" url={url} height={250} />
);

const ImageSlide = ({ url }) => (
  <div style={{ minHeight: 225, width: '100%' }}>
    <Image
      alt=""
      src={url}
      layout="fill"
      quality={60}
      placeholder="blur"
      blurDataURL={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAABCAYAAAAb4BS0AAAAD0lEQVR42mMM9Q6tZ4ACAA8YAXYxKl3dAAAAAElFTkSuQmCC`}
    />
  </div>
);

const SlideShow = ({ images = [], videos = [] }) => {
  const items = [...videos, ...images];

  const customRenderItem = (item, props) => (
    <item.type {...item.props} {...props} />
  );

  const itemsComponent = items.length ? (
    items.map((item, i) =>
      item.type === 'video' ? (
        <VideoSlide key={i} url={item.url} />
      ) : (
        <ImageSlide key={i} url={item.url} />
      )
    )
  ) : (
    <ImageSlide url="https://via.placeholder.com/600x400?text=No%20Image" />
  );

  // const getVideoThumb = (videoId) =>
  //   `https://img.youtube.com/vi/${videoId}/default.jpg`;

  // const getVideoId = (url) =>
  //   url.substr('https://youtu.be/'.length, url.length);

  // const customRenderThumb = (children) =>
  //   children.map((item, i) => {
  //     const videoId = getVideoId(item.props.url);
  //     return <img key={i} src={getVideoThumb(videoId)} alt="" />;
  //   });
  return (
    <Carousel
      renderItem={customRenderItem}
      // autoPlay
      // renderThumbs={customRenderThumb}
      // renderThumbs={false}
      showArrows={items.length > 1}
      showStatus={false}
      showIndicators={items.length > 1}
      showThumbs={false}
    >
      {itemsComponent}
    </Carousel>
  );
};

VideoSlide.propTypes = {
  url: PropTypes.string,
  isSelected: bool,
};

ImageSlide.propTypes = {
  url: PropTypes.string,
};

export default SlideShow;
