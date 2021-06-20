import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Banner = ({ banners }) => {
  return (
    <div className='mb-4 mx-4 sm:mx-0'>
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showThumbs={false}
        interval={5000}
        showArrows={false}
      >
        {banners?.map((banner) => (
          <div key={banner.id}>
            <Image
              className='rounded-2xl sm:rounded-[2rem]'
              src={banner.banner}
              height={900}
              width={2000}
              alt=''
              objectFit='cover'
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
