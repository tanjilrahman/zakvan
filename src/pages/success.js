import { CheckCircleIcon } from '@heroicons/react/solid';
import Link from 'next/link';

const Success = () => {
  return (
    <div className='h-screen mt-20'>
      <main className='max-w-screen-lg mx-auto'>
        <div className='flex flex-col p-10 bg-white'>
          <div className='flex items-center space-x-2 mb-5'>
            <CheckCircleIcon className='text-green-500 h-10' />
            <h1 className='text-3xl'>Thank you, your order has been placed!</h1>
          </div>
          <p>
            Thank you for shopping with us. We'll send a confirmation once your
            item has shipped, if you would like to check the status of order(s)
            please press the button below.
          </p>
          <div>
            <Link href='/orders'>
              <a>
                <button className='button mt-8'>Go to my orders.</button>
              </a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Success;
