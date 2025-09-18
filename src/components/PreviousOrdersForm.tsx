import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
}

interface PreviousOrder {
  orderId: string;
  items: OrderItem[];
  orderDateTime: string;
}

interface PreviousOrdersFormProps {
  previousOrders: PreviousOrder[];
  onAddPreviousOrder: (order: PreviousOrder) => void;
  onRemovePreviousOrder: (index: number) => void;
}

export const PreviousOrdersForm: React.FC<PreviousOrdersFormProps> = ({
  previousOrders,
  onAddPreviousOrder,
  onRemovePreviousOrder,
}) => {
  const [newPreviousOrder, setNewPreviousOrder] = useState({
    orderId: "",
    items: [],
    orderDateTime: "",
  });
  const [newOrderItem, setNewOrderItem] = useState({ name: "", quantity: "" });

  const handleAddPreviousOrder = () => {
    if (
      newPreviousOrder.orderId.trim() &&
      newPreviousOrder.orderDateTime &&
      newPreviousOrder.items.some((item) => item.name.trim())
    ) {
      onAddPreviousOrder({
        ...newPreviousOrder,
        orderDateTime: newPreviousOrder.orderDateTime,
      });
      setNewPreviousOrder({
        orderId: "",
        items: [],
        orderDateTime: "",
      });
    }
  };

  const handleAddItemToOrder = () => {
    if (newOrderItem.name.trim()) {
      setNewPreviousOrder((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            name: newOrderItem.name,
            quantity: parseInt(newOrderItem.quantity) || 1,
          },
        ],
      }));
      setNewOrderItem({ name: "", quantity: "" });
    }
  };

  const handleRemoveItemFromOrder = (itemIndex: number) => {
    setNewPreviousOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== itemIndex),
    }));
  };

  return (
    <Card className="health-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Previous Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="prevOrderId">Order ID</Label>
            <Input
              id="prevOrderId"
              type="text"
              placeholder="Order ID"
              value={newPreviousOrder.orderId}
              onChange={(e) =>
                setNewPreviousOrder((prev) => ({
                  ...prev,
                  orderId: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="orderDateTime">Order Date & Time</Label>
            <Input
              id="orderDateTime"
              type="datetime-local"
              value={newPreviousOrder.orderDateTime}
              onChange={(e) =>
                setNewPreviousOrder((prev) => ({
                  ...prev,
                  orderDateTime: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <Label className="text-base font-medium">Order Items</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <Input
                placeholder="Item name"
                value={newOrderItem.name}
                onChange={(e) =>
                  setNewOrderItem((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Input
                type="number"
                min="1"
                placeholder="Quantity"
                value={newOrderItem.quantity}
                onChange={(e) =>
                  setNewOrderItem((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
              />
            </div>
            <Button
              type="button"
              onClick={handleAddItemToOrder}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {newPreviousOrder.items.length > 0 &&
            newPreviousOrder.items.some((item) => item.name.trim()) && (
              <div className="mt-4 space-y-2">
                <Label className="text-sm font-medium">Current Items:</Label>
                {newPreviousOrder.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span>
                      {item.name || "Unnamed item"} (Qty: {item.quantity})
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItemFromOrder(itemIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
        </div>

        <Button
          type="button"
          onClick={handleAddPreviousOrder}
          variant="outline"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Previous Order
        </Button>

        <div className="space-y-4">
          {previousOrders?.map((order, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Order ID: {order.orderId}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemovePreviousOrder(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Date: {new Date(order.orderDateTime).toLocaleString()}
              </p>
              <div className="space-y-1">
                <Label className="text-sm">Items:</Label>
                {order.items.map((item, itemIndex) => (
                  <p key={itemIndex} className="text-sm ml-4">
                    • {item.name} (Quantity: {item.quantity})
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
