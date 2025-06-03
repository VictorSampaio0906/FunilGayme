import CheckoutForm from "@/components/CheckoutForm";

export default function CheckoutOferta() {
  return (
    <CheckoutForm
      fluxo="popup"
      preco={9.9}
      precoOriginal={19.9}
      descricao="Oferta Especial - Última Chance!"
      tema="red"
    />
  );
}
