"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useRef, useState } from "react";
import { useCart } from "./cart-context";
import { createUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Price from "../price";
import OpenCart from "./open-cart";
import CloseCart from "./close-cart";
import { DEFAULT_OPTION } from "@/lib/constants";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import { useFormStatus } from "react-dom";
import LoadingDots from "../loading-dots";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart.totalQuantity !== quantityRef.current &&
      cart.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity]);

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault();
    const error = await redirectToCheckout();
    if (error) {
      alert(error);
    }
  };

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={closeCart} className="relative z-50">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              aria-hidden="true"
            />
          </Transition.Child>

          {/* Panel */}
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed right-0 top-0 bottom-0 z-50 h-full w-full md:w-[390px] bg-white/80 dark:bg-black/80 border-l border-neutral-200 dark:border-neutral-700 p-6 text-black dark:text-white backdrop-blur-xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-semibold">My Cart</p>
                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {/* Content */}
              {!cart || cart.lines.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-grow">
                  <ShoppingCartIcon className="h-16 w-16 text-gray-400" />
                  <p className="mt-6 text-center text-2xl font-bold">
                    Your Cart is Empty.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col h-full justify-between">
                  {/* Cart Items */}
                  <ul className="overflow-auto space-y-4 py-2">
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title
                        )
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams: MerchandiseSearchParams =
                          {};
                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          }
                        );

                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams)
                        );

                        return (
                          <li
                            key={i}
                            className="border-b pb-4 border-neutral-200 dark:border-neutral-700"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex space-x-3">
                                <div className="relative h-16 w-16 rounded border border-neutral-300 bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-900">
                                  <Image
                                    src={
                                      item.merchandise.product.featuredImage.url
                                    }
                                    alt={
                                      item.merchandise.product.featuredImage
                                        .altText ??
                                      item.merchandise.product.title
                                    }
                                    width={64}
                                    height={64}
                                    className="object-cover h-full w-full"
                                  />
                                </div>
                                <Link
                                  href={merchandiseUrl}
                                  onClick={closeCart}
                                  className="flex flex-col text-sm"
                                >
                                  <span>{item.merchandise.product.title}</span>
                                  {item.merchandise.title !==
                                    DEFAULT_OPTION && (
                                    <span className="text-neutral-500 dark:text-neutral-400">
                                      {item.merchandise.title}
                                    </span>
                                  )}
                                </Link>
                              </div>
                              <DeleteItemButton
                                item={item}
                                optimisticUpdate={updateCartItem}
                              />
                            </div>

                            {/* Quantity and Price */}
                            <div className="mt-2 flex justify-between items-center">
                              <div className="flex items-center border rounded-full px-2 py-1 dark:border-neutral-700">
                                <EditItemQuantityButton
                                  item={item}
                                  type="minus"
                                  optimisticUpdate={updateCartItem}
                                />
                                <span className="mx-2 w-6 text-center">
                                  {item.quantity}
                                </span>
                                <EditItemQuantityButton
                                  item={item}
                                  type="plus"
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                              <Price
                                amount={item.cost.totalAmount.amount}
                                currencyCode={
                                  item.cost.totalAmount.currencyCode
                                }
                                className="text-sm"
                              />
                            </div>
                          </li>
                        );
                      })}
                  </ul>

                  {/* Summary */}
                  <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                    <div className="flex justify-between border-t pt-2 border-neutral-200 dark:border-neutral-700">
                      <span>Taxes</span>
                      <Price
                        amount={cart.cost.totalTaxAmount.amount}
                        currencyCode={cart.cost.totalTaxAmount.currencyCode}
                      />
                    </div>
                    <div className="flex justify-between border-t pt-2 border-neutral-200 dark:border-neutral-700">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 border-neutral-200 dark:border-neutral-700 font-semibold text-black dark:text-white">
                      <span>Total</span>
                      <Price
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <form action={redirectToCheckout} className="mt-4">
                    <CheckoutButton />
                  </form>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-blue-600 p-3 text-white font-medium text-sm hover:opacity-90 disabled:opacity-50"
    >
      {pending ? <LoadingDots className="bg-white" /> : "Proceed to Checkout"}
    </button>
  );
}
