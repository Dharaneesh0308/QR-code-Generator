import { Button } from "@/components/ui/button";
import { History, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

interface QRHistoryItem {
  id: string;
  value: string;
  type: string;
  timestamp: number;
  fgColor: string;
  bgColor: string;
  size: number;
}

interface QRHistoryProps {
  history: QRHistoryItem[];
  onClearHistory: () => void;
  onRestore: (item: QRHistoryItem) => void;
}

export default function QRHistory({ history, onClearHistory, onRestore }: QRHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="gradient-accent p-3 rounded-xl">
            <History className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold">History</h3>
            <p className="text-sm text-muted-foreground">Your generated QR codes</p>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No QR codes generated yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="gradient-accent p-3 rounded-xl">
            <History className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold">History</h3>
            <p className="text-sm text-muted-foreground">{history.length} QR code(s)</p>
          </div>
        </div>
        <Button
          onClick={onClearHistory}
          variant="destructive"
          size="sm"
          className="transition-smooth hover:scale-[1.02]"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-secondary/50 rounded-xl p-4 space-y-3 transition-smooth hover:bg-secondary/70 cursor-pointer border border-border/50"
            onClick={() => {
              onRestore(item);
              toast.success("QR Code restored!");
            }}
          >
            <div className="bg-white p-3 rounded-lg flex items-center justify-center">
              <div className="text-xs text-muted-foreground">Preview unavailable</div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium capitalize">{item.type}</p>
              <p className="text-xs text-muted-foreground truncate">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
