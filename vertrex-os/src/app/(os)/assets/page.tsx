"use client";

import { useUIStore } from "@/lib/store/ui";
import { 
  Folder, FileText, Image as ImageIcon, Video, 
  UploadCloud, Search, Filter, Sparkles, 
  MoreVertical, Download, ArrowUpRight, Grid, 
  List, HardDrive, Zap, Tag, Cloud, Database,
  RefreshCw, ShieldCheck, ChevronDown
} from "lucide-react";

export default function HybridAssetsPage() {
  const open = useUIStore((store) => store.open);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in pb-4">
      
      {/* 1. HEADER & STORAGE STATUS */}
      <div className="flex flex-col gap-6 mb-8 shrink-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
              Recursos
              <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 border border-primary/20 rounded text-[10px] uppercase font-bold text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Sistema Híbrido Activo
              </div>
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <StorageIndicator 
                icon={Database} 
                label="Vertrex Space" 
                used="1.2 GB" 
                total="10 GB" 
                color="text-primary" 
              />
              <div className="w-px h-4 bg-border"></div>
              <StorageIndicator 
                icon={Cloud} 
                label="Google Drive" 
                used="44 GB" 
                total="100 GB" 
                color="text-blue-400" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium bg-secondary text-foreground hover:bg-secondary/80 rounded-lg border border-border flex items-center gap-2 transition-colors">
              <RefreshCw className="w-4 h-4" /> Sincronizar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg shadow-[0_0_15px_rgba(0,255,135,0.2)] hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all" onClick={() => open("uploadFile", { context: "Assets" })}>
              <UploadCloud className="w-4 h-4" />
              Subir a Vertrex
            </button>
          </div>
        </div>

        {/* Búsqueda Semántica & Selector de Origen */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Sparkles className="w-5 h-5 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
            </div>
            <input 
              type="text" 
              placeholder='Búsqueda semántica en todos los orígenes... (Ej: "Logos en Drive", "PDFs de Neon")' 
              className="w-full bg-card border border-border/50 rounded-xl pl-12 pr-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
            />
          </div>
          
          <div className="flex bg-card border border-border/50 rounded-xl p-1">
            <SourceFilter icon={Database} label="Vertrex" active />
            <SourceFilter icon={Cloud} label="Drive" />
          </div>
        </div>
      </div>

      {/* 2. CATEGORY FILTERS */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar mb-6 shrink-0 pb-2 border-b border-border/50">
        <CategoryPill icon={Folder} label="Todos" active />
        <CategoryPill icon={ImageIcon} label="Imágenes" count={142} />
        <CategoryPill icon={FileText} label="Documentos" count={89} />
        <CategoryPill icon={Video} label="Media" count={12} />
        <CategoryPill icon={ShieldCheck} label="Seguros (Vault)" count={5} />
      </div>

      {/* 3. HYBRID ASSETS GRID */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          
          {/* File: Local (Neon) */}
          <AssetCard 
            source="local"
            type="image" 
            name="app-icon-final.png" 
            size="450 KB" 
            date="Hace 2 min"
            entity="Nexus Proyect"
            aiTags={["Asset", "UI"]}
            onOpen={() => open("assetDetail", "app-icon")}
          />

          {/* File: Google Drive */}
          <AssetCard 
            source="drive"
            type="pdf" 
            name="Manual_Usuario_v6.pdf" 
            size="12.4 MB" 
            date="Ayer"
            entity="Documentación"
            aiTags={["Legacy", "User Guide"]}
            onOpen={() => open("assetDetail", "manual-usuario")}
          />

          {/* File: Local (Neon) con OCR */}
          <AssetCard 
            source="local"
            type="pdf" 
            name="Factura_Abril_Neon.pdf" 
            size="1.2 MB" 
            date="Ayer"
            entity="Finanzas"
            aiTags={["Invoice"]}
            isScanned
            onOpen={() => open("assetDetail", "invoice-april")}
          />

          {/* File: Google Drive (Video pesado) */}
          <AssetCard 
            source="drive"
            type="video" 
            name="Workshop_Viernes.mp4" 
            size="1.2 GB" 
            date="Hace 3 días"
            entity="Meeting Archive"
            aiTags={["Internal"]}
            onOpen={() => open("assetDetail", "workshop-viernes")}
          />

          {/* Más Archivos... */}
          <AssetCard source="local" type="image" name="bg-dark-mesh.jpg" size="2.1 MB" date="Hace 4 días" aiTags={["BG"]} onOpen={() => open("assetDetail", "bg-dark-mesh")} />
          <AssetCard source="drive" type="image" name="client-assets-zip.zip" size="240 MB" date="Hace 1 semana" onOpen={() => open("assetDetail", "client-assets-zip")} />
          <AssetCard source="local" type="pdf" name="PRD_Vertrex_Draft.pdf" size="800 KB" date="Hace 2 semanas" entity="Vertrex OS" onOpen={() => open("assetDetail", "prd-draft")} />
        </div>

      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES (Lógica Híbrida)
// ==========================================

function StorageIndicator({ icon: Icon, label, used, total, color }: any) {
  const percentage = (parseFloat(used) / parseFloat(total)) * 100;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
        <span className="flex items-center gap-1"><Icon className={`w-3 h-3 ${color}`} /> {label}</span>
        <span>{used} / {total}</span>
      </div>
      <div className="w-32 h-1 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full ${color.replace('text-', 'bg-')}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function SourceFilter({ icon: Icon, label, active }: any) {
  return (
    <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
      active ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
    }`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function CategoryPill({ icon: Icon, label, count, active }: any) {
  return (
    <button className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-colors ${
      active ? "border-primary text-foreground font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"
    }`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
      {count && <span className="ml-1.5 text-[10px] font-mono opacity-50">{count}</span>}
    </button>
  );
}

function AssetCard({ source, type, name, size, date, entity, aiTags, isScanned, onOpen }: any) {
  const isDrive = source === "drive";
  
  const getIcon = () => {
    if (type === 'image') return ImageIcon;
    if (type === 'video') return Video;
    return FileText;
  };
  const Icon = getIcon();

  return (
    <div className="bg-card border border-border hover:border-primary/40 rounded-2xl overflow-hidden group cursor-pointer transition-all flex flex-col relative" onClick={onOpen}>
      
      {/* Source Badge (Drive vs Vertrex) */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <div className={`p-1 rounded bg-background/80 backdrop-blur border border-border shadow-sm ${isDrive ? 'text-blue-400' : 'text-primary'}`}>
          {isDrive ? <Cloud className="w-3 h-3" /> : <Database className="w-3 h-3" />}
        </div>
      </div>

      {/* Preview Area */}
      <div className="h-32 w-full bg-secondary/30 flex items-center justify-center relative overflow-hidden group-hover:bg-secondary/50 transition-colors">
        <Icon className={`w-10 h-10 opacity-30 group-hover:scale-110 group-hover:opacity-60 transition-all duration-300 ${isDrive ? 'text-blue-400' : 'text-primary'}`} />
        
        {isScanned && (
          <div className="absolute bottom-2 left-2 bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest backdrop-blur-md">
            OCR Indexado
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="p-3 flex flex-col flex-1">
        <h4 className="text-sm font-semibold text-foreground truncate mb-1 group-hover:text-primary transition-colors" title={name}>
          {name}
        </h4>
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-3">
          <span>{size}</span>
          <span>{date}</span>
        </div>

        <div className="mt-auto space-y-2">
          {entity && (
            <div className="flex items-center gap-1 bg-secondary/80 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold text-muted-foreground border border-border w-fit">
              <ArrowUpRight className="w-2.5 h-2.5" /> {entity}
            </div>
          )}

          {aiTags && (
            <div className="flex gap-1 flex-wrap">
              {aiTags.map((tag: string) => (
                <span key={tag} className="text-[9px] text-muted-foreground bg-background border border-border px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5 opacity-50" /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Location Path */}
      <div className="px-3 py-1.5 bg-secondary/20 border-t border-border/50 flex items-center gap-2">
        <span className="text-[9px] font-bold text-muted-foreground truncate uppercase flex items-center gap-1.5">
          {isDrive ? "Google Drive / Shared /" : "Vertrex / Project-Storage /"}
          <ChevronDown className="w-2 h-2" />
        </span>
      </div>
    </div>
  );
}