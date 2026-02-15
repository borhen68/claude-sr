export async function getOrders(status?: string) {
  const url = status
    ? `/api/orders?status=${status}`
    : "/api/orders";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
}

export async function getOrder(id: string) {
  const response = await fetch(`/api/orders/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }

  return response.json();
}

export async function createOrder(data: {
  projectId: string;
  plan: string;
  amount: number;
  currency?: string;
  shippingAddress?: string;
}) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create order");
  }

  return response.json();
}

export async function updateOrder(id: string, data: any) {
  const response = await fetch(`/api/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update order");
  }

  return response.json();
}
