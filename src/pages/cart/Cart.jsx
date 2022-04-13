import React from "react";
import { Footer, Navbar } from "../../components";
import { CartItems } from "./CartItems";
import styles from "./Cart.module.css";
import { useProduct } from "../../context/product-context";
import { useDocumentTitle } from "../../utils";
import { PriceSummary } from "./PriceSummary";

export function Cart() {
  const {
    state: { productsInCart },
  } = useProduct();

  useDocumentTitle(`My Cart | FueledUp`);

  return (
    <>
      <Navbar />
      <main className={`${styles.max__width__1200} mx-auto`}>
        <h2 className="page-title txt-bold mx-auto py-md">
          My Cart ({productsInCart.length})
        </h2>
        <hr />
        <section
          className={`min-h-95 grid grid-cols-1 grid-reverse gap-3 pos-rel my-3 ${
            styles.page__content
          } ${productsInCart.length > 0 && styles.grid__cols__2__1}`}>
          <CartItems />
          {productsInCart.length > 0 && (
            <PriceSummary />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
