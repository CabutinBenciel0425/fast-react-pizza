import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQuantityItem,
  deleteItem,
  getCart,
  increaseQuantityItem,
} from "./cartSlice";
import Button from "../../ui/Button";

export default function UpdateItemQuantity({ pizzaId }) {
  const cart = useSelector(getCart);
  const dispatch = useDispatch();

  const item = cart.find((item) => item.pizzaId === pizzaId);
  const quantity = item ? item.quantity : 0;

  function handleDecreaseQuantity() {
    if (quantity === 1) {
      dispatch(deleteItem(pizzaId));
    }
    dispatch(decreaseQuantityItem({ pizzaId }));
  }

  function handleIncreaseQuantity() {
    dispatch(increaseQuantityItem({ pizzaId }));
  }

  return (
    <div>
      <Button type="roundSmall" onClick={handleDecreaseQuantity}>
        -
      </Button>
      <span className="px-2 text-sm font-semibold">{quantity}</span>
      <Button type="roundSmall" onClick={handleIncreaseQuantity}>
        +
      </Button>
    </div>
  );
}
