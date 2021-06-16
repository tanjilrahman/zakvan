import { SearchIcon, XCircleIcon } from '@heroicons/react/outline';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import db from '../../firebase';
import Banner from '../components/Banner';
import ProductFeed from '../components/ProductFeed';
import { scrollToView, selectScroll } from '../slices/categorySlice';

export default function Home({ products }) {
  const [search, setSearch] = useState('');
  const [searchedItems, setSearchedItems] = useState([]);
  const productsRef = useRef(null);
  const scroll = useSelector(selectScroll);
  const dispatch = useDispatch();

  const persedProducts = JSON.parse(products);

  useEffect(() => {
    if (scroll === true) {
      productsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      dispatch(scrollToView(false));
    }
  }, [scroll]);

  useEffect(() => {
    setSearchedItems(
      persedProducts?.filter((product) => {
        const matchedProduct = product?.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const hasInput = search.length > 0;

        return matchedProduct && hasInput;
      })
    );
  }, [search]);

  return (
    <div>
      <Head>
        <title>Zakvan</title>
      </Head>

      <main className='max-w-screen-2xl mx-auto mb-20 sm:mb-40'>
        <Banner />
        <div
          className='bg-gray-100 text-xs flex leading-tight relative sm:hidden items-center rounded-full mx-4'
          ref={productsRef}
        >
          <SearchIcon className='h-5 ml-3' />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search...'
            className='h-10 w-full bg-gray-100 focus:ring-0 border-none rounded-full px-2'
            type='text'
          />
          {searchedItems?.length > 0 && (
            <div>
              <div className='absolute w-screen z-10 bg-white shadow-lg border border-gray-200 rounded-2xl top-14 -right-4 max-h-[20rem] overflow-y-scroll text-gray-700'>
                <div className='hidden sm:block' aria-hidden='true'>
                  <div>
                    <div className='border-t mx-4 border-gray-200' />
                  </div>
                </div>
                {searchedItems?.map((item) => (
                  <div key={item.id}>
                    <Link href={`/products/${item.id}`}>
                      <a>
                        <div className='hover:bg-gray-100 py-4 px-4 transition duration-300 ease-in-out hover:rounded-lg cursor-pointer grid grid-cols-4'>
                          <div className='mr-2'>
                            <Image
                              src={item.images[0]}
                              height={220}
                              width={180}
                              objectFit='cover'
                              className='rounded-md'
                            />
                          </div>

                          <div className='flex flex-col col-span-3'>
                            <div className='flex-grow'>
                              <h4 className='font-bold'>{item.title}</h4>
                              <p className='line-clamp-2 font-normal'>
                                {item.description}
                              </p>
                            </div>

                            <p className='font-bold'>
                              <span className='text-lg font-extrabold'>৳ </span>
                              {item.price}
                            </p>
                          </div>
                        </div>
                        <div aria-hidden='true'>
                          <div>
                            <div className='border-t mx-4 border-gray-200' />
                          </div>
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
              <XCircleIcon onClick={() => setSearch('')} className='h-5 mr-3' />
            </div>
          )}
        </div>
        <ProductFeed products={JSON.parse(products)} />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const data = await db
    .collection('products')
    .orderBy('timestamp', 'desc')
    .get();

  const products = data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    props: {
      products: JSON.stringify(products),
      session,
    },
  };
}
