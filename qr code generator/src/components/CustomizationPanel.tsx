import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Image } from "lucide-react";

interface CustomizationPanelProps {
  fgColor: string;
  bgColor: string;
  size: number;
  onFgColorChange: (color: string) => void;
  onBgColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
  onLogoChange: (logo: string) => void;
}

export default function CustomizationPanel({
  fgColor,
  bgColor,
  size,
  onFgColorChange,
  onBgColorChange,
  onSizeChange,
  onLogoChange,
}: CustomizationPanelProps) {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onLogoChange(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="glass-card rounded-2xl p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="gradient-accent p-3 rounded-xl glow-effect">
          <Palette className="w-6 h-6 text-accent-foreground" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Customize</h3>
          <p className="text-sm text-muted-foreground">Personalize your QR code</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Foreground Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={fgColor}
                onChange={(e) => onFgColorChange(e.target.value)}
                className="w-16 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={fgColor}
                onChange={(e) => onFgColorChange(e.target.value)}
                className="flex-1 transition-smooth hover:border-primary"
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={bgColor}
                onChange={(e) => onBgColorChange(e.target.value)}
                className="w-16 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={bgColor}
                onChange={(e) => onBgColorChange(e.target.value)}
                className="flex-1 transition-smooth hover:border-primary"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="mb-2 block">QR Code Size</Label>
          <Select value={size.toString()} onValueChange={(value) => onSizeChange(Number(value))}>
            <SelectTrigger className="transition-smooth hover:border-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="200">Small (200px)</SelectItem>
              <SelectItem value="300">Medium (300px)</SelectItem>
              <SelectItem value="400">Large (400px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 flex items-center gap-2">
            <Image className="w-4 h-4" />
            Center Logo (Optional)
          </Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="transition-smooth hover:border-primary"
          />
          <p className="text-xs text-muted-foreground mt-2">Upload a logo to display in the center</p>
        </div>
      </div>
    </div>
  );
}
