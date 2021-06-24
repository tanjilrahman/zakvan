import { useEffect, useState } from 'react';
import firebase from 'firebase';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/lib/css/styles.css';
import db from '../../../firebase';
import Image from 'next/image';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [currentCategories, setCurrentCategories] = useState([]);
  const [category, setCategory] = useState('Select');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentBanners, setCurrentBanners] = useState([]);
  const [bannerDownloadURL, setBannerDownloadURL] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [downloadUrl, setDownloadUrl] = useState([]);
  const [color, setColor] = useColor('hex', '#121212');
  const [colorset, setColorset] = useState([]);
  const [size, setSize] = useState('');
  const [availableSizes, setAvailableSizes] = useState([]);
  const [admins] = useState([
    'tanjil.rahman10@gmail.com',
    'tanjil.rahman2020@gmail.com',
  ]);
  const [progress, setProgress] = useState('');

  const handleSave = (e) => {
    e.preventDefault();

    db.collection('products').doc().set({
      title,
      price,
      category,
      description,
      colorset,
      availableSizes,
      images: downloadUrl,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setTitle('');
    setDescription('');
    setPrice('');
    setImages([]);
    setProgress('');
    setDownloadUrl([]);
    setColorset([]);
    setAvailableSizes([]);
  };

  const bannerHandleSave = (e) => {
    e.preventDefault();

    bannerDownloadURL.map((banner) => {
      db.collection('banners').doc().set({
        banner,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    });

    setProgress('');
    setBannerDownloadURL([]);
  };

  const handleAddCategory = () => {
    if (newCategory === '') return;
    db.collection('categories').doc().set({
      category: newCategory,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setNewCategory('');
  };

  useEffect(async () => {
    const data = await db
      .collection('banners')
      .orderBy('timestamp', 'desc')
      .get();
    const banners = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCurrentBanners(banners);

    const category = await db
      .collection('categories')
      .orderBy('timestamp', 'desc')
      .get();
    const categories = category.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setCurrentCategories(categories);
  }, []);

  const handleDeleteBanner = (id) => {
    db.collection('banners').doc(id).delete();
  };

  const handleRemoveCategory = (id) => {
    db.collection('categories').doc(id).delete();
  };
  useEffect(() => {
    const arrayOfImages = [...images];

    arrayOfImages.map((image) => {
      const imageStorageRef = firebase
        .storage()
        .ref('images')
        .child(image.name);

      const uploadTask = imageStorageRef.put(image);

      return uploadTask.on(
        'state_changed',
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.floor(progress));
        },
        (error) => {
          alert('Something went wrong!', error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            setDownloadUrl([...downloadUrl, downloadURL]);
          });
        }
      );
    });
  }, [images]);

  useEffect(() => {
    const arrayOfImages = [...banners];

    arrayOfImages.map((banner) => {
      const imageStorageRef = firebase
        .storage()
        .ref('banners')
        .child(banner.name);

      const uploadTask = imageStorageRef.put(banner);

      return uploadTask.on(
        'state_changed',
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.floor(progress));
        },
        (error) => {
          alert('Something went wrong!', error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            setBannerDownloadURL([...bannerDownloadURL, downloadURL]);
          });
        }
      );
    });
  }, [banners]);

  if (typeof window !== 'undefined' && loading)
    return (
      <div className='max-w-screen-2xl mx-auto text-gray-700'>
        <div className='mt-24 mx-5'>
          <img
            src='/undraw_page_not_found_su7k.svg'
            alt='404'
            className='mx-auto'
          />
        </div>
      </div>
    );

  if (!admins.includes(session?.user.email))
    return (
      <div className='max-w-screen-2xl mx-auto text-gray-700'>
        <div className='mt-24 mx-5'>
          <img
            src='/undraw_page_not_found_su7k.svg'
            alt='404'
            className='mx-auto'
          />
        </div>
      </div>
    );

  return (
    <div>
      <main className='max-w-screen-2xl mx-auto flex flex-col px-4 mt-8'>
        <div>
          <div className='md:grid md:grid-cols-3 md:gap-6'>
            <div className='md:col-span-1'>
              <div className='px-4 sm:px-0'>
                <h3 className='text-lg font-medium leading-6 text-gray-900'>
                  Add product
                </h3>
                <p className='mt-1 text-sm text-gray-600'>
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>
            </div>
            <div className='mt-5 md:mt-0 md:col-span-2'>
              <form action='#' method='POST'>
                <div className='shadow sm:rounded-md sm:overflow-hidden'>
                  <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
                    <div className='grid grid-cols-3 gap-6'>
                      <div className='col-span-3'>
                        <label
                          htmlFor='title'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Product title
                        </label>
                        <div className='mt-1 flex rounded-md shadow-sm'>
                          <input
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type='text'
                            name='title'
                            className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300'
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor='description'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Product Description
                      </label>
                      <div className='mt-1'>
                        <textarea
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          name='description'
                          rows={3}
                          className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md'
                        />
                      </div>
                      <p className='mt-2 text-sm text-gray-500'>
                        Brief description for the product. URLs are hyperlinked.
                      </p>
                    </div>

                    <div className='grid grid-cols-3 gap-6'>
                      <div className='col-span-3 sm:col-span-1'>
                        <label
                          htmlFor='price'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Price
                        </label>
                        <div className='mt-1 flex rounded-md shadow-sm'>
                          <input
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            type='number'
                            name='price'
                            className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='grid grid-cols-3 gap-6'>
                      <div className='col-span-3 sm:col-span-1'>
                        <label
                          htmlFor='category'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          id='category'
                          name='category'
                          autoComplete='category'
                          className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        >
                          <option>Select</option>
                          {currentCategories.map((category) => (
                            <option key={category.id}>
                              {category.category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className='grid grid-cols-3 gap-6'>
                      <div className='col-span-3 sm:col-span-1'>
                        <label
                          htmlFor='sizes'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Available sizes
                        </label>
                        <div className='mt-1 flex rounded-md shadow-sm'>
                          <input
                            required
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            type='text'
                            name='sizes'
                            className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300'
                          />
                          <p
                            onClick={() => {
                              setAvailableSizes([...availableSizes, size]);
                              setSize('');
                            }}
                            className='text-4xl font-bold px-3 cursor-pointer text-gray-700 hover:text-indigo-500'
                          >
                            +
                          </p>
                        </div>
                        {availableSizes && (
                          <div className='flex'>
                            {availableSizes.map((size, i) => (
                              <p key={i} className='font-bold p-2'>
                                {size}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='sm:hidden'>
                      <ColorPicker
                        width={256}
                        height={180}
                        color={color}
                        onChange={setColor}
                        hideHSV
                        dark
                      />
                    </div>

                    <div className='hidden sm:block'>
                      <ColorPicker
                        width={456}
                        height={228}
                        color={color}
                        onChange={setColor}
                        hideHSV
                        dark
                      />
                    </div>

                    <p
                      className='cursor-pointer'
                      onClick={() => setColorset([...colorset, color.hex])}
                    >
                      + Add color
                    </p>
                    <div className='flex space-x-2'>
                      {colorset.map((color, i) => (
                        <div
                          onClick={() => {
                            const newColorset = colorset.filter(
                              (filterColor) => filterColor !== color
                            );
                            setColorset(newColorset);
                          }}
                          key={i}
                          className='h-8 w-8 rounded-full'
                          style={{
                            backgroundColor: color,
                          }}
                        />
                      ))}
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Product image(s)
                      </label>
                      <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
                        <div className='space-y-1 text-center'>
                          <svg
                            className='mx-auto h-12 w-12 text-gray-400'
                            stroke='currentColor'
                            fill='none'
                            viewBox='0 0 48 48'
                            aria-hidden='true'
                          >
                            <path
                              d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                          <div className='flex text-sm text-gray-600'>
                            <label
                              htmlFor='file-upload'
                              className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
                            >
                              <span>Upload image(s)</span>
                              <input
                                required
                                onChange={(e) => setImages(e.target.files)}
                                id='file-upload'
                                name='images'
                                type='file'
                                className='sr-only'
                              />
                            </label>
                            <p className='pl-1'>First one will be the cover.</p>
                          </div>
                          <p className='text-xs text-gray-500'>
                            PNG, JPG, gif up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {downloadUrl ? (
                    <div className='flex space-x-3'>
                      {downloadUrl.map((image, i) => (
                        <div key={i}>
                          <Image
                            src={image}
                            width={250}
                            height={300}
                            objectFit='cover'
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    ''
                  )}
                  <div className='relative px-4 py-3 bg-gray-50 text-right sm:px-6'>
                    <span className='absolute left-6 top-5 italic text-gray-500'>
                      {!progress ? '' : `Upload ${progress}% Done`}
                    </span>
                    <button
                      disabled={
                        !title ||
                        !description ||
                        !price ||
                        !images ||
                        !colorset ||
                        category === 'Select'
                      }
                      onClick={handleSave}
                      type='submit'
                      className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zakvan_red-dark hover:bg-zakvan_red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zakvan_red-dark disabled:bg-gray-500 disabled:text-white
                      disabled:cursor-not-allowed'
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div>
            <h4>Banners</h4>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Product image(s)
              </label>
              <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
                <div className='space-y-1 text-center'>
                  <svg
                    className='mx-auto h-12 w-12 text-gray-400'
                    stroke='currentColor'
                    fill='none'
                    viewBox='0 0 48 48'
                    aria-hidden='true'
                  >
                    <path
                      d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <div className='flex text-sm text-gray-600'>
                    <label
                      htmlFor='banner-upload'
                      className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
                    >
                      <span>Upload image(s)</span>
                      <input
                        required
                        onChange={(e) => setBanners(e.target.files)}
                        id='banner-upload'
                        name='banners'
                        type='file'
                        className='sr-only'
                      />
                    </label>
                    <p className='pl-1'>First one will be the cover.</p>
                  </div>
                  <p className='text-xs text-gray-500'>
                    PNG, JPG, gif up to 10MB
                  </p>
                </div>
              </div>
              {currentBanners ? (
                <div className='flex space-x-3'>
                  {currentBanners.map((banner) => (
                    <div
                      key={banner.id}
                      onClick={() => handleDeleteBanner(banner.id)}
                      className='cursor-pointer'
                    >
                      <Image
                        src={banner.banner}
                        width={300}
                        height={150}
                        objectFit='cover'
                      />
                    </div>
                  ))}
                </div>
              ) : (
                ''
              )}
              {bannerDownloadURL ? (
                <div className='flex space-x-3'>
                  {bannerDownloadURL.map((image, i) => (
                    <div key={i}>
                      <Image
                        src={image}
                        width={300}
                        height={150}
                        objectFit='cover'
                      />
                    </div>
                  ))}
                </div>
              ) : (
                ''
              )}
              <div className='relative px-4 py-3 bg-gray-50 text-right sm:px-6'>
                <span className='absolute left-6 top-5 italic text-gray-500'>
                  {!progress ? '' : `Upload ${progress}% Done`}
                </span>
                <button
                  onClick={bannerHandleSave}
                  type='submit'
                  className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zakvan_red-dark hover:bg-zakvan_red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zakvan_red-dark disabled:bg-gray-500 disabled:text-white
                      disabled:cursor-not-allowed'
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          <div>
            <h4>Categories</h4>
            {currentCategories.map((category) => (
              <button
                className='button-alt'
                key={category.id}
                onClick={() => handleRemoveCategory(category.id)}
              >
                {category.category}
              </button>
            ))}
            <div>
              <label
                htmlFor='category'
                className='block text-sm font-medium text-gray-700'
              >
                Add Category
              </label>
              <div className='mt-1 flex rounded-md shadow-sm'>
                <input
                  required
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  type='text'
                  name='category'
                  className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300'
                />
              </div>
            </div>
            <button className='button-alt' onClick={handleAddCategory}>
              Add
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
