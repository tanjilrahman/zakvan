import { useRouter } from 'next/router';
import Image from 'next/image';

const Failure = () => {
  const router = useRouter();
  return (
    <div className='max-w-screen-2xl mx-auto text-gray-700'>
      <div className='lg:flex justify-between items-center mt-4 sm:mt-12 sm:mb-20 mx-5 sm:mx-0'>
        <div className='hidden sm:block space-y-7 w-1/3 text-left '>
          <h4 className='text-5xl font-semibold mb-2'>Transaction failed!</h4>
          <p className='text-2xl leading-relaxed'>
            Your transaction was declined by your Bank!
          </p>
          <div>
            <button
              className='button font-semibold text-2xl'
              onClick={() => router.push('/orders')}
            >
              Orders
            </button>
          </div>
        </div>
        <div className='sm:w-[55%]'>
          <Image
            src='/undraw_feeling_blue_4b7q.svg'
            alt='Access Denied'
            height={1500}
            width={2000}
            objectFit='contain'
          />
        </div>
        <div className='sm:hidden text-center space-y-4 mt-6'>
          <h4 className='text-lg leading-none text-zakvan_red-dark'>
            Transaction failed!
          </h4>
          <p className='text-sm'>Your transaction was declined by your Bank!</p>
          <button className='button-alt' onClick={() => router.push('/orders')}>
            Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default Failure;
