import { Body, Controller, Post } from "@nestjs/common";
import { OrderService } from "./order.service";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post("simulate")
  async simulateOrder(@Body() body: any) {
    console.log("Pedido recibido:", body);
    const order = await this.orderService.createOrder(body);
    console.log("Orden creada con ID:", order.id);
    return { message: "Compra creada correctamente", orderId: order.id };
  }
}
