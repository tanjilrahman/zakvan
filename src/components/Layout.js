import Header from './Header';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { addToCart, selectCartItems } from '../slices/cartSlice';
import db from '../../firebase';
import { addToList, selectItems } from '../slices/wishSlice';
import { useSession } from 'next-auth/client';

function Layout({ children }) {
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

    const getCart = localStorage.getItem('cart');
    const parsedCart = JSON.parse(getCart);
    if (getCart !== null) {
      parsedCart.map((cart) => {
        dispatch(addToCart(cart));
      });
    }

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

      // if (cartLength === 0) {
      //   db.collection('users')
      //     .doc(session?.user.email)
      //     .collection('cart')
      //     .doc()
      //     .set({
      //       title: localCart.title,
      //       description: localCart.description,
      //       price: localCart.price,
      //       prodId: localCart.prodId,
      //       quantity: localCart.quantity,
      //       selectedColor: localCart.selectedColor,
      //       category: localCart.category,
      //       images: localCart.images,
      //     });
      // }
    }
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
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
  // const dispatch = useDispatch();
  // const [products, setProducts] = useState([]);
  // console.log(JSON.parse(products));

  // dispatch(fetchProducts(JSON.parse(products)));

  // useEffect(() => {
  //   db.collection('products')
  //     .orderBy('timestamp', 'desc')
  //     .onSnapshot((snapshot) => {
  //       snapshot.docs.map((doc) => {
  //         setProducts((prev) => [
  //           ...prev,
  //           {
  //             id: doc.id,
  //             title: doc.data().title,
  //             price: doc.data().price,
  //             description: doc.data().description,
  //             category: doc.data().category,
  //             colorset: doc.data().colorset,
  //             images: doc.data().images,
  //             timestamp: moment(doc.data().timestamp.toDate()).unix(),
  //           },
  //         ]);
  //       });
  //     });
  // }, []);

  // useEffect(() => {
  //   dispatch(fetchProducts(products));
  // }, [products]);

  // console.log(products);
  return (
    <>
      <Header />
      <div className='min-h-screen'>{children}</div>
      <Footer />
    </>
  );
}

export default Layout;

// export async function getServerSideProps(context) {
//   const data = await db
//     .collection('products')
//     .orderBy('timestamp', 'desc')
//     .get();

//   const products = data.docs.map((doc) => ({
//     id: doc.id,
//     title: doc.data().title,
//     price: doc.data().price,
//     description: doc.data().description,
//     category: doc.data().category,
//     colorset: doc.data().colorset,
//     images: doc.data().images,
//   }));

//   console.log(products);

//   return {
//     props: {
//       products: JSON.stringify(products),
//     },
//   };
// }
