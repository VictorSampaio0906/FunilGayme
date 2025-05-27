
# 🚀 Sistema de Checkout Completo

Sistema moderno de checkout com integração PushinPay, valores dinâmicos e design profissional.

## ✨ Funcionalidades

### ✅ Backend Seguro
- **Node.js + Express** com variáveis de ambiente
- **Integração PushinPay** para geração de Pix
- **Webhook** preparado para notificações automáticas
- **Validações** completas de dados
- **CORS** configurado para produção

### ✅ Frontend Moderno
- **React + TypeScript** para type safety
- **ShadCN/UI** para componentes elegantes
- **Tailwind CSS** para design responsivo
- **Gradientes e efeitos** visuais modernos
- **Animações** suaves e profissionais

### ✅ Valores Dinâmicos
- `?fluxo=vsl` → **R$ 19,90**
- `?fluxo=popup` → **R$ 9,90**
- Detecção automática via URL

### ✅ Funcionalidades Pix
- **QR Code** para pagamento
- **Chave Pix** copia e cola
- **Botão copiar** com feedback visual
- **Validações** de formulário

## 🛠️ Configuração

### 1. Backend

```bash
cd backend
npm install
```

Configure o arquivo `.env`:
```env
PUSHINPAY_TOKEN=SEU_TOKEN_AQUI
PUSHINPAY_API=https://api.pushinpay.com/payment
PORT=3001
NODE_ENV=development
```

Inicie o servidor:
```bash
npm run dev
```

### 2. Frontend

O frontend já está configurado! Acesse:
- VSL: `http://localhost:5173?fluxo=vsl`
- Popup: `http://localhost:5173?fluxo=popup`

## 🔗 Como usar nos seus fluxos

### Na sua VSL:
```html
<a href="https://checkout.seusite.com?fluxo=vsl" class="btn-comprar">
  Comprar por R$ 19,90
</a>
```

### No seu Pop-up:
```html
<a href="https://checkout.seusite.com?fluxo=popup" class="btn-oferta">
  Aproveite por R$ 9,90
</a>
```

## 📦 Estrutura do Projeto

```
/checkout-system
├── backend/
│   ├── .env                 # Variáveis de ambiente
│   ├── server.js           # Servidor Express
│   ├── package.json        # Dependências backend
│   └── .gitignore         # Arquivos ignorados
├── src/
│   ├── components/
│   │   └── Checkout.tsx   # Componente principal
│   └── pages/
│       └── Index.tsx      # Página inicial
└── README.md              # Este arquivo
```

## 🎨 Design Features

- **Gradientes** animados de fundo
- **Backdrop blur** para efeito de vidro
- **Animações** de entrada suaves
- **Estados visuais** para feedback
- **Design responsivo** para mobile
- **Tema escuro** moderno

## 🔐 Segurança

- ✅ Validação de dados no backend
- ✅ CORS configurado corretamente
- ✅ Variáveis sensíveis em `.env`
- ✅ Sanitização de inputs
- ✅ Headers de segurança

## 🚀 Próximos Passos

### Webhook Implementation
```javascript
// No backend (server.js)
app.post('/webhook/pushinpay', (req, res) => {
  const { payment_id, status } = req.body;
  
  if (status === 'paid') {
    // 1. Validar pagamento
    // 2. Enviar produto por email
    // 3. Marcar como entregue
  }
});
```

### Automação de Entrega
```javascript
// Função para enviar produto
async function enviarProduto(email, nome) {
  // Integração com seu provedor de email
  // Anexar produto digital
  // Registrar entrega no banco
}
```

## 📱 URLs de Teste

- **VSL**: `http://localhost:5173?fluxo=vsl`
- **Popup**: `http://localhost:5173?fluxo=popup`
- **Health Check**: `http://localhost:3001/health`

## 🎯 Integração PushinPay

1. Cadastre-se no [PushinPay](https://pushinpay.com)
2. Obtenha seu token de API
3. Configure no arquivo `.env`
4. Descomente as linhas da integração real no `server.js`

## 💡 Customização

### Alterar Valores
```javascript
// No backend (server.js)
const valores = {
  'vsl': 1990,    // R$ 19,90
  'popup': 990,   // R$ 9,90
  'especial': 590 // R$ 5,90 (novo fluxo)
};
```

### Adicionar Novos Fluxos
```javascript
// Adicione novos parâmetros
const fluxo = new URLSearchParams(window.location.search).get('fluxo');
```

---

**Desenvolvido com ❤️ para conversões máximas!**
