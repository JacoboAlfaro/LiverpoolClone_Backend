import { Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "crypto";
import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import { Order } from "./order.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

dotenv.config();

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(@InjectModel(Order.name) private orderModel: Model<Order & Document>) {}

  async createOrder(orderData: any) {
    this.logger.log("🟢 Pedido recibido:", orderData);

    try {
      // 1️⃣ Guardar en base de datos
      const order = new this.orderModel(orderData);
      await order.save();

      this.logger.log(`✅ Orden creada con ID: ${order.id}`);

      // 2️⃣ Enviar correo al usuario
      await this.sendConfirmationEmail(order);

      return order;
    } catch (error) {
      this.logger.error("❌ Error al crear o enviar orden:", error);
      throw new Error("Error interno al procesar la orden");
    }
  }

  private async sendConfirmationEmail(order: any) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const html = `
      <h2>¡Gracias por tu compra simulada en Liverpool!</h2>
      <p>Tu orden se ha generado con éxito.</p>
      <p><strong>ID de orden:</strong> ${order.id}</p>
      <p><strong>Método de pago:</strong> ${order.metodoPago}</p>
      <p><strong>Total:</strong> $${order.total.toLocaleString()} MXN</p>
      <hr />
      <p>Este correo es la factura de tu compra.</p>
    `;

    const info = await transporter.sendMail({
      from: '"Liverpool México (Simulación)" <noreply@liverpool.com.mx>',
      to: order.email,
      subject: "Factura simulada - Liverpool México",
      html,
    });

    this.logger.log("Correo enviado con éxito a:", order.email);
    this.logger.debug("Detalles:", info);
  }

  async getOrdersByUser(userId: string) {
    try {
      const orders = await this.orderModel.find({ userId }).sort({ createdAt: -1 });
      this.logger.log(`🧾 ${orders.length} órdenes encontradas para ${userId}`);
      return orders;
    } catch (error) {
      this.logger.error("❌ Error al obtener órdenes:", error);
      throw error;
    }
  }
}
