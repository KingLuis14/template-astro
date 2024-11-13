import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { createTransport } from "nodemailer";

const phoneRegex = /^(9\d{2} \d{3} \d{3})$/;

const nameRegex = /^[a-zA-Z\s]+$/;

export const server = {
  newsletter: defineAction({
    accept: "form",
    input: z.object({
      name: z
        .string()
        .regex(nameRegex, "Name must contain only letters and spaces"),
      mensaje: z.string().optional(),
      email: z.string().email(),
    }),
    handler: async ({ email, name, mensaje }) => {
      console.log({ email, name, mensaje });

      // console.log(import.meta.env.EMAIL);

      let transporter = createTransport({
        host: import.meta.env.EMAIL_HOST,
        port: import.meta.env.EMAIL_PORT,
        secure: true,
        auth: {
          user: import.meta.env.EMAIL,
          pass: import.meta.env.EMAIL_PASS,
        },
      });

      // Configuración del correo
      let mailToUser = {
        from: import.meta.env.EMAIL, // El remitente
        to: email, // Destinatario
        subject: "Correo enviado con satisfaccion",
        html: `<h1>Gracias ${name} por contactarte conmigo, me pondre en contacto contigo lo más pronto posible</h1>`,
      };

      let mailToSelf = {
        from: import.meta.env.EMAIL, // El remitente
        to: import.meta.env.EMAIL, // Correo de la institución o tu correo
        subject: "Tienes un futuro cliente web",
        html: `<h1></h1>
          <p><b>Nombre:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Número:</b> ${mensaje}</p>`,
      };



      try {
        // Envía el correo al usuario
        await transporter.sendMail(mailToUser);
        console.log("Correo enviado al usuario");

        // Envía el correo a la institución
        await transporter.sendMail(mailToSelf);
        console.log("Correo enviado a mi");

        return { success: true };
      } catch (error) {
        console.error("Error al enviar el correo:", error);
        return { success: false };
      }

      
    },
  }),
};
