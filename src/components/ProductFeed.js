import { useEffect, useState } from 'react';
import Product from './Product';
import { LightningBoltIcon } from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import { changeCategory, selectCategory } from '../slices/categorySlice';

const ProductFeed = ({ products, categories }) => {
  const selected = useSelector(selectCategory);
  const [sortedProducts, setSortedProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const filtered = products.filter(({ category }) => selected === category);

    if (filtered.length < 1) return setSortedProducts([...products]);
    setSortedProducts([...filtered]);
  }, [selected]);

  return (
    <div className='grid md:grid-cols-3 lg:grid-cols-4 mx-auto'>
      <div className='hidden sm:flex md:flex-col overflow-scroll sm:overflow-hidden space-y-4 mr-8 sm:text-xl font-bold mt-5 italic text-gray-700'>
        <div
          onClick={() => dispatch(changeCategory('New In'))}
          className={`bg-gray-100 rounded-3xl p-4 sm:p-10 cursor-pointer hover:bg-gray-300 transition duration-300 ease-in-out flex justify-between items-center ${
            selected === 'New In' &&
            'bg-zakvan_red-dark text-white hover:bg-zakvan_red-dark'
          }`}
        >
          <h4>New In</h4>
          <LightningBoltIcon className='h-6 hidden sm:block' />
        </div>

        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => dispatch(changeCategory(category.category))}
            className={`
          bg-gray-100 rounded-3xl p-4 sm:p-10 cursor-pointer hover:bg-gray-300 transition duration-300 ease-in-out ${
            selected === category.category &&
            'bg-zakvan_red-dark text-white hover:bg-zakvan_red-dark'
          }`}
          >
            <h4>{category.category}</h4>
          </div>
        ))}
      </div>

      <div className='md:col-span-2 lg:col-span-3'>
        <h4 className='mt-5 ml-4 mb-2 text-2xl sm:text-6xl font-bold text-zakvan_red-dark'>
          {selected}
        </h4>
        <div className='hidden sm:block ml-5' aria-hidden='true'>
          <div className='py-4'>
            <div className='border-t border-gray-200' />
          </div>
        </div>
        <div className='grid mx-2 sm:mx-0 grid-cols-2 lg:grid-cols-3'>
          {sortedProducts.map(({ id, title, price, category, images }) => (
            <div key={id} className='mx-2 my-1 sm:m-5'>
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
      </div>
    </div>
  );
};

export default ProductFeed;
