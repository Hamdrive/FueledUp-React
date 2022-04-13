import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../products/Products.module.css";
import { useProduct } from "../../context/product-context";
import { Loader } from "../../components";

export function WishlistCard({ product }) {
  const [isProductAdded, setisProductAdded] = useState(false);

  const {
    state: { productsInCart },
    removeFromWishlist,
    addToCart,
    updateCartQuantity,
    cartLoader,
    setCartLoader,
    wishlistLoader,
    setWishlistLoader,
  } = useProduct();

  // Get current path to show appropriate button on card
  const location = useLocation();

  const handleAddToCart = async (product) => {
    setCartLoader(true);

    const cartReturn = productsInCart.some((item) => item._id === product._id)
      ? await updateCartQuantity(product._id, "increment")
      : await addToCart(product);

    if (cartReturn) setCartLoader(false);
    setisProductAdded(true);
  };

  const handleRemoveFromWishlist = async(product) => {
    setWishlistLoader(true)
    if(await removeFromWishlist(product._id)) setWishlistLoader(false);
  };

  useEffect(() => {
    isProductAdded && setisProductAdded(false);
  }, [location]);

  return (
    <div className={`pos-rel card ${styles.card} mx-auto`}>
      {!product.inStock && (
        <div
          className={`brief-overlay ${styles.brief__overlay} pos-ab top-left-pos`}>
          <p
            className={`overlay-text ${styles.overlay__text} pos-ab txt-black mx-auto txt-center`}>
            Out&nbsp;Of Stock
          </p>
        </div>
      )}
      <div className="pos-ab card-badge card-badge-left top-left-pos">
        {product.productDiscount}% off
      </div>
      <div
        className={`pos-ab ${styles.top__right__pos} flex-center ${styles.border__circle} ${styles.wish__heart__btn} pointer`}>
        {wishlistLoader ? (
          <Loader loaderStyle={"lds-ring-heart"} />
        ) : (
          <i
            onClick={() => handleRemoveFromWishlist(product)}
            className={`fa fa-heart ${styles.fill} `}></i>
        )}
      </div>
      <div className={`${styles.card__img}`}>
        <img src={product.productImage} alt="vertical card" />
      </div>
      <div className="card-title flex-col flex-grow-1">
        <p className="txt-md txt-bold">{product.title}</p>
        <p className="txt-reg txt-semibold">
          {product.team} - {product.categoryName}
        </p>
        <div className="flex-row align-center mt-1">
          <div className="dis-flex flex-wrap align-center">
            <p className="txt-md txt-semibold mr-sm">
              ₹ {product.productDiscountPrice}
            </p>
            <s className="strike-color txt-semibold">₹{product.price}</s>
          </div>
          <p className="flex-basis-20 txt-sm txt-bold ml-auto rating">
            <i className="fas fa-sm fa-star"></i>
            {product.productRating}
          </p>
        </div>
      </div>
      <hr />
      <div className="card-footer flex-around flex-grow-1">
        {isProductAdded ? (
          <Link
            to="/cart"
            className="btn btn-suc btn-lg txt-bold txt-reg w-100 txt-center">
            <i className="fas fa-shopping-cart"></i>
            go to cart
          </Link>
        ) : (
          <button
            onClick={() => handleAddToCart(product)}
            className="btn btn-cta btn-lg txt-bold txt-reg w-100">
            {cartLoader ? (
              <Loader loaderStyle={"lds-ring-auth"} />
            ) : (
              <>
                <i className="fas fa-cart-plus"></i>
                add to cart
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
