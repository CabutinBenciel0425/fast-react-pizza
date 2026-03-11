import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { useEffect } from "react";
import { updateOrder } from "../../services/apiRestaurant";

export default function UpdateOrder({ order }) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (!fetcher.data && fetcher.state === "idle") fetcher.load("/menu");
  }, [fetcher]);

  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make this order priority</Button>
    </fetcher.Form>
  );
}

export async function action({ params }) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}
