import { useEffect, useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import { formatCurrency } from "../../utilities/helpers";
import { fetchAddress } from "../user/userSlice";
import EmptyCart from "../cart/EmptyCart";
import Button from "../../ui/Button";
import store from "../../store";

const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [localAddress, setLocalAddress] = useState("");
  const [withPriority, setWithPriority] = useState(false);
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);
  const isLoadingAddress = addressStatus === "loading";
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isSubmitting = navigation.state === "submitting";
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  const formErrors = useActionData();

  useEffect(() => {
    setLocalAddress(address);
  }, [address]);

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">
        Ready to order? Let&apos;s go!
      </h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            required
            className="input grow"
            defaultValue={username}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full" />
          </div>
          {formErrors?.phone && (
            <p className="rounded-md bg-red-100 p-2 text-xs text-red-700">
              {formErrors.phone}
            </p>
          )}
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              required
              className="input w-full"
              disabled={isLoadingAddress}
              value={localAddress}
              onChange={(e) => setLocalAddress(e.target.value)}
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-center text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="z-100 absolute right-[3.5px] top-[34.5px] sm:right-[3.5px] sm:top-[3px] md:right-[5px] md:top-[5px]">
              <Button
                disabled={isSubmitting || isLoadingAddress}
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
          />
          <label htmlFor="priority" className="font-medium">
            Do you want your order be priority?
          </label>
        </div>

        <div className="flex items-center justify-between gap-4">
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.longitude
                ? `${position.latitude}, ${position.longitude}`
                : ""
            }
          />
          <Button disabled={isSubmitting} type="primary">
            {isSubmitting ? "Submitting order..." : "Order now"}
          </Button>
          <span className="text-md">
            Your total:
            <span className="text-lg font-semibold">
              {withPriority
                ? ` ${formatCurrency(totalPrice)} (${formatCurrency(totalCartPrice)} + 20% priority fee)`
                : ` ${formatCurrency(totalPrice)}`}
            </span>
          </span>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  console.log(order);

  const errors = {};
  if (!isValidPhone(order.phone)) errors.phone = "Phone number is not valid";

  if (Object.keys(errors).length) return errors;

  const newOrder = await createOrder(order);

  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
