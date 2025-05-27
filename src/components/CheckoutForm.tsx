import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Copy,
  Check,
  CreditCard,
  QrCode,
  Mail,
  User,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PixData {
  payment_url: string;
  qr_code: string;
  qr_code_base64: string;
  payment_id: string;
  status: string;
  amount: number;
}

interface CheckoutFormProps {
  fluxo: "vsl" | "popup";
  preco: number;
  descricao: string;
  tema?: "purple" | "red";
  precoOriginal?: number;
}

// ✅ CORREÇÃO: API_URL com import.meta.env para Vite/React
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function CheckoutForm({
  fluxo,
  preco,
  descricao,
  tema = "purple",
  precoOriginal,
}: CheckoutFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const isOferta = fluxo === "popup";
  const temDesconto = precoOriginal && precoOriginal > preco;

  const cores = {
    purple: {
      gradientBg: "from-slate-900 via-purple-900 to-slate-900",
      gradientCard: "from-purple-500 to-blue-500",
      gradientText: "from-purple-400 to-blue-400",
      gradientButton:
        "from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
      borderFocus: "focus:border-purple-500",
      effects: "bg-purple-500/10",
      badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    red: {
      gradientBg: "from-red-900 via-orange-900 to-red-900",
      gradientCard: "from-red-500 to-orange-500",
      gradientText: "from-red-400 to-orange-400",
      gradientButton:
        "from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700",
      borderFocus: "focus:border-red-500",
      effects: "bg-red-500/10",
      badgeBg: "bg-red-500/20 text-red-300 border-red-500/30",
    },
  };

  const cor = cores[tema];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 1000);
  }, []);

  const gerarPix = async () => {
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e email.",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes("@")) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("🔄 Tentando gerar Pix...", { name, email, fluxo, preco });
      console.log("📡 URL da API:", `${API_URL}/create_pix`);

      const response = await fetch(`${API_URL}/create_pix`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, fluxo }),
      });

      console.log("📥 Status da resposta:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro da resposta:", errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ Resultado recebido:", result);

      if (result.success && result.data) {
        setPixData(result.data);
        toast({
          title: "Pagamento gerado! 🎉",
          description: "Escaneie o QR Code ou copie a chave Pix.",
        });
      } else {
        throw new Error(result.error || "Erro desconhecido ao gerar pagamento");
      }
    } catch (error) {
      console.error("❌ Erro completo:", error);

      let errorMessage = "Tente novamente em alguns segundos.";

      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Não foi possível conectar com o servidor. Verifique sua conexão.";
        } else if (error.message.includes("NetworkError")) {
          errorMessage = "Erro de rede. Verifique sua conexão com a internet.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Erro ao gerar pagamento",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copiarChavePix = async () => {
    if (pixData?.qr_code) {
      try {
        await navigator.clipboard.writeText(pixData.qr_code);
        setCopied(true);
        toast({
          title: "Chave Pix copiada! 📋",
          description: "Cole no seu app de pagamentos.",
        });

        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast({
          title: "Erro ao copiar",
          description: "Tente selecionar e copiar manualmente.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${cor.gradientBg} flex items-center justify-center p-4 relative overflow-hidden`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${cor.gradientBg
            .replace("from-", "from-")
            .replace("via-", "via-transparent to-")}/10`}
        ></div>
      </div>

      <div
        className={`absolute top-10 left-10 w-72 h-72 ${cor.effects} rounded-full blur-3xl animate-pulse`}
      ></div>
      <div
        className={`absolute bottom-10 right-10 w-96 h-96 ${cor.effects} rounded-full blur-3xl animate-pulse delay-1000`}
      ></div>

      <Card className="w-full max-w-lg backdrop-blur-xl border border-white/20 bg-white/10 text-white shadow-2xl animate-in slide-in-from-bottom-5 duration-700">
        <CardHeader className="text-center pb-4">
          <div
            className={`mx-auto w-16 h-16 bg-gradient-to-r ${cor.gradientCard} rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-500 delay-200`}
          >
            <CreditCard className="w-8 h-8 text-white" />
          </div>

          <CardTitle
            className={`text-2xl font-bold bg-gradient-to-r ${cor.gradientText} bg-clip-text text-transparent`}
          >
            {isOferta ? "🔥 Oferta Especial 🔥" : "Checkout Seguro"}
          </CardTitle>

          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge
              variant="secondary"
              className={`${cor.badgeBg} ${isOferta ? "animate-pulse" : ""}`}
            >
              {descricao}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Informações do Produto */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">E-book XYZ</span>
              <div className="text-right">
                {temDesconto && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      R$ {precoOriginal!.toFixed(2)}
                    </span>
                    <br />
                  </>
                )}
                <span
                  className={`${
                    temDesconto ? "text-3xl" : "text-2xl"
                  } font-bold text-green-400`}
                >
                  R$ {preco.toFixed(2)}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {isOferta ? "⚡" : ""} Pagamento via Pix • Aprovação instantânea
            </p>
            {temDesconto && (
              <p className="text-xs text-red-300 mt-1 font-semibold">
                🎯 50% de desconto - Por tempo limitado!
              </p>
            )}
          </div>

          {!pixData ? (
            <>
              {/* Formulário */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome completo
                  </label>
                  <Input
                    placeholder="Digite seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${cor.borderFocus} transition-colors`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${cor.borderFocus} transition-colors`}
                  />
                </div>
              </div>

              <Button
                onClick={gerarPix}
                disabled={loading}
                className={`w-full bg-gradient-to-r ${cor.gradientButton} text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 disabled:scale-100`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando pagamento...
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4 mr-2" />
                    {isOferta
                      ? `🔥 Aproveitar Oferta R$ ${preco.toFixed(2)}`
                      : "Gerar Pagamento Pix"}
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Dados do Pix */}
              <div className="space-y-6 animate-in slide-in-from-top-3 duration-500">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">
                    Pagamento Gerado! 🎉
                  </h3>
                  <p className="text-sm text-gray-300">
                    Escaneie o QR Code ou copie a chave Pix abaixo
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 mx-auto w-fit">
                  <img
                    src={pixData.qr_code_base64}
                    alt="QR Code Pix"
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Chave Pix (Código Copia e Cola)
                  </label>
                  <Textarea
                    readOnly
                    value={pixData.qr_code}
                    className="bg-white/5 border-white/20 text-white text-xs font-mono resize-none h-24"
                  />
                </div>

                <Button
                  onClick={copiarChavePix}
                  className={`w-full transition-all duration-300 ${
                    copied
                      ? "bg-green-600 hover:bg-green-700"
                      : `bg-gradient-to-r ${cor.gradientButton}`
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Chave Pix
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    ID do Pagamento: {pixData.payment_id}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Após o pagamento, você receberá o produto por email em até 5
                    minutos
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Pagamento 100% seguro via Pix</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
