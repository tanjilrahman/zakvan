import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/client';
import shortUUID from 'short-uuid';
import db from '../../../firebase';
import Product from '../../components/Product';
import {
  HeartIcon,
  CheckIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import { addToList, removeFromList, selectItems } from '../../slices/wishSlice';
import { addToCart, selectCartItems } from '../../slices/cartSlice';

export default function ProductInfo({ productStr, relatedProductsStr }) {
  const [session] = useSession();
  const router = useRouter();

  const {
    id,
    title,
    description,
    price,
    category,
    colorset,
    availableSizes,
    images,
  } = JSON.parse(productStr);

  const relatedProducts = JSON.parse(relatedProductsStr);
  const addItemToCart = () => {
    const prodRef = cartlist?.find((doc) => {
      const prod = doc.prodId === id;
      const color = doc.selectedColor === selectedColor;
      const size = doc.selectedSize === selectedSize;

      return prod && color && size;
    });

    if (availableSizes && !selectedSize)
      return setWarning('Please select a size!');

    if (!selectedColor) return setWarning('Please pick a color!');

    if (prodRef) return setWarning('Product is already added to the cart!');

    if (session) {
      db.collection('users')
        .doc(session?.user.email)
        .collection('cart')
        .doc()
        .set({
          prodId: id,
          title,
          price,
          description,
          quantity,
          selectedColor,
          selectedSize,
          category,
          images,
        });
    } else {
      dispatch(
        addToCart({
          id: shortUUID.generate(),
          prodId: id,
          title,
          price,
          description,
          quantity,
          selectedColor,
          selectedSize,
          category,
          images,
        })
      );
    }
    setWarning('');
  };
  const [react, setReact] = useState(false);
  const [highlighted, setHighlighted] = useState(images[0]);
  const [loaded, setLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [warning, setWarning] = useState('');
  const [cartlist, setCartlist] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const localWish = useSelector(selectItems);
  const localCart = useSelector(selectCartItems);
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [highlighted]);

  useEffect(() => {
    if (session) {
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

  const [wishlist, setWishlist] = useState(undefined);

  useEffect(() => {
    const wish = db
      .collection('users')
      .doc(session?.user.email)
      .collection('wishlist')
      .onSnapshot((snapshot) => {
        const wish = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWishlist(wish);
      });
    return () => wish();
  }, []);

  useEffect(() => {
    if (session) {
      const reacted = wishlist?.find((doc) => doc.id === id);
      return reacted ? setReact(true) : setReact(false);
    } else {
      const reacted = localWish.find((doc) => doc.id === id);
      return reacted ? setReact(true) : setReact(false);
    }
  }, [wishlist, session]);

  useEffect(() => {
    if (session) {
      if (react) {
        return db
          .collection('users')
          .doc(session?.user.email)
          .collection('wishlist')
          .doc(id)
          .set({
            id,
            title,
            price,
            category,
            images,
          });
      }
      if (!react && wishlist !== undefined) {
        return db
          .collection('users')
          .doc(session?.user.email)
          .collection('wishlist')
          .doc(id)
          .delete();
      }
    } else {
      if (react && !localWish.find((wish) => wish.id === id)) {
        dispatch(addToList({ id, title, price, category, images }));
      }
      if (!react && localWish.find((wish) => wish.id === id)) {
        dispatch(removeFromList({ id }));
      }
    }
  }, [react, session]);

  useEffect(() => {
    setQuantity(1);
    setLoaded(false);
    setHighlighted(images[0]);
    setSelectedColor('');
    setSelectedSize('');
    setWarning('');
  }, [router.asPath]);

  const filteredRelatedProducts = relatedProducts.filter(
    (product) => product.id !== router.query.id
  );
  return (
    <div>
      <Head>
        <title>Zakvan | {title}</title>
      </Head>
      <main className='flex flex-col max-w-screen-2xl mx-auto text-gray-700 mb-20 sm:mb-40'>
        <div className='md:grid md:grid-cols-3'>
          <div className='md:col-span-2 mx-4 sm:mx-0'>
            {images.length === 1 ? (
              <div className='relative'>
                {!loaded && (
                  <span className='animate-ping absolute z-20 h-12 w-12 top-1/2 left-1/2 -mt-6 -ml-6 rounded-full bg-zakvan_red-dark opacity-75'></span>
                )}
                <Image
                  onLoad={() => setLoaded(true)}
                  src={highlighted}
                  height={1200}
                  width={1000}
                  objectFit='cover'
                  className='rounded-2xl sm:rounded-3xl bg-gray-100'
                />
              </div>
            ) : (
              <div className='sm:grid sm:grid-cols-6'>
                <div className='hidden sm:block mr-4'>
                  {images.map((image, i) => (
                    <div
                      key={i}
                      className='mb-2 relative transition duration-300 ease-in'
                    >
                      <Image
                        src={image}
                        height={300}
                        width={250}
                        objectFit='cover'
                        className='rounded-sm sm:rounded-2xl relative bg-gray-100 border-4 cursor-pointer '
                        onClick={() => {
                          setLoaded(false);
                          setHighlighted(image);
                        }}
                      />

                      <div
                        className={
                          highlighted === image
                            ? 'absolute top-0 h-[98%] w-full border-4 border-zakvan_red-dark rounded-sm sm:rounded-2xl transition duration-300 ease-in'
                            : undefined
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className='sm:col-span-5 relative'>
                  {!loaded && (
                    <span className='animate-ping absolute z-20 h-12 w-12 top-1/2 left-1/2 -mt-6 -ml-6 rounded-full bg-zakvan_red-dark opacity-75'></span>
                  )}
                  <Image
                    onLoad={() => setLoaded(true)}
                    src={highlighted}
                    height={950}
                    width={830}
                    objectFit='cover'
                    className='rounded-2xl sm:rounded-3xl bg-gray-100'
                  />
                </div>
                <div className='sm:hidden mt-1 mb-6 flex space-x-2'>
                  {images.map((image, i) => (
                    <div
                      key={i}
                      className='relative transition duration-300 ease-in'
                    >
                      <Image
                        src={image}
                        height={300}
                        width={250}
                        objectFit='cover'
                        className='rounded-2xl relative bg-gray-100 border-4 cursor-pointer '
                        onClick={() => {
                          setLoaded(false);
                          setHighlighted(image);
                        }}
                      />

                      <div
                        className={
                          highlighted === image
                            ? 'absolute top-0 h-[97%] w-full border-4 border-zakvan_red-dark rounded-2xl transition duration-300 ease-in'
                            : undefined
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className='mt-3 mx-4 sm:mx-0'>
            <h4 className='text-2xl sm:text-4xl mb-2'>{title}</h4>
            <p className='text-xl sm:text-3xl font-bold mb-10'>{price} BDT</p>
            <h4 className='text-sm sm:text-base font-bold uppercase'>
              Colors:
            </h4>
            <div className='flex space-x-2 my-2'>
              {colorset.map((color, i) => (
                <div
                  onClick={() => setSelectedColor(color)}
                  key={i}
                  className='h-8 w-8 relative rounded-full cursor-pointer hover:opacity-50 transition duration-200 ease-in-out border-4 border-gray-300'
                  style={{
                    backgroundColor: color,
                  }}
                >
                  {selectedColor === color ? (
                    <div className='absolute h-full w-full rounded-full bg-gray-100 opacity-50'>
                      <CheckIcon />
                    </div>
                  ) : undefined}
                </div>
              ))}
            </div>
            <p className='text-sm sm:text-base text-yellow-500'>
              {warning && warning}
            </p>
            <div className='text-xs sm:text-base'>
              <div className='sm:flex items-center justify-start sm:space-x-3 my-3'>
                <div className='flex items-center space-x-3 mb-3 sm:mb-0'>
                  {availableSizes && (
                    <div className='relative w-1/2 sm:w-auto font-medium'>
                      <label
                        htmlFor='sizes'
                        className='absolute top-4 leading-none sm:top-5 left-4 text-zakvan_red-dark'
                      >
                        Sizes:
                      </label>
                      <select
                        value={selectedSize}
                        onChange={(e) =>
                          setSelectedSize(e.target.value.toUpperCase())
                        }
                        id='sizes'
                        className='rounded-full w-full font-bold py-2 sm:py-4 pl-[4.3rem] leading-normal cursor-pointer border focus:border-zakvan_red-dark focus:ring-0 border-zakvan_red-dark uppercase'
                      >
                        <option hidden value=''></option>
                        {availableSizes?.map((size, i) => (
                          <option key={i} value={size.toUpperCase()}>
                            {size.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className='font-bold w-1/2 sm:w-auto flex justify-between text-xs md:text-lg border border-zakvan_red-dark uppercase text-zakvan_red-dark rounded-full'>
                    <button
                      className='py-3 px-5 rounded-l-3xl hover:bg-gray-200 focus:outline-none'
                      onClick={() =>
                        quantity > 1 && setQuantity((prev) => prev - 1)
                      }
                    >
                      -
                    </button>
                    <span className='p-3'>{quantity}</span>
                    <button
                      className='py-3 px-5 rounded-r-3xl hover:bg-gray-200 focus:outline-none'
                      onClick={() => setQuantity((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={addItemToCart}
                  className='button w-full sm:w-auto py-3 px-10 hover:bg-white border border-zakvan_red-dark'
                >
                  Add to Cart
                </button>
              </div>

              <div className='mb-6 flex justify-between sm:justify-start'>
                {availableSizes && (
                  <div className='flex items-center cursor-pointer space-x-1 hover:text-zakvan_red-dark sm:mr-36'>
                    <InformationCircleIcon className='h-6 sm:h-7' />
                    <p>Open sizes guide</p>
                  </div>
                )}

                <div
                  onClick={() => (react ? setReact(false) : setReact(true))}
                  className='cursor-pointer items-center space-x-1 inline-flex hover:text-zakvan_red-dark'
                >
                  {react ? (
                    <HeartIconSolid className='h-6 sm:h-7 text-zakvan_red' />
                  ) : (
                    <HeartIcon className='h-6 sm:h-7' />
                  )}
                  <p>Add to wishlist</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className='text-sm sm:text-base font-bold uppercase mb-2'>
                Description:
              </h4>
              <p className='text-xs sm:text-base whitespace-pre-wrap'>
                {description}
              </p>
            </div>
            <div className='mt-4'>
              <h4 className='text-sm sm:text-base font-bold uppercase mb-1'>
                Share:
              </h4>
              <div className='flex space-x-3 items-center'>
                <div className='h-5 w-5 sm:h-6 sm:w-6 mt-1 cursor-pointer'>
                  <img src='https://img.icons8.com/android/48/000000/facebook-new.png' />
                </div>
                <div className='h-5 w-6 sm:h-6 sm:w-7 cursor-pointer'>
                  <img src='https://img.icons8.com/material-sharp/48/000000/facebook-messenger--v1.png' />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-10 sm:mt-20'>
          <h4 className='text-xl sm:text-3xl font-bold mb-4 mx-4'>
            Related products
          </h4>
          <div className='grid mx-2 sm:mx-0 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filteredRelatedProducts.map(
              ({ id, title, price, category, images }) => (
                <div key={id} className='mx-2 my-1 sm:m-5'>
                  <Product
                    id={id}
                    title={title}
                    price={price}
                    category={category}
                    images={images}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const productRef = await db
    .collection('products')
    .doc(context.params.id)
    .get();

  const relatedProductsRef = await db
    .collection('products')
    .where('category', '==', productRef.data().category)
    .get();

  const product = {
    id: productRef.id,
    ...productRef.data(),
  };

  const relatedProducts = relatedProductsRef.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    props: {
      productStr: JSON.stringify(product),
      relatedProductsStr: JSON.stringify(relatedProducts),
      session,
    },
  };
}
