import { pool } from "./db_connection.js";
import { ServicioDeEnvioDeCorreos } from "./mail_service.js";
import { Worker } from 'worker_threads';

export class CustomerController {
    async getAllCustomers() {
        try {
            const [rows, fields] = await pool.query("SELECT * FROM clientes");

            return rows;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAllCustomersMulti() {
        const emails = await this.getAllCustomers();
        
        const mitad = Math.ceil(emails.length / 2); 
        const primerosEmails = emails.slice(0, mitad);
        const segundosEmails = emails.slice(mitad);

        return {primerosEmails, segundosEmails}
    }

    async sendAllEmails(data) {
        try {
            for (let i = 0; i < data.length; i++) {
                let cliente = data[i];

                await ServicioDeEnvioDeCorreos.EnviarCorreo(cliente['nombre'], cliente['correo']);

                console.log(cliente['nombre']);
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async sendAllEmailsMulti() {
        try {
            const { primerosEmails, segundosEmails } = await this.getAllCustomersMulti();

            const runWorker = (emails) => {
                return new Promise((resolve, reject) => {
                    const worker = new Worker('./email_worker.js', {
                        workerData: emails
                    });
    
                    worker.on('message', (message) => {
                        console.log('Worker message:', message);
                    });
    
                    worker.on('error', (error) => {
                        reject(error);
                    });
    
                    worker.on('exit', (code) => {
                        if (code === 0) {
                            resolve(`Worker finished with code: ${code}`);
                        } else {
                            reject(new Error(`Worker stopped with exit code ${code}`));
                        }
                    });
                });
            };

            await Promise.all([
                runWorker(primerosEmails),
                runWorker(segundosEmails)
            ]);
    
            return "Correos enviados";
        } catch (error) {
            throw new Error(error);
        }
    }
}