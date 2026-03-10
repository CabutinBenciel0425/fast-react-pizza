import { formatCurrency } from "../../utilities/helpers";
import { useDispatch, useSelector } from "react-redux";
import { addItem, deleteItem, getCart } from "../cart/cartSlice";
import Button from "../../ui/Button";
import UpdateItemQuantity from "../cart/UpdateItemQuantity";

function MenuItem({ pizza }) {
  const dispatch = useDispatch();
  const cart = useSelector(getCart);

  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;

  const isOnCart = cart.some((item) => item.pizzaId === id);

  function handleDeleteItem() {
    dispatch(deleteItem(id));
  }

  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice * 1,
    };
    dispatch(addItem(newItem));
  }

  return (
    <li className="flex gap-4 py-2">
      <img
        src={imageUrl}
        alt={name}
        className={`h-24 ${soldOut ? "opacity-70 grayscale" : ""} rounded-md`}
      />
      <div className="flex grow flex-col pt-0.5">
        <p className="font-medium">{name}</p>
        <p className="text-sm capitalize italic text-stone-500">
          {ingredients.join(", ")}
        </p>
        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? (
            <p className="text-sm">{formatCurrency(unitPrice)}</p>
          ) : (
            <p className="text-sm font-medium uppercase text-stone-500">
              Sold out
            </p>
          )}
          <div className="item-center flex justify-between gap-4">
            {!soldOut && isOnCart && <UpdateItemQuantity pizzaId={id} />}
            {!soldOut && (
              <Button
                type={isOnCart ? "secondarySmall" : "small"}
                onClick={isOnCart ? handleDeleteItem : handleAddToCart}
              >
                {isOnCart ? "Delete Item" : "Add to Cart"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
