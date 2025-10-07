import { useState, useEffect } from "react";
import QRGenerator from "@/components/QRGenerator";
import QRDisplay from "@/components/QRDisplay";
import CustomizationPanel from "@/components/CustomizationPanel";
import QRHistory from "@/components/QRHistory";
import { Zap } from "lucide-react";

interface QRHistoryItem {
  id: string;
  value: string;
  type: string;
  timestamp: number;
  fgColor: string;
  bgColor: string;
  size: number;
}

export default function Index() {
  const [qrValue, setQrValue] = useState("");
  const [qrType, setQrType] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrSize, setQrSize] = useState(300);
  const [logo, setLogo] = useState("");
  const [history, setHistory] = useState<QRHistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("qr-history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (value: string, type: string) => {
    const newItem: QRHistoryItem = {
      id: Date.now().toString(),
      value,
      type,
      timestamp: Date.now(),
      fgColor,
      bgColor,
      size: qrSize,
    };

    const updatedHistory = [newItem, ...history].slice(0, 20);
    setHistory(updatedHistory);
    localStorage.setItem("qr-history", JSON.stringify(updatedHistory));
  };

  const handleGenerate = (data: string, type: string) => {
    setQrValue(data);
    setQrType(type);
    saveToHistory(data, type);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("qr-history");
  };

  const handleRestoreFromHistory = (item: QRHistoryItem) => {
    setQrValue(item.value);
    setQrType(item.type);
    setFgColor(item.fgColor);
    setBgColor(item.bgColor);
    setQrSize(item.size);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-3 gradient-primary px-6 py-3 rounded-full glow-effect">
            <Zap className="w-6 h-6 text-primary-foreground" />
            <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
              Advanced QR Code Generator
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate custom QR codes with embedded images/videos, full customization, and history tracking
          </p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <QRGenerator onGenerate={handleGenerate} />
            <CustomizationPanel
              fgColor={fgColor}
              bgColor={bgColor}
              size={qrSize}
              onFgColorChange={setFgColor}
              onBgColorChange={setBgColor}
              onSizeChange={setQrSize}
              onLogoChange={setLogo}
            />
          </div>

          <div>
            <QRDisplay
              value={qrValue}
              fgColor={fgColor}
              bgColor={bgColor}
              size={qrSize}
              logo={logo}
            />
          </div>
        </div>

        {/* History Section */}
        <QRHistory
          history={history}
          onClearHistory={handleClearHistory}
          onRestore={handleRestoreFromHistory}
        />
      </div>
    </div>
  );
}
