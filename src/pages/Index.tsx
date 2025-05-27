
import CheckoutForm from '@/components/CheckoutForm';

export default function Index() {
  return (
    <CheckoutForm
      fluxo="vsl"
      preco={19.90}
      descricao="Oferta Principal VSL"
      tema="purple"
    />
  );
}
