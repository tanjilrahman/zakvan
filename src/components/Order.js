import Link from 'next/link';

const Order = ({
  tran_id,
  items,
  total,
  paymentStatus,
  status,
  shippingAddress,
  timestamp,
}) => {
  return (
    <div>
      <div className='sm:hidden p-3 bg-white border rounded-xl text-sm'>
        <div className='flex justify-between items-center border-b pb-2'>
          <div>
            <p className='font-medium'>
              {' '}
              {new Date(timestamp.seconds * 1000).toLocaleDateString('en-US')}
            </p>
            <p className='text-xs'>#{tran_id}</p>
          </div>
          <div>
            {status === 'Pending' && (
              <p className='text-yellow-600 py-1 px-3 font-semibold text-xs rounded-full bg-yellow-200 inline-block'>
                {status}
              </p>
            )}
            {status === 'Confirmed' && (
              <p className='text-blue-600 py-1 px-3 font-semibold text-xs rounded-full bg-blue-200 inline-block'>
                {status}
              </p>
            )}
            {status === 'Delivered' && (
              <p className='text-green-600 py-1 px-3 font-semibold text-xs rounded-full bg-green-200 inline-block'>
                {status}
              </p>
            )}
            {status === 'Canceled' && (
              <p className='text-red-600 py-1 px-3 font-semibold text-xs rounded-full bg-red-200 inline-block'>
                {status}
              </p>
            )}
          </div>
        </div>
        <div className='border-b pb-1 mb-2'>
          <div className='mb-2 space-y-2 mt-2'>
            {items.map((item, i) => (
              <div key={i} className='flex space-x-2'>
                <p className='font-medium'>{i + 1}.</p>

                <div className='flex-grow'>
                  <div className='flex justify-between'>
                    <Link href={`/products/${item.prodId}`}>
                      <a className='w-3/4'>
                        <p className='link line-clamp-1 font-medium'>
                          {item.title} ({item.quantity})
                        </p>
                      </a>
                    </Link>

                    <p className='font-medium'>
                      {item.quantity} x ৳{item.price}
                    </p>
                  </div>

                  <div className='flex items-center space-x-1 text-xs'>
                    <div className='flex space-x-1 items-center'>
                      <p>Color: </p>
                      <div
                        className='h-3 w-3 ring-1 ring-gray-400 rounded-full'
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

          <div className='font-medium pt-2 border-t'>
            <div className='flex justify-between items-center'>
              <p>Subtotal:</p>
              <p>
                ৳
                {shippingAddress.shipping === 'Inside Dhaka'
                  ? total - 60
                  : total - 100}
              </p>
            </div>

            <div className='flex justify-between items-center font-medium mt-1'>
              <p>Shipping:</p>
              <p>৳{shippingAddress.shipping === 'Inside Dhaka' ? 60 : 100}</p>
            </div>

            <div className='flex justify-between items-center border-t mt-2 pt-2 font-medium text-base'>
              <p>Total:</p>
              <p>৳{total}</p>
            </div>
          </div>
        </div>
        <div className='col-span-2 space-y-1'>
          <div className='flex justify-between items-center font-medium'>
            <p>Deliver to:</p>
            <div className='flex items-center space-x-1'>
              <p>Payment: </p>

              {paymentStatus === 'Processing' && (
                <p className='text-yellow-600 py-1 px-3 font-semibold text-xs rounded-full bg-yellow-200 inline-block'>
                  {paymentStatus}
                </p>
              )}
              {paymentStatus === 'Complete' && (
                <p className='text-green-600 py-1 px-3 font-semibold text-xs rounded-full bg-green-200 inline-block'>
                  {paymentStatus}
                </p>
              )}
              {paymentStatus === 'COD' && (
                <p className='text-blue-600 py-1 px-3 font-semibold text-xs rounded-full bg-blue-200 inline-block'>
                  {paymentStatus}
                </p>
              )}
              {paymentStatus === 'Failed' && (
                <p className='text-red-600 py-1 px-3 font-semibold text-xs rounded-full bg-red-200 inline-block'>
                  {paymentStatus}
                </p>
              )}
            </div>
          </div>
          <p>{shippingAddress.address}</p>
          <p>{shippingAddress.apartment}</p>
          <div className='flex justify-between items-center'>
            <div className='flex space-x-2'>
              <p>{shippingAddress.city},</p>
              <p>{shippingAddress.postal}</p>
            </div>
            <p>{shippingAddress.phone}</p>
          </div>
        </div>
      </div>
      <div className='hidden sm:grid grid-cols-9 gap-8 py-6 border-b'>
        <p>{new Date(timestamp.seconds * 1000).toLocaleDateString('en-US')}</p>
        <div>
          {status === 'Pending' && (
            <p className='text-yellow-600 py-1 px-4 font-bold text-sm rounded-full bg-yellow-200 inline-block'>
              {status}
            </p>
          )}
          {status === 'Confirmed' && (
            <p className='text-blue-600 py-1 px-4 font-bold text-sm rounded-full bg-blue-200 inline-block'>
              {status}
            </p>
          )}
          {status === 'Delivered' && (
            <p className='text-green-600 py-1 px-4 font-bold text-sm rounded-full bg-green-200 inline-block'>
              {status}
            </p>
          )}
          {status === 'Canceled' && (
            <p className='text-red-600 py-1 px-4 font-bold text-sm rounded-full bg-red-200 inline-block'>
              {status}
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
          <div className='flex space-x-2'>
            <p>{shippingAddress.city},</p>
            <p>{shippingAddress.postal}</p>
          </div>
          <p className='line-clamp-1'>Phone: {shippingAddress.phone}</p>
        </div>

        <p className='break-words'>#{tran_id}</p>
      </div>
    </div>
  );
};

export default Order;
