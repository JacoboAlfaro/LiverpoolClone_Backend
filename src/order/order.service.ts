import { Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "crypto";
import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  async createOrder(orderData: any) {
    const order = {
      id: randomUUID(),
      fecha: new Date().toISOString(),
      ...orderData,
    };

    this.logger.log("Pedido recibido:", order);

    if (order.email) {
      try {
        await this.sendConfirmationEmail(order);
      } catch (err) {
        this.logger.error("Error al enviar correo:", err);
      }
    }

    this.logger.log("Orden creada con ID:", order.id);
    return order;
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
}
