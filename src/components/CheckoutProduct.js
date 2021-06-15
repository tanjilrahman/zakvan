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
    <div className='flex mb-5 items-center'>
      <Link href={`/products/${prodId}`}>
        <a>
          <Image
            src={images[0]}
            height={80}
            width={80}
            objectFit='cover'
            className='rounded-xl cursor-pointer'
          />
        </a>
      </Link>

      <div className='mx-5 flex flex-col flex-grow'>
        <Link href={`/products/${prodId}`}>
          <a>
            <p className='uppercase link text-lg font-semibold line-clamp-1'>
              {title}
            </p>
          </a>
        </Link>

        <div className='flex items-center space-x-2'>
          <div
            className='h-6 w-6 relative rounded-full border-2 border-gray-400 '
            style={{
              backgroundColor: selectedColor,
            }}
          />
          {selectedSize && (
            <div>
              <p className='text-lg'>{selectedSize}</p>
            </div>
          )}
        </div>
      </div>
      <div>
        <p className='font-semibold text-lg leading-tight'>৳{price}</p>
        <p className='text-lg text-right leading-tight'>x{quantity}</p>
      </div>
    </div>
  );
};

export default CheckoutProduct;
