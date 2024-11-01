import { parentPort, workerData } from 'worker_threads';
import { ServicioDeEnvioDeCorreos } from './mail_service.js';

(async () => {
    try {
        const clientes = workerData;

        for (let i = 0; i < clientes.length; i++) {
            let cliente = clientes[i];
            await ServicioDeEnvioDeCorreos.EnviarCorreo(cliente['nombre'], cliente['correo']);
            console.log(`Correo enviado a ${cliente['nombre']} (${cliente['correo']})`);
        }

        parentPort.postMessage('Envio de correos completado');
    } catch (error) {
        parentPort.postMessage(`Error: ${error.message}`);
    }
})();
