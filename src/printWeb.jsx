import React from 'react'

export default function printWeb() {
  const connectToPrinter = async () => {
    try {
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb'] // UUID de l'imprimante thermique
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
        const characteristic = await service.getCharacteristic('00002af0-0000-1000-8000-00805f9b34fb');

        return characteristic;
    } catch (error) {
        console.error("Erreur de connexion à l'imprimante :", error);
    }
  };

  return (
    <div>printWeb</div>
  )
}
