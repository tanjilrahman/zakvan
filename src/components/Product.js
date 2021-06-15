import Image from 'next/image';
import { HeartIcon, InformationCircleIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import db from '../../firebase';
import { useSession } from 'next-auth/client';
import { useDispatch, useSelector } from 'react-redux';
import { addToList, removeFromList, selectItems } from '../slices/wishSlice';
import Link from 'next/link';

const Product = ({ id, title, price, category, images }) => {
  const [session] = useSession();
  const dispatch = useDispatch();
  const [react, setReact] = useState(Boolean);
  const [loaded, setLoaded] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [wishlist, setWishlist] = useState(undefined);
  const localWish = useSelector(selectItems);

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
  }, [react]);

  return (
    <div
      onMouseOver={() => setHovering(true)}
      onMouseOut={() => setHovering(false)}
      className='relative mx-2 my-1 sm:m-5'
    >
      {!loaded && (
        <span className='animate-ping absolute z-30 h-6 w-6 top-1/2 left-1/2 -mt-3 -ml-3 rounded-full bg-zakvan_red-dark opacity-75'></span>
      )}
      <Image
        onLoad={() => setLoaded(true)}
        src={images[0]}
        height={600}
        width={500}
        objectFit='cover'
        className='rounded-xl sm:rounded-3xl bg-gray-100'
      />

      <div
        onClick={() => (react ? setReact(false) : setReact(true))}
        className={`
          absolute sm:hover:animate-bounce bottom-4 left-2 sm:bottom-5 sm:left-4 bg-white p-1 sm:p-2 rounded-full cursor-pointer ${
            react && 'animate-bounce'
          }
        `}
      >
        {react ? (
          <HeartIconSolid className='h-4 sm:h-6 text-zakvan_red' />
        ) : (
          <HeartIcon className='h-4 sm:h-6 text-gray-500' />
        )}
      </div>

      {/* <Link href={`/products/${id}`}>
        <div className='absolute bottom-4 right-2 bg-white p-1 rounded-full cursor-pointer sm:hidden'>
          <a>
            <InformationCircleIcon className='h-4 text-zakvan_red' />
          </a>
        </div>
      </Link> */}

      <Link href={`/products/${id}`}>
        <a>
          <div
            className={`absolute transform opacity-0 top-[62%] sm:top-[55%] left-1/2 ml-[-36px] sm:ml-[-64.16px] button-alt ring-0 transition duration-300 ease-in-out rounded-full ${
              hovering && 'opacity-100 -translate-y-10'
            }`}
          >
            Details
          </div>
        </a>
      </Link>
    </div>
  );
};

export default Product;
