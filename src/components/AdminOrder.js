import Link from 'next/link';
import { useState } from 'react';
import db from '../../firebase';

const AdminOrder = ({
  tran_id,
  name,
  email,
  items,
  total,
  note,
  paymentStatus,
  status,
  shippingAddress,
  timestamp,
}) => {
  const [changeStatus, setChangeStatus] = useState(status);
  const [showStatus, setShowStatus] = useState(status);

  const handleStatusChange = () => {
    db.collection('orders').doc(tran_id).update({
      status: changeStatus,
    });
    setShowStatus(changeStatus);
  };
  return (
    <div className='p-6 rounded-3xl bg-gray-50 border'>
      <div className='flex justify-between mb-2'>
        <div>
          <h4 className='font-bold text-2xl'>{name}</h4>
          <p>{email}</p>
        </div>
        <div className='flex space-x-3 items-center'>
          <div>
            <select
              value={changeStatus}
              onChange={(e) => setChangeStatus(e.target.value)}
              id='status'
              name='status'
              autoComplete='status'
              className='p-3 mr-10 block w-full border border-gray-300 bg-white rounded-full shadow-sm focus:outline-none focus:ring-zakvan_red-dark focus:border-zakvan_red-dark cursor-pointer sm:text-sm'
            >
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Delivered</option>
              <option>Canceled</option>
            </select>
          </div>
          <div>
            <div className='button-alt' onClick={handleStatusChange}>
              <p>Change</p>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-9 gap-8 py-4 border-b font-medium'>
        <p>Date</p>
        <p>Status</p>
        <p className='col-span-3'>Item ({items.length})</p>
        <p>Payment</p>
        <p className='col-span-2'>Address</p>
        <p>Order Id</p>
      </div>

      <div className='grid grid-cols-9 gap-8 py-4'>
        <p>{new Date(timestamp.seconds * 1000).toLocaleDateString('en-US')}</p>
        <div>
          {showStatus === 'Pending' && (
            <p className='text-yellow-600 py-1 px-4 font-bold text-sm rounded-full bg-yellow-200 inline-block'>
              {showStatus}
            </p>
          )}
          {showStatus === 'Confirmed' && (
            <p className='text-blue-600 py-1 px-4 font-bold text-sm rounded-full bg-blue-200 inline-block'>
              {showStatus}
            </p>
          )}
          {showStatus === 'Delivered' && (
            <p className='text-green-600 py-1 px-4 font-bold text-sm rounded-full bg-green-200 inline-block'>
              {showStatus}
            </p>
          )}
          {showStatus === 'Canceled' && (
            <p className='text-red-600 py-1 px-4 font-bold text-sm rounded-full bg-red-200 inline-block'>
              {showStatus}
            </p>
          )}
        </div>
        <div className='col-span-3'>
          <div className='mb-2 space-y-4'>
            {items.map((item, i) => (
              <div key={i} className='flex space-x-2'>
                <p className='font-medium'>{i + 1}.</p>

                <div className='flex-grow'>
                  <div className='flex justify-between'>
                    <Link href={`/products/${item.prodId}`}>
                      <a>
                        <p className='link line-clamp-1 font-medium'>
                          {item.title} ({item.quantity})
                        </p>
                      </a>
                    </Link>

                    <p className='font-medium'>
                      {item.quantity} x ৳{item.price}
                    </p>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <div className='flex space-x-2 items-center'>
                      <p>Color: </p>
                      <div
                        className='h-4 w-4 ring-1 ring-gray-400 rounded-full'
                        style={{
                          backgroundColor: item.selectedColor,
                        }}
                      />
                    </div>
                    {item.selectedSize && (
                      <p>
                        Size:{' '}
                        <span className='font-medium'>{item.selectedSize}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='font-medium pt-2 border-t space-y-2'>
            <div className='flex justify-between items-center'>
              <p>Subtotal:</p>
              <p>
                ৳
                {shippingAddress.shipping === 'Inside Dhaka'
                  ? total - 60
                  : total - 100}
              </p>
            </div>

            <div className='flex justify-between items-center font-medium'>
              <p>Shipping:</p>
              <p>৳{shippingAddress.shipping === 'Inside Dhaka' ? 60 : 100}</p>
            </div>

            <div className='flex justify-between items-center border-t pt-2 font-medium text-lg'>
              <p>Total:</p>
              <p>৳{total}</p>
            </div>
          </div>
        </div>
        <div>
          {paymentStatus === 'Processing' && (
            <p className='text-yellow-600 py-1 px-4 font-bold text-sm rounded-full bg-yellow-200 inline-block'>
              {paymentStatus}
            </p>
          )}
          {paymentStatus === 'Complete' && (
            <p className='text-green-600 py-1 px-4 font-bold text-sm rounded-full bg-green-200 inline-block'>
              {paymentStatus}
            </p>
          )}
          {paymentStatus === 'COD' && (
            <p className='text-blue-600 py-1 px-4 font-bold text-sm rounded-full bg-blue-200 inline-block'>
              {paymentStatus}
            </p>
          )}
          {paymentStatus === 'Failed' && (
            <p className='text-red-600 py-1 px-4 font-bold text-sm rounded-full bg-red-200 inline-block'>
              {paymentStatus}
            </p>
          )}
        </div>
        <div className='col-span-2 space-y-1'>
          <p className='line-clamp-1'>{shippingAddress.address}</p>
          <p className='line-clamp-1'>{shippingAddress.apartment}</p>
          <p>{shippingAddress.shipping}</p>
          <div className='flex space-x-2'>
            <p>{shippingAddress.city},</p>
            <p>{shippingAddress.postal}</p>
          </div>
          <p className='line-clamp-1'>Phone: {shippingAddress.phone}</p>
        </div>

        <p className='break-words'>#{tran_id}</p>
      </div>
      {note && (
        <p className='mt-2'>
          <span className='font-medium'>Note: </span>
          {note}
        </p>
      )}
    </div>
  );
};

export default AdminOrder;
