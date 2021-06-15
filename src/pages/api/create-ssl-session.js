const SSLCommerzPayment = require('sslcommerz');

export default async (req, res) => {
  const { name, email, tran_id, shippingAddress, cartlist, total } = req.body;
  const data = {
    total_amount: total,
    currency: 'BDT',
    tran_id,
    success_url: `${process.env.HOST}/api/success`,
    fail_url: `${process.env.HOST}/api/fail`,
    cancel_url: `${process.env.HOST}/api/cancel`,
    shipping_method: 'Courier',
    product_name: 'Cloth',
    product_category: 'Clothing',
    product_profile: 'general',
    cus_name: name,
    cus_email: email,
    cus_add1: shippingAddress.address,
    cus_add2: shippingAddress.apartment,
    cus_city: shippingAddress.city,
    cus_state: shippingAddress.city,
    cus_postcode: shippingAddress.postal,
    cus_country: 'Bangladesh',
    cus_phone: shippingAddress.phone,
    cus_fax: shippingAddress.phone,
    ship_name: name,
    ship_add1: shippingAddress.address,
    ship_add2: shippingAddress.apartment,
    ship_city: shippingAddress.city,
    ship_state: shippingAddress.city,
    ship_postcode: shippingAddress.postal,
    ship_country: 'Bangladesh',
    value_a: email,
  };
  console.log(cartlist);
  const sslcommer = new SSLCommerzPayment(
    process.env.STORE_ID,
    process.env.STORE_PASSWORD,
    false
  ); //true for live default false for sandbox
  const session = await sslcommer.init(data).then((data) => data);

  res.status(200).json({ session });
};
