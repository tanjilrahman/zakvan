import { useRouter } from 'next/router';
import Image from 'next/image';

const Success = () => {
  const router = useRouter();
  return (
    <div className='max-w-screen-2xl mx-auto text-gray-700'>
      <div className='lg:flex justify-between items-center mt-4 sm:mt-12 sm:mb-20 mx-5 sm:mx-0'>
        <div className='hidden sm:block space-y-7 w-1/3 text-left '>
          <h4 className='text-6xl font-semibold mb-2'>Thank you!</h4>
          <p className='text-2xl leading-relaxed'>
            Your order has been placed. We'll send a confirmation once your item
            has shipped, if you would like to check the status of order(s)
            please press the button below.
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
            src='/undraw_Successful_purchase_re_mpig.svg'
            alt='Access Denied'
            height={1500}
            width={2000}
            objectFit='contain'
          />
        </div>
        <div className='sm:hidden text-center space-y-4 mt-6'>
          <h4 className='text-lg leading-none text-zakvan_red-dark'>
            Thank you!
          </h4>
          <p className='text-sm'>
            Your order has been placed. We'll send a confirmation once your item
            has shipped, if you would like to check the status of order(s)
            please press the button below.
          </p>
          <button className='button-alt' onClick={() => router.push('/orders')}>
            Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
