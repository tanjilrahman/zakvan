import Head from 'next/head';
import { useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import db from '../../firebase';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Product from '../components/Product';
import { useSelector } from 'react-redux';
import { selectItems } from '../slices/wishSlice';

const Wishlist = () => {
  const [session] = useSession();
  const router = useRouter();

  const [wishlist, setWishlist] = useState([]);

  const localWish = useSelector(selectItems);

  useEffect(() => {
    if (session) {
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
    } else {
      setWishlist(localWish);
    }
  }, [session]);

  return (
    <div>
      <Head>
        <title>Zakvan | Wishlist</title>
      </Head>
      <main className='max-w-screen-2xl mx-auto text-gray-700 mt-2 sm:mt-7 mb-10 sm:mb-32'>
        {wishlist?.length > 0 && (
          <h1 className='text-xl sm:text-4xl font-semibold pb-2 mx-4 sm:mx-0 '>
            Wishlist
          </h1>
        )}

        {wishlist?.length === 0 && (
          <div className='lg:flex justify-between items-center mt-4 sm:mt-12 sm:mb-20 mx-5 sm:mx-0'>
            <div className='hidden sm:block space-y-7 w-1/3 text-left '>
              <h4 className='text-4xl font-semibold mb-2'>It's empty here.</h4>
              <p className='text-2xl leading-relaxed'>
                Something's catching your eye? Add your favorite items to
                Wishlist, and check them out anytime you wish.
              </p>
              <div>
                <button
                  className='button font-semibold text-2xl'
                  onClick={() => router.push('/')}
                >
                  Go Shopping
                </button>
              </div>
            </div>
            <div className='sm:w-[55%]'>
              <Image
                src='/undraw_Wishlist_re_m7tv.svg'
                alt='Wishlist'
                height={1500}
                width={2000}
                objectFit='contain'
              />
            </div>
            <div className='sm:hidden text-center space-y-4 mt-6'>
              <h4 className='text-lg leading-none text-zakvan_red-dark'>
                It's empty here.
              </h4>
              <p className='text-sm'>
                Something's catching your eye? Add your favorite items to
                Wishlist, and check them out anytime you wish.
              </p>
              <button className='button-alt' onClick={() => router.push('/')}>
                Go Shopping
              </button>
            </div>
          </div>
        )}
        <div className='grid mx-2 sm:mx-0 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {wishlist?.map(({ id, title, price, category, images }) => (
            <div key={id} className='mx-2 my-1 sm:mr-5 sm:my-5'>
              <Product
                id={id}
                title={title}
                price={price}
                category={category}
                images={images}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
