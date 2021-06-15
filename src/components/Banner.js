import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Banner = () => {
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
        <div>
          <Image
            className='rounded-2xl sm:rounded-[2rem]'
            src='/118797367_143549834106996_2094012716175767341_n.jpg'
            height={900}
            width={2000}
            alt=''
            objectFit='cover'
          />
        </div>
        <div>
          <Image
            className='rounded-2xl sm:rounded-[2rem]'
            height={900}
            width={2000}
            src='/26398.jpg'
            alt=''
            objectFit='cover'
          />
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
