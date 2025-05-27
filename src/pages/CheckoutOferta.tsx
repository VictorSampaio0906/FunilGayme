
import CheckoutForm from '@/components/CheckoutForm';

export default function CheckoutOferta() {
  return (
    <CheckoutForm
      fluxo="popup"
      preco={9.90}
      precoOriginal={19.90}
      descricao="Oferta Especial - Última Chance!"
      tema="red"
    />
  );
}
