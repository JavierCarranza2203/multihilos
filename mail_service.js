import { Mailer } from './mailer.js';

const htmlHeaderTemplate = (nombreCliente, asunto) => {
return (`
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #ffffff;
                }
                .message {
                    font-size: 18px;
                    color: #333;
                    margin: 20px;
                }
                .message img {
                    width: 150px
                }
            </style>
        </head>
        <body>
            <div class="message">
                <h2>¡Buen día, ${ nombreCliente }!</h2>
                <p>${ asunto }.
                    <br>
                    <br>
                        Se le adjunta el formato de pedimentos aduanales que debe usar.
                    <br>
                    <br>
                        ¡Saludos!
                    <br>
                </p>
            </div>
        </body>
    </html>
`)};

export class ServicioDeEnvioDeCorreos {
    static async EnviarCorreo(nombreCliente, correoDestinatario) {
        const mailService = new Mailer();

        const body = htmlHeaderTemplate(nombreCliente, `FORMATO DE PEDIMENTO`);

        mailService.CreateMail(correoDestinatario, `ENVIO DE FORMATO -- ${ nombreCliente }`, body);

        await mailService.SendMail();
    }
}