import { getSession, useSession, signIn } from 'next-auth/client';

import { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import db from '../../firebase';
import CheckoutProduct from '../components/CheckoutProduct';
import { selectCartItems } from '../slices/cartSlice';
import { useRouter } from 'next/router';
import Payment from '../components/Payment';
import Image from 'next/image';

const Checkout = () => {
  const router = useRouter();

  const [session] = useSession();
  const [payment, setPayment] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [warn, setWarn] = useState('');
  const [coupon, setCoupon] = useState('');
  const [name, setName] = useState(
    session?.user.name ? session?.user.name : ''
  );
  const [email] = useState(session?.user.email);
  const [total, setTotal] = useState(Number);
  const [totalCart, setTotalCart] = useState(Number);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    shipping: 'Sellect',
    city: '',
    apartment: '',
    postal: '',
    phone: '',
  });

  const { address, shipping, city, apartment, postal, phone } = shippingAddress;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const [cartlist, setCartlist] = useState([]);

  const localCart = useSelector(selectCartItems);

  useEffect(() => {
    const totalCart = cartlist?.reduce(
      (total, item) => total + Number(item.price * item.quantity),
      0
    );
    setTotalCart(totalCart);

    const shippingCost = shipping === 'Outside Dhaka' ? 100 : 60;
    setTotal(totalCart + shippingCost);
  }, [cartlist, shipping]);

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

  const proceedToPayment = (e) => {
    e.preventDefault();
    if (cartlist.length === 0) {
      return setWarn('You have no item in the cart!');
    }
    if (
      name &&
      email &&
      shipping !== 'Sellect' &&
      address &&
      city &&
      phone &&
      postal &&
      !phoneError
    ) {
      setWarn('');
      setPayment(true);
    } else {
      setWarn('Please fill out all the required fields.');
    }
  };

  useEffect(() => {
    if (
      name &&
      email &&
      shipping !== 'Sellect' &&
      address &&
      city &&
      phone &&
      postal
    ) {
      setWarn('');
    }
  }, [name, email, shipping, address, city, phone, postal]);

  useEffect(() => {
    if (phone.length === 0) {
      return setPhoneError('');
    }
    if (phone[0] === '0') {
      if (phone.length !== 11) {
        setPhoneError('Please enter a valid phone number!');
      } else {
        setPhoneError('');
      }
    } else if (phone[0] === '1') {
      if (phone.length !== 10) {
        setPhoneError('Please enter a valid phone number!');
      } else {
        setPhoneError('');
      }
    } else {
      setPhoneError('Please enter a valid phone number!');
    }
  }, [phone]);
  if (!session)
    return (
      <div className='max-w-screen-2xl mx-auto text-gray-700'>
        <div className='lg:flex justify-between items-center mt-4 sm:mt-12 sm:mb-20 mx-5 sm:mx-0'>
          <div className='hidden sm:block space-y-7 w-1/3 text-left '>
            <h4 className='text-4xl font-semibold mb-2'>
              Please Login to Checkout.
            </h4>
            <p className='text-2xl leading-relaxed'>
              It helps you keep track of your orders.
            </p>
            <div>
              <button
                className='button font-semibold text-2xl'
                onClick={signIn}
              >
                Sign in or Sign up
              </button>
            </div>
          </div>
          <div className='sm:w-[55%]'>
            <Image
              src='/undraw_Login_re_4vu2.svg'
              alt='Please Login'
              height={1500}
              width={2000}
              objectFit='contain'
            />
          </div>
          <div className='sm:hidden text-center space-y-4 mt-6'>
            <h4 className='text-lg leading-none text-zakvan_red-dark'>
              Please Login to Checkout.
            </h4>
            <p className='text-sm'>It helps you keep track of your orders.</p>
            <button className='button-alt' onClick={signIn}>
              Sign in or Sign up
            </button>
          </div>
        </div>
      </div>
    );
  return (
    <main className='max-w-screen-2xl mx-auto text-gray-700 mt-4 sm:p-1'>
      <div className='mt-10 sm:mt-0'>
        <div>
          <div className='px-4 sm:px-0'>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>
              {payment ? 'Payment' : 'Shipping address'}
            </h3>
            <p className='mt-1 text-sm text-gray-600'>
              {payment
                ? 'All transactions are secure and encrypted.'
                : 'Use a permanent address where you can receive mail.'}
            </p>
          </div>
        </div>
        <div className='mt-10 md:grid md:grid-cols-7 md:gap-6'>
          {!payment ? (
            <div className='mt-5 md:mt-0 md:col-span-4'>
              <form>
                <div className='relative overflow-hidden sm:rounded-md'>
                  <div className='px-4 py-5 bg-white sm:p-0 sm:mr-6'>
                    <div className='grid grid-cols-6 gap-6'>
                      <div className='col-span-6'>
                        <label
                          htmlFor='name'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Name<span className='text-zakvan_red-dark'>*</span>
                        </label>
                        <input
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          type='text'
                          name='name'
                          id='name'
                          autoComplete='given-name'
                          className='mt-1 p-3 transition duration-300 focus:ring-zakvan_red-dark focus:border-zakvan_red-dark block w-full shadow-sm sm:text-sm border-gray-300 rounded-full'
                        />
                      </div>

                      <div className='col-span-6 sm:col-span-3'>
                        <label
                          htmlFor='email'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Email address
                          <span className='text-zakvan_red-dark'>*</span>
                        </label>
                        <input
                          required
                          value={email}
                          readOnly={true}
                          type='text'
                          name='email'
                          id='email'
                          autoComplete='email'
                          className='mt-1 p-3 focus:ring-0 focus:border-gray-300 cursor-default bg-gray-50 block w-full shadow-sm sm:text-sm border-gray-300 rounded-full'
                        />
                      </div>

                      <div className='relative col-span-6 sm:col-span-3'>
                        <label
                          htmlFor='phone'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Phone<span className='text-zakvan_red-dark'>*</span>
                        </label>
                        <div className='flex'>
                          <span className='inline-flex items-center mt-1 px-3 rounded-l-full border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'>
                            +880
                          </span>
                          <input
                            required
                            value={phone}
                            onChange={handleChange}
                            type='text'
                            name='phone'
                            id='phone'
                            autoComplete='phone'
                            className='mt-1 p-3 transition duration-300 focus:ring-zakvan_red-dark focus:border-zakvan_red-dark block w-full shadow-sm sm:text-sm border-gray-300 rounded-r-full'
                          />
                        </div>
                        <p className='absolute -bottom-7 right-0 text-yellow-500'>
                          {phoneError}
                        </p>
                      </div>

                      <div className='col-span-6'>
                        <label
                          htmlFor='address'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Address<span className='text-zakvan_red-dark'>*</span>
                        </label>
                        <input
                          required
                          value={address}
                          onChange={handleChange}
                          type='text'
                          name='address'
                          id='address'
                          autoComplete='street-address'
                          className='mt-1 p-3 transition duration-300 focus:ring-zakvan_red-dark focus:border-zakvan_red-dark block w-full shadow-sm sm:text-sm border-gray-300 rounded-full'
                        />
                      </div>

                      <div className='col-span-6 sm:col-span-3'>
                        <label
                          htmlFor='apartment'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Apartment, suite, etc. (optional)
                        </label>
                        <input
                          value={apartment}
                          onChange={handleChange}
                          type='text'
                          name='apartment'
                          id='apartment'
                          className='mt-1 p-3 transition duration-300 focus:ring-zakvan_red-dark focus:border-zakvan_red-dark block w-full shadow-sm sm:text-sm border-gray-300 rounded-full'
                        />
                      </div>

                      <div className='col-span-6 sm:col-span-3'>
                        <label
                          htmlFor='postal'
                          className='block text-sm font-medium text-gray-700'
                        >
                          ZIP / Postal
                          <span className='text-zakvan_red-dark'>*</span>
                        </label>
                        <input
                          required
                          value={postal}
                          onChange={handleChange}
                          type='text'
                          name='postal'
                          id='postal'
                          autoComplete='postal-code'
                          className='mt-1 p-3 transition duration-300 focus:ring-zakvan_red-dark focus:border-zakvan_red-dark block w-full shadow-sm sm:text-sm border-gray-300 rounded-full'
                        />
                      </div>
                      <div className='col-span-6 sm:col-span-3'>
                        <label
                          htmlFor='shipping'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Shipping location
                          <span className='text-zakvan_red-dark'>*</span>
                        </label>
                        <select
                          value={shipping}
                          onChange={handleChange}
                          id='shipping'
                          name='shipping'
                          autoComplete='shipping'
                          className='mt-1 p-3 transition duration-300 block w-full border border-gray-300 bg-white rounded-full shadow-sm focus:outline-none focus:ring-zakvan_red-dark focus:border-zakvan_red-dark sm:text-sm'
                        >
                          <option>Sellect</option>
                          <option>Inside Dhaka</option>
                          <option>Outside Dhaka</option>
                        </select>
                      </div>
                      <div className='col-span-6 sm:col-span-3'>
                        <label
                          htmlFor='city'
                          className='block text-sm font-medium text-gray-700'
                        >
                          City<span className='text-zakvan_red-dark'>*</span>
                        </label>
                        <input
                          required
                          value={city}
                          onChange={handleChange}
                          type='text'
                          name='city'
                          id='city'
                          autoComplete='city'
                          className='mt-1 p-3 transition duration-300 focus:ring-zakvan_red-dark focus:border-zakvan_red-dark block w-full shadow-sm sm:text-sm border-gray-300 rounded-full'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='mt-10 mb-3 text-right sm:pr-6 flex items-center justify-between'>
                    <div
                      className='link hover:text-zakvan_red-dark text-lg font-medium flex items-center'
                      onClick={() => router.push('/cart')}
                    >
                      <ArrowLeftIcon className='h-6 mr-1' /> Go back
                    </div>
                    <button
                      onClick={proceedToPayment}
                      className={`${
                        name &&
                        email &&
                        shipping !== 'Sellect' &&
                        address &&
                        city &&
                        phone &&
                        postal &&
                        !phoneError
                          ? 'button'
                          : 'button-alt'
                      }`}
                    >
                      Proceed to payment
                    </button>
                  </div>
                  <p className='absolute bottom-14 text-yellow-500 right-0 sm:pr-6'>
                    {warn}
                  </p>
                </div>
              </form>
            </div>
          ) : (
            <div className='mt-5 md:mt-0 md:col-span-4'>
              <Payment
                setPayment={setPayment}
                name={name}
                email={email}
                shippingAddress={shippingAddress}
                cartlist={cartlist}
                total={total}
              />
            </div>
          )}

          <div className='col-span-3 ml-3'>
            <div className='border-b pb-2'>
              {cartlist?.map((item) => (
                <CheckoutProduct
                  key={item.id}
                  id={item.id}
                  prodId={item.prodId}
                  title={item.title}
                  price={item.price}
                  quantity={item.quantity}
                  selectedColor={item.selectedColor}
                  selectedSize={item.selectedSize}
                  images={item.images}
                />
              ))}
            </div>

            <div className='flex items-center py-6 border-b space-x-3'>
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder='Enter coupon code here'
                className='p-3 pl-4 bg-gray-100 focus:ring-0 border-none rounded-full flex-grow'
                type='text'
              />
              <button className={`${!coupon ? 'button-alt' : 'button'}`}>
                Apply
              </button>
            </div>

            <div className='py-6 border-b space-y-2'>
              <div className='flex'>
                <p className='flex-grow'>Subtotal</p>
                <p className='font-semibold'>BDT {totalCart}</p>
              </div>
              <div className='flex'>
                <p className='flex-grow'>Shipping</p>
                <p className='font-semibold'>
                  {shipping === 'Outside Dhaka' ? 'BDT 100' : 'BDT 60'}
                </p>
              </div>
              <div className='flex'>
                <p className='flex-grow'>Taxes</p>
                <p className='font-semibold'>Included</p>
              </div>
            </div>

            <div className='py-6'>
              <div className='flex'>
                <p className='flex-grow'>Total</p>
                <p className='text-xl font-semibold'>BDT {total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
