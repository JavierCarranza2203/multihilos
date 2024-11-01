import express from 'express';
import cors from 'cors';
import { CustomerController } from './customerController.js';

const serverPort = 8082;
const app = express();

app.use(cors({
    origin: 'http://localhost',
    methods: ['GET', 'POST']
}));

app.post('/enviar-sin-multihilos', async (req, res) => {
    try {
        const controlador = new CustomerController();

        const datos = await controlador.getAllCustomers();

        await controlador.sendAllEmails(datos);

        res.status(200).json("Correos enviados");
    }
    catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.post('/enviar-con-multihilos', async (req, res) => {
    try {
        const controlador = new CustomerController();

        await controlador.sendAllEmailsMulti();

        res.status(200).json("Correos enviados");
    }
    catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.listen(serverPort, (req, res) => {
    console.log("Server enabled in port: " + serverPort);
});

process.on('unhandledRejection', (error, promise) => {
    console.log('Error in this code: ', promise);
    console.log("==================================");
    console.log('The error was: ', error );
});