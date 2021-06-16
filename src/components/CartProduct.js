import { TrashIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import db from '../../firebase';
import { removeFromCart, updateCart } from '../slices/cartSlice';

const CartProduct = ({
  id,
  prodId,
  title,
  price,
  quantity,
  category,
  selectedColor,
  selectedSize,
  images,
}) => {
  const [session] = useSession();
  const [cartQuantity, setCartQuantity] = useState(quantity);
  const dispatch = useDispatch();

  useEffect(() => {
    if (session) {
      db.collection('users')
        .doc(session?.user.email)
        .collection('cart')
        .doc(id)
        .update({
          quantity: cartQuantity,
        });
    } else {
      dispatch(updateCart({ id, quantity: cartQuantity }));
    }
  }, [cartQuantity]);

  const removeItem = () => {
    if (session) {
      db.collection('users')
        .doc(session?.user.email)
        .collection('cart')
        .doc(id)
        .delete();
    } else {
      dispatch(removeFromCart({ id }));
    }
  };

  return (
    <div className='flex mb-3 sm:mb-6 mx-5 sm:mx-0 border-b pb-3 sm:pb-6 items-center'>
      <div className='mr-2 sm:mr-5 w-16 sm:w-auto'>
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
      <div className='text-sm sm:text-xl w-[45%] sm:w-3/5'>
        <Link href={`/products/${prodId}`}>
          <a>
            <p className='link font-semibold text-sm sm:text-2xl line-clamp-1'>
              {title}
            </p>
          </a>
        </Link>
        <div className='sm:flex text-gray-500'>
          <div className='flex items-center space-x-1'>
            <h4>Color:</h4>
            <div
              className='h-5 w-5 relative rounded-full border-2 border-gray-300 '
              style={{
                backgroundColor: selectedColor,
              }}
            />
          </div>
          {selectedSize && (
            <div className='flexspace-x-1 sm:ml-2 flex items-center'>
              <h4>Size:</h4>
              <p className='ml-2'>{selectedSize}</p>
            </div>
          )}
        </div>
      </div>
      <div className='ml-auto space-y-2 sm:space-y-0'>
        <div className='flex items-center space-x-2 sm:space-x-0'>
          <div className='flex items-center'>
            <div className=' font-bold text-xs md:text-lg border border-zakvan_red-dark uppercase text-zakvan_red-dark rounded-full'>
              <button
                className='py-2 px-2 sm:px-4 rounded-l-3xl hover:bg-gray-200 focus:outline-none'
                onClick={() => {
                  if (quantity === 1) return removeItem();
                  setCartQuantity((prev) => prev - 1);
                }}
              >
                -
              </button>
              <span className='p-2'>{quantity}</span>
              <button
                className='py-2 px-2 sm:px-4 rounded-r-3xl hover:bg-gray-200 focus:outline-none'
                onClick={() => {
                  setCartQuantity((prev) => prev + 1);
                }}
              >
                +
              </button>
            </div>
          </div>
          <p className='font-semibold hidden sm:block text-xl w-20 sm:w-56 text-center'>
            ৳{price}
          </p>
          <div
            onClick={removeItem}
            className='border border-zakvan_red-dark p-2 rounded-full hover:text-zakvan_red-dark hover:bg-white bg-zakvan_red-dark text-white cursor-pointer transition duration-300 ease-in-out hidden sm:block'
          >
            <TrashIcon className='h-4 sm:h-6' />
          </div>
        </div>
        <p className='font-semibold sm:hidden text-sm text-right'>৳{price}</p>
      </div>
    </div>
  );
};

export default CartProduct;
