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
    <div className='max-w-screen-lg mx-auto grid grid-cols-5 mb-6 border-b pb-6 mr-10'>
      <Link href={`/products/${prodId}`}>
        <a>
          <Image
            src={images[0]}
            height={250}
            width={200}
            objectFit='cover'
            className='rounded-3xl cursor-pointer'
          />
        </a>
      </Link>

      <div className='col-span-4 mx-5 flex flex-col'>
        <div className='text-xl flex flex-col flex-grow'>
          <Link href={`/products/${prodId}`}>
            <a>
              <p className='uppercase link'>{title}</p>
            </a>
          </Link>

          <p className='font-bold'>
            BDT {price} x{quantity}
          </p>
        </div>

        <div className='mt-6 space-y-1'>
          <h4 className='font-bold uppercase'>Color:</h4>
          <div
            className='h-8 w-8 relative rounded-full border-4 border-gray-300 '
            style={{
              backgroundColor: selectedColor,
            }}
          />
        </div>
        {selectedSize && (
          <div className='flex mt-2 space-y-1 items-center'>
            <h4 className='font-bold uppercase'>Size:</h4>
            <p className='font-bold ml-2'>{selectedSize}</p>
          </div>
        )}
        <div className='flex items-center mt-4'>
          <div className=' font-bold text-xs md:text-lg border border-zakvan_red-dark uppercase text-zakvan_red-dark rounded-full'>
            <button
              className='py-2 px-4 rounded-l-3xl hover:bg-gray-200 focus:outline-none'
              onClick={() => {
                if (quantity === 1) return removeItem();
                setCartQuantity((prev) => prev - 1);
              }}
            >
              -
            </button>
            <span className='p-2'>{quantity}</span>
            <button
              className='py-2 px-4 rounded-r-3xl hover:bg-gray-200 focus:outline-none'
              onClick={() => {
                setCartQuantity((prev) => prev + 1);
              }}
            >
              +
            </button>
          </div>
          <div
            onClick={removeItem}
            className='border border-zakvan_red-dark p-[0.6rem] ml-3 rounded-full hover:text-zakvan_red-dark hover:bg-white bg-zakvan_red-dark text-white cursor-pointer transition duration-300 ease-in-out'
          >
            <TrashIcon className='h-6' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
