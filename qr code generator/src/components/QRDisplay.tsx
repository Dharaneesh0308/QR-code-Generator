import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

interface QRDisplayProps {
  value: string;
  fgColor: string;
  bgColor: string;
  size: number;
  logo?: string;
}

export default function QRDisplay({ value, fgColor, bgColor, size, logo }: QRDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  
  // Safety check for data length
  const isTooLong = value && value.length > 2500;

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-code-${Date.now()}.png`;
    link.click();
    toast.success("QR Code downloaded!");
  };

  const handleCopy = async () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]);
        toast.success("QR Code copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy QR Code");
      }
    });
  };

  const handleShare = async () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "qr-code.png", { type: "image/png" });
      try {
        if (navigator.share) {
          await navigator.share({
            files: [file],
            title: "QR Code",
            text: "Check out this QR code!"
          });
          toast.success("QR Code shared!");
        } else {
          toast.error("Sharing not supported on this device");
        }
      } catch (err) {
        toast.error("Failed to share QR Code");
      }
    });
  };

  if (!value) {
    return (
      <div className="glass-card rounded-2xl p-8 h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-secondary/50 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-dashed border-muted-foreground/30 rounded-xl" />
          </div>
          <div>
            <p className="text-lg font-medium text-muted-foreground">No QR Code Yet</p>
            <p className="text-sm text-muted-foreground/70">Generate one to see it here</p>
          </div>
        </div>
      </div>
    );
  }

  if (isTooLong) {
    return (
      <div className="glass-card rounded-2xl p-8 h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-destructive/20 flex items-center justify-center">
            <div className="text-4xl">⚠️</div>
          </div>
          <div>
            <p className="text-lg font-medium text-destructive">Data Too Large</p>
            <p className="text-sm text-muted-foreground">
              Your content ({value.length.toLocaleString()} characters) exceeds QR code capacity (~2,500 characters max).
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-8 space-y-6">
      <h3 className="text-xl font-bold">Your QR Code</h3>
      
      <div ref={qrRef} className="flex justify-center p-8 bg-white rounded-2xl">
        <QRCodeCanvas
          value={value}
          size={size}
          fgColor={fgColor}
          bgColor={bgColor}
          level="H"
          imageSettings={logo ? {
            src: logo,
            height: size * 0.2,
            width: size * 0.2,
            excavate: true,
          } : undefined}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button
          onClick={handleDownload}
          variant="secondary"
          className="transition-smooth hover:scale-[1.02]"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button
          onClick={handleCopy}
          variant="secondary"
          className="transition-smooth hover:scale-[1.02]"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
        <Button
          onClick={handleShare}
          variant="secondary"
          className="transition-smooth hover:scale-[1.02]"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}
