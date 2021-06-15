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
        <title>Zakvan</title>
      </Head>
      <main className='max-w-screen-2xl mx-auto text-gray-700 mt-4'>
        <h1 className='text-3xl font-bold border-b pb-4'>Bookmarks</h1>
        {wishlist?.length === 0 && (
          <div className='lg:flex items-center'>
            <div className='flex-grow'>
              <Image
                src='/No wish-02.svg'
                height={500}
                width={1000}
                objectFit='cover'
              />
            </div>

            <div className='p-10 bg-gray-100 rounded-3xl flex flex-col h-64 w-1/3'>
              <h4 className='text-xl font-bold mb-2'>It's empty here.</h4>
              <p className='flex-grow'>
                Something's catching your eye? Add your favorite items to
                Bookmarks, and check them out anytime you wish.
              </p>
              <button className='button' onClick={() => router.push('/')}>
                Go Shopping
              </button>
            </div>
          </div>
        )}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 mt-3'>
          {wishlist?.map(({ id, title, price, category, images }) => (
            <Product
              key={id}
              id={id}
              title={title}
              price={price}
              category={category}
              images={images}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
