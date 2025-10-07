import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Link, Type, Phone, Mail, Image, Video, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type QRType = "text" | "url" | "phone" | "email" | "image" | "video";

interface QRGeneratorProps {
  onGenerate: (data: string, type: QRType) => void;
}

export default function QRGenerator({ onGenerate }: QRGeneratorProps) {
  const [qrType, setQrType] = useState<QRType>("text");
  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 2MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleGenerate = async () => {
    const MAX_QR_LENGTH = 2500; // Safe limit for text-based QR codes

    if (qrType === "image" || qrType === "video") {
      if (!selectedFile) {
        toast.error("Please select a file");
        return;
      }

      // Upload file and get URL
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const { data, error } = await supabase.functions.invoke('upload-media', {
          body: formData,
        });

        if (error) throw error;

        const mediaUrl = data.url;
        onGenerate(mediaUrl, qrType);
        toast.success(`QR Code generated! Scan to view your ${qrType}`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${qrType}. Please try again.`);
      } finally {
        setIsUploading(false);
      }
    } else {
      if (!inputValue.trim()) {
        toast.error("Please enter some content");
        return;
      }

      let formattedData = inputValue;
      if (qrType === "phone") formattedData = `tel:${inputValue}`;
      if (qrType === "email") formattedData = `mailto:${inputValue}`;

      // Validate text length
      if (formattedData.length > MAX_QR_LENGTH) {
        toast.error(
          `Content too long! QR codes can hold max ~2,500 characters. Your content is ${formattedData.length} characters.`,
          { duration: 5000 }
        );
        return;
      }

      onGenerate(formattedData, qrType);
      toast.success("QR Code generated!");
    }
  };

  const getIcon = () => {
    switch (qrType) {
      case "url": return <Link className="w-5 h-5" />;
      case "phone": return <Phone className="w-5 h-5" />;
      case "email": return <Mail className="w-5 h-5" />;
      case "image": return <Image className="w-5 h-5" />;
      case "video": return <Video className="w-5 h-5" />;
      default: return <Type className="w-5 h-5" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="gradient-primary p-3 rounded-xl glow-effect">
          <QrCode className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Generate QR Code</h2>
          <p className="text-sm text-muted-foreground">Create custom QR codes with embedded content</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>QR Code Type</Label>
          <Select value={qrType} onValueChange={(value) => setQrType(value as QRType)}>
            <SelectTrigger className="transition-smooth hover:border-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Plain Text</SelectItem>
              <SelectItem value="url">Website Link</SelectItem>
              <SelectItem value="phone">Phone Number</SelectItem>
              <SelectItem value="email">Email Address</SelectItem>
              <SelectItem value="image">Image (Base64)</SelectItem>
              <SelectItem value="video">Video (Base64)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(qrType === "image" || qrType === "video") ? (
          <div>
            <Label>Upload {qrType === "image" ? "Image" : "Video"} (Max 2MB)</Label>
            <div className="relative space-y-2">
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-3">
                <p className="text-xs text-primary-foreground">
                  ✨ <strong>Cloud Storage:</strong> Your {qrType} will be uploaded to secure cloud storage. 
                  The QR code will contain a URL that opens your media when scanned.
                </p>
              </div>
              <Input
                type="file"
                accept={qrType === "image" ? "image/*" : "video/*"}
                onChange={handleFileSelect}
                className="transition-smooth hover:border-primary"
              />
              {selectedFile && (
                <p className="text-sm text-accent mt-2">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)}KB)
                </p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <Label className="flex items-center gap-2">
              {getIcon()}
              Enter {qrType === "url" ? "URL" : qrType === "phone" ? "Phone Number" : qrType === "email" ? "Email" : "Text"}
            </Label>
            {qrType === "text" ? (
              <Textarea
                placeholder="Enter your message here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="min-h-[100px] transition-smooth hover:border-primary focus:border-primary"
              />
            ) : (
              <Input
                placeholder={
                  qrType === "url" ? "https://example.com" :
                  qrType === "phone" ? "+1234567890" :
                  qrType === "email" ? "email@example.com" : ""
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="transition-smooth hover:border-primary focus:border-primary"
              />
            )}
          </div>
        )}

        <Button 
          onClick={handleGenerate} 
          className="w-full gradient-primary glow-effect transition-smooth hover:scale-[1.02]"
          size="lg"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Upload className="w-5 h-5 mr-2 animate-pulse" />
              Uploading...
            </>
          ) : (
            <>
              <QrCode className="w-5 h-5 mr-2" />
              Generate QR Code
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
