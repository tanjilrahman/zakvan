import Image from 'next/image';
import Link from 'next/link';

const CheckoutProduct = ({
  prodId,
  title,
  price,
  quantity,
  selectedColor,
  selectedSize,
  images,
}) => {
  return (
    <div className='flex mb-1 sm:mb-5 items-center text-sm sm:text-lg'>
      <div className='mr-2 sm:mr-5 w-14 sm:w-20'>
        <Link href={`/products/${prodId}`}>
          <a>
            <Image
              src={images[0]}
              height={150}
              width={130}
              objectFit='cover'
              className='rounded-xl sm:rounded-2xl cursor-pointer'
            />
          </a>
        </Link>
      </div>

      <div className='flex flex-col flex-grow w-[45%] sm:w-3/5'>
        <Link href={`/products/${prodId}`}>
          <a>
            <p className='uppercase link font-semibold line-clamp-1'>{title}</p>
          </a>
        </Link>

        <div className='flex items-center space-x-1 sm:space-x-2'>
          <div
            className='h-5 w-5 sm:h-6 sm:w-6 relative rounded-full border-2 border-gray-400 '
            style={{
              backgroundColor: selectedColor,
            }}
          />
          {selectedSize && (
            <div>
              <p>{selectedSize}</p>
            </div>
          )}
        </div>
      </div>
      <div>
        <p className='font-semibold leading-tight'>৳{price}</p>
        <p className='text-right leading-tight'>x{quantity}</p>
      </div>
    </div>
  );
};

export default CheckoutProduct;
