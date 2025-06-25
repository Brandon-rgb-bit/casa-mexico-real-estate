import React from "react";
const ComprobantePage = () => <div className="max-w-md mx-auto mt-10 p-6 rounded shadow bg-zinc-950">
    <h1 className="text-lg font-bold mb-4">Upgrade a plan premium</h1>
    <ol className="mb-4 list-decimal list-inside text-sm">
      <li>Haz el pago en <a className="text-blue-600 underline" target="_blank" href="https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=2c9380849763dae001976c4da03e033a">este enlace de Mercado Pago</a></li>
      <li>Guarda el comprobante como imagen/captura.</li>
      <li>Envía el comprobante por WhatsApp al <a href="https://wa.me/5217717789580" className="text-green-600 underline" target="_blank">7717789580</a> para que el admin te habilite más publicaciones.</li>
    </ol>
    <p className="mb-2 text-xs text-gray-500">Recuerda: tu upgrade será gestionado manualmente por el administrador.</p>
  </div>;
export default ComprobantePage;
