import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import db from '../../firebase';
import Image from 'next/image';
import { selectCartItems } from '../slices/cartSlice';
import { useSelector } from 'react-redux';
import CartProduct from '../components/CartProduct';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';

const Cart = () => {
  const router = useRouter();
  const [session] = useSession();

  const [cartlist, setCartlist] = useState([]);

  const localCart = useSelector(selectCartItems);

  useEffect(() => {
    if (session) {
      setCartlist([]);
      const cart = db
        .collection('users')
        .doc(session?.user.email)
        .collection('cart')
        .onSnapshot((snapshot) => {
          const cart = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCartlist(cart);
        });
      return () => cart();
    } else {
      setCartlist(localCart);
    }
  }, [session, localCart]);

  return (
    <main className='max-w-screen-2xl mx-auto mt-2 sm:mt-7 text-gray-700 sm:mb-12'>
      {cartlist?.length > 0 && (
        <h1 className='text-xl sm:text-4xl font-semibold pb-2 mx-4 sm:mx-0 '>
          Shopping Cart
        </h1>
      )}
      <div className='flex flex-col bg-white mt-2 sm:mt-8 pb-[4.5rem] sm:pb-0'>
        {cartlist?.length === 0 && (
          <div className='lg:flex justify-between items-center mt-4 sm:mt-12 sm:mb-20 mx-5 sm:mx-0'>
            <div className='hidden sm:block space-y-7 w-1/3 text-left '>
              <h4 className='text-4xl font-semibold mb-2'>
                Your cart feels lonely.
              </h4>
              <p className='text-2xl leading-relaxed'>
                Your shopping cart lives to serve. Give it purpose - fill it
                with amazing merchandises. and make it happy.
              </p>
              <div>
                <button
                  className='button font-semibold text-2xl'
                  onClick={() => router.push('/')}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
            <div className='sm:w-[55%]'>
              <Image
                src='/undraw_empty_cart_co35.svg'
                alt='Empty cart'
                height={1500}
                width={2000}
                objectFit='contain'
              />
            </div>
            <div className='sm:hidden text-center space-y-4 mt-6'>
              <h4 className='text-lg leading-none text-zakvan_red-dark'>
                Your cart feels lonely.
              </h4>
              <p className='text-sm'>
                Fill it with amazing merchandises. and make it happy.
              </p>
              <button className='button-alt' onClick={() => router.push('/')}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        <div>
          {cartlist?.map((item) => (
            <CartProduct
              key={item.id}
              id={item.id}
              prodId={item.prodId}
              title={item.title}
              price={item.price}
              quantity={item.quantity}
              selectedColor={item.selectedColor}
              selectedSize={item.selectedSize}
              category={item.category}
              images={item.images}
            />
          ))}
        </div>

        {cartlist?.length !== 0 && (
          <div>
            <div className='hidden sm:flex justify-between items-center font-medium text-xl mt-4'>
              <p
                className='link hover:text-zakvan_red-dark flex items-center'
                onClick={() => router.push('/')}
              >
                <ArrowLeftIcon className='h-6 mr-1' /> Keep Shopping
              </p>
              <div className='flex items-center space-x-5'>
                <p className='leading-none text-center'>
                  Subtotal:{' '}
                  <span className='text-2xl font-semibold'>
                    ৳
                    {cartlist?.reduce(
                      (total, item) =>
                        total + Number(item.price * item.quantity),
                      0
                    )}
                  </span>
                </p>
                <button
                  className='button flex text-xl items-center'
                  onClick={() => router.push('/checkout')}
                >
                  Checkout <ArrowRightIcon className='h-5 ml-2' />
                </button>
              </div>
            </div>
            <div className='fixed bottom-0 w-screen sm:hidden font-semibold'>
              <div className='p-2 px-5 flex items-center justify-between bg-gray-100'>
                <p>Subtotal:</p>
                <p>
                  ৳
                  {cartlist?.reduce(
                    (total, item) => total + Number(item.price * item.quantity),
                    0
                  )}
                </p>
              </div>
              <div
                className=' bg-zakvan_red-dark p-3 text-white text-center transition duration-300 hover:bg-gray-100 hover:text-gray-700'
                onClick={() => router.push('/checkout')}
              >
                <p>Checkout</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
