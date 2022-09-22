import Image from "next/image";
import {
  SearchIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  HeartIcon,
  MenuAlt2Icon,
  XIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartIconSolid,
  LightningBoltIcon,
} from "@heroicons/react/solid";
import { getSession, signIn, signOut, useSession } from "next-auth/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import db from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectItems } from "../slices/wishSlice";
import { selectCartItems } from "../slices/cartSlice";
import {
  changeCategory,
  scrollToView,
  selectCategory,
} from "../slices/categorySlice";
import { useRouter } from "next/router";

const Header = () => {
  const [session] = useSession();
  const [search, setSearch] = useState("");
  const [searchedItems, setSearchedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartlist, setCartlist] = useState([]);
  const [scroll, setScroll] = useState(false);
  const [itemAdded, setItemAdded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const router = useRouter();
  const [productsSnapshot] = useCollection(
    db.collection("products").orderBy("timestamp", "desc")
  );
  const localWish = useSelector(selectItems);
  const localCart = useSelector(selectCartItems);
  const selected = useSelector(selectCategory);

  const dispatch = useDispatch();

  useEffect(async () => {
    let isSubscribed = true;
    const category = await db.collection("categories").get();
    const categories = category.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (isSubscribed) {
      setCategories(categories);
    }
    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    if (session) {
      const wish = db
        .collection("users")
        .doc(session?.user.email)
        .collection("wishlist")
        .onSnapshot((snapshot) => {
          const wish = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setWishlist(wish);
        });
      return () => wish();
    } else {
      setWishlist(localWish);
    }
  }, [localWish]);

  useEffect(() => {
    if (session) {
      const cart = db
        .collection("users")
        .doc(session?.user.email)
        .collection("cart")
        .onSnapshot((snapshot) => {
          const cart = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCartlist(cart);
        });
      return () => cart();
    } else {
      setCartlist(localCart);
    }
  }, [localCart]);

  const products = productsSnapshot?.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  useEffect(() => {
    document.body.addEventListener("click", () => setSearch(""));

    return function cleanup() {
      window.removeEventListener("click", () => setSearch(""));
    };
  }, []);

  useEffect(() => {
    setSearchedItems(
      products?.filter((product) => {
        const matchedProduct = product?.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const hasInput = search.length > 0;

        return matchedProduct && hasInput;
      })
    );
  }, [search]);

  useEffect(() => {
    setItemAdded(true);

    setTimeout(() => {
      setItemAdded(false);
    }, 500);
  }, [cartlist.length]);

  const listenScrollEvent = (e) => {
    if (window.scrollY > 24) {
      return setScroll(true);
    } else {
      return setScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);

    return () => window.removeEventListener("scroll", listenScrollEvent);
  }, []);

  useEffect(() => {
    if (menuIsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [menuIsOpen]);

  const handleChangeCategory = (category) => {
    dispatch(changeCategory(category));
    dispatch(scrollToView(true));
    setMenuIsOpen(false);
    if (router.pathname !== "/") {
      router.push("/");
    }
  };
  return (
    <header
      className={`sticky top-0 bg-white py-3 sm:py-4 md:px-14 max-w-screen-2xl mx-auto z-40 text-gray-500 ${
        scroll && "border-b sm:border-none"
      }`}
    >
      <div
        className={`${
          menuIsOpen ? "block" : "hidden"
        } absolute top-full h-screen w-screen overflow-scroll bg-white z-50`}
      >
        <div className="flex flex-col text-sm space-y-4 mx-5 pb-20 font-bold mt-5 italic text-gray-700">
          <div
            onClick={() => handleChangeCategory("New In")}
            className={`bg-gray-100 rounded-3xl p-6 cursor-pointer hover:bg-gray-300 transition duration-300 ease-in-out flex justify-between items-center ${
              selected === "New In" &&
              "bg-zakvan_red-dark text-white hover:bg-zakvan_red-dark"
            }`}
          >
            <h4>New In</h4>
            <LightningBoltIcon className="h-6" />
          </div>
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleChangeCategory(category.category)}
              className={`
          bg-gray-100 rounded-3xl p-6 cursor-pointer hover:bg-gray-300 transition duration-300 ease-in-out ${
            selected === category.category &&
            "bg-zakvan_red-dark text-white hover:bg-zakvan_red-dark"
          }`}
            >
              <h4>{category.category}</h4>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center ml-4 md:ml-0">
          {menuIsOpen ? (
            <XIcon
              className="h-6 mr-3 sm:hidden text-zakvan_red-dark"
              onClick={() => setMenuIsOpen(false)}
            />
          ) : (
            <MenuAlt2Icon
              className="h-6 mr-3 sm:hidden text-zakvan_red-dark"
              onClick={() => setMenuIsOpen(true)}
            />
          )}
          <div className="w-[4.5rem]  md:w-32">
            <Link href="/">
              <a>
                <img
                  src="/Zakvan-red.svg"
                  alt="logo"
                  className="cursor-pointer"
                />
              </a>
            </Link>
          </div>
        </div>

        <div className="bg-gray-100 flex-grow relative hidden sm:flex items-center h-12 rounded-full mx-60">
          <SearchIcon className="h-6 ml-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="h-6 w-full bg-gray-100 focus:ring-0 border-none rounded-full px-2"
            type="text"
          />
          {searchedItems?.length > 0 && (
            <div className="absolute bg-white shadow-lg border border-gray-200 rounded-2xl top-14 max-h-[30rem] overflow-y-scroll text-gray-700">
              <div className="hidden sm:block" aria-hidden="true">
                <div>
                  <div className="border-t mx-4 border-gray-200" />
                </div>
              </div>
              {searchedItems?.map((item) => (
                <div key={item.id}>
                  <Link href={`/products/${item.id}`}>
                    <a>
                      <div className="hover:bg-gray-100 py-4 px-6 transition duration-300 ease-in-out hover:rounded-lg cursor-pointer grid grid-cols-6">
                        <div className="mr-4">
                          <Image
                            src={item.images[0]}
                            height={220}
                            width={180}
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        </div>

                        <div className="flex flex-col col-span-5">
                          <div className="flex-grow">
                            <h4 className="font-bold text-lg">{item.title}</h4>
                            <p className="line-clamp-2 font-normal">
                              {item.description}
                            </p>
                          </div>

                          <p className="font-bold text-lg">
                            <span className="text-lg font-extrabold">৳ </span>
                            {item.price}
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:block" aria-hidden="true">
                        <div>
                          <div className="border-t mx-4 border-gray-200" />
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center text-xs space-x-3 sm:space-x-6 mr-5 md:mr-1 whitespace-nowrap">
          <div className="cursor-pointer sm:hover:animate-bounce">
            <Link href="/wishlist">
              <a>
                {wishlist.length > 0 ? (
                  <HeartIconSolid className="h-6 sm:h-8 text-zakvan_red" />
                ) : (
                  <HeartIcon className="h-6 sm:h-8 " />
                )}
              </a>
            </Link>
          </div>
          <div
            className={`relative flex items-center cursor-pointer sm:hover:animate-bounce ${
              itemAdded && "animate-singleBounce"
            }`}
          >
            <Link href="/cart">
              <a>
                <span className="absolute -top-1 right-0 h-4 w-4 bg-zakvan_red text-center rounded-full text-white font-bold">
                  {cartlist.length}
                </span>
                <ShoppingCartIcon className="h-6 sm:h-8" />
              </a>
            </Link>
          </div>
          <div className="relative">
            {session ? (
              <div className="w-7 h-7 md:w-9 md:h-9">
                <img
                  src={
                    session?.user.image
                      ? session?.user.image
                      : "https://aui.atlassian.com/aui/latest/docs/images/avatar-person.svg"
                  }
                  className={`rounded-full cursor-pointer ${
                    isOpen && "ring-4 ring-gray-300"
                  }`}
                  alt=""
                  onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}
                />
              </div>
            ) : (
              <UserCircleIcon
                className="h-7 sm:h-9 cursor-pointer"
                onClick={() => signIn()}
              />
            )}

            {session && isOpen && (
              <div className="absolute top-11 text-sm sm:text-lg -right-5 md:right-0 w-screen md:w-96 bg-white shadow-lg border border-gray-200 rounded-b-2xl md:rounded-3xl flex flex-col">
                <div className="mt-5">
                  <div className="flex flex-col items-center mb-6">
                    <img
                      src={
                        session?.user.image
                          ? session?.user.image
                          : "https://aui.atlassian.com/aui/latest/docs/images/avatar-person.svg"
                      }
                      className="rounded-full h-16 w-16 sm:h-20 sm:w-20"
                      alt=""
                    />
                    <p className="font-bold leading-none mt-5">
                      {session?.user.name}
                    </p>
                    <p className="leading-none mt-2 mx-4">
                      {session?.user.email}
                    </p>
                  </div>
                  <div aria-hidden="true">
                    <div>
                      <div className="border-t border-gray-200" />
                    </div>
                  </div>
                  <Link href="/orders">
                    <a>
                      <p className="py-3 w-full text-center hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer">
                        Order List
                      </p>
                    </a>
                  </Link>

                  <div aria-hidden="true">
                    <div>
                      <div className="border-t border-gray-200" />
                    </div>
                  </div>

                  <p
                    onClick={() => signOut({ redirect: false })}
                    className="py-3 w-full text-center mx-auto rounded-b-2xl transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
