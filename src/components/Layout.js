import Header from './Header';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { addToCart, selectCartItems } from '../slices/cartSlice';
import db from '../../firebase';
import { addToList, selectItems } from '../slices/wishSlice';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

function Layout({ children }) {
  const router = useRouter();
  const [session] = useSession();
  const localWish = useSelector(selectItems);
  const localCart = useSelector(selectCartItems);
  const dispatch = useDispatch();

  useEffect(() => {
    const getWish = localStorage.getItem('wishlist');
    const parsedWish = JSON.parse(getWish);
    if (getWish !== null) {
      parsedWish.map((wish) => {
        dispatch(addToList(wish));
      });
    }
  }, []);

  useEffect(() => {
    const getCart = localStorage.getItem('cart');
    const parsedCart = JSON.parse(getCart);
    if (getCart !== null) {
      parsedCart.map((cart) => {
        dispatch(addToCart(cart));
      });
    }
  }, []);

  useEffect(() => {
    if (session) {
      const cartRef = db
        .collection('users')
        .doc(session?.user.email)
        .collection('cart')
        .get();

      cartRef.then((snapshot) => {
        if (snapshot.docs.length === 0) {
          localCart.map((cart) => {
            db.collection('users')
              .doc(session?.user.email)
              .collection('cart')
              .doc()
              .set({
                title: cart.title,
                description: cart.description,
                price: cart.price,
                prodId: cart.prodId,
                quantity: cart.quantity,
                selectedColor: cart.selectedColor,
                selectedSize: cart.selectedSize,
                category: cart.category,
                images: cart.images,
              });
          });
        }
      });

      const wishRef = db
        .collection('users')
        .doc(session?.user.email)
        .collection('wishlist')
        .get();

      wishRef.then((snapshot) => {
        if (snapshot.docs.length === 0) {
          localWish.map((wish) => {
            db.collection('users')
              .doc(session?.user.email)
              .collection('wishlist')
              .doc(wish.id)
              .set({
                ...wish,
              });
          });
        }
      });

      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
    }
  }, [session]);

  useEffect(() => {
    if (!session) {
      localStorage.setItem('wishlist', JSON.stringify(localWish));
    }
  }, [localWish]);

  useEffect(() => {
    if (!session) {
      localStorage.setItem('cart', JSON.stringify(localCart));
    }
  }, [localCart]);

  return (
    <>
      <Header />
      <div className='min-h-screen'>{children}</div>
      {router.pathname !== '/cart' && <Footer />}
      {router.pathname === '/cart' && (
        <div className='hidden sm:block'>
          <Footer />
        </div>
      )}
    </>
  );
}

export default Layout;
