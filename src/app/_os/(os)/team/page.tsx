import React from "react";
import { 
  Users, Zap, ShieldAlert, Activity, 
  BatteryWarning, BatteryCharging, BatteryFull,
  Filter, Plus, Search, Code2, Database, 
  Palette, Cpu, ArrowRight, MoreHorizontal,
  CheckCircle2, AlertTriangle, Target
} from "lucide-react";
import TeamWorkspaceScreen from "@/components/os/team-workspace-screen";

const useWorkspaceSnapshot = process.env.NEXT_PUBLIC_USE_WORKSPACE_SNAPSHOT !== "false";

export default function TeamManagementPage() {
  if (useWorkspaceSnapshot) {
    return <TeamWorkspaceScreen />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in bg-[#0A0A0A]">
      
      {/* 1. HEADER & GLOBAL CONTROLS */}
      <div className="px-8 py-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 bg-[#050505]">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Gestión de Escuadrón
            <span className="flex items-center gap-1.5 px-2 py-1 bg-[#00FA82]/10 border border-[#00FA82]/20 rounded text-[10px] uppercase font-bold text-[#00FA82]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FA82] animate-pulse"></span> 8/10 Activos
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Monitoreo de capacidad, skills y rendimiento de la fuerza operativa.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar por skill (ej: React)..." 
              className="bg-[#111] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-[#00FA82] transition-colors w-64 font-mono placeholder:font-sans"
            />
          </div>
          <button className="px-4 py-2 text-sm font-bold text-black bg-[#00FA82] hover:bg-[#00FA82]/90 rounded-lg shadow-[0_0_15px_rgba(0,250,130,0.2)] transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Reclutar
          </button>
        </div>
      </div>

      {/* 2. MAIN SCROLLABLE AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">

        {/* IA RESOURCE MANAGER (Alerta de Burnout & Reasignación) */}
        <div className="bg-[#111] border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl"></div>
          
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500 shrink-0">
              <BatteryWarning className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                Alerta de Sobrecarga (IA Manager)
                <span className="text-[10px] uppercase bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-black tracking-widest">Riesgo Crítico</span>
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
                El desarrollador <strong className="text-white">Juan M.</strong> tiene una capacidad proyectada del <span className="text-amber-500 font-mono font-bold">115%</span> para este sprint debido al proyecto GlobalBank. 
                Sugerimos reasignar la tarea <span className="font-mono bg-white/10 px-1 rounded text-white">NEX-145 (API Auth)</span> a <strong className="text-[#00FA82]">Carlos M.</strong>, quien tiene un <span className="text-[#00FA82] font-mono font-bold">60%</span> de capacidad y el skill necesario (Node.js).
              </p>
            </div>
          </div>
          <button className="shrink-0 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 relative z-10 shadow-lg">
            <Zap className="w-4 h-4" /> Ejecutar Reasignación
          </button>
        </div>

        {/* 3. GRID DE PERFILES (Operadores) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Fuerza Operativa</h2>
            <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00FA82]"></div> Óptimo</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Sobrecarga</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Operator 1: Sobrecargado */}
            <OperatorCard 
              name="Juan Manuel V."
              role="Lead FullStack"
              avatar="JM"
              capacity={115}
              status="overloaded"
              tasks={8}
              primarySkill={{ icon: Code2, label: "React / Next.js", level: "Expert" }}
              secondarySkills={["Tailwind", "PostgreSQL", "Arquitectura"]}
              currentProject="GlobalBank Enterprise"
            />

            {/* Operator 2: Óptimo / Libre */}
            <OperatorCard 
              name="Carlos M."
              role="Backend Engineer"
              avatar="CM"
              capacity={60}
              status="optimal"
              tasks={3}
              primarySkill={{ icon: Database, label: "Node.js / Python", level: "Senior" }}
              secondarySkills={["AWS", "Docker", "Supabase"]}
              currentProject="Acme Corp API"
            />

            {/* Operator 3: En Riesgo */}
            <OperatorCard 
              name="Sarah R."
              role="Product Designer"
              avatar="SR"
              capacity={90}
              status="warning"
              tasks={5}
              primarySkill={{ icon: Palette, label: "Figma / UI", level: "Senior" }}
              secondarySkills={["UX Research", "Framer", "CSS"]}
              currentProject="Vertrex OS Redesign"
            />

            {/* Operator 4: IA Agente (Futuro) */}
            <OperatorCard 
              name="DevBot-X"
              role="Agente Autónomo"
              avatar="🤖"
              capacity={45}
              status="optimal"
              tasks={12}
              primarySkill={{ icon: Cpu, label: "Code Review / QA", level: "Machine" }}
              secondarySkills={["Refactoring", "Testing", "Data Entry"]}
              currentProject="Mantenimiento Global"
              isAI
            />
          </div>
        </div>

        {/* 4. PERFORMANCE & SKILLS MATRIX (Analytics Interno) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Matriz de Skills */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
              <Target className="w-4 h-4" /> Cobertura de Skills vs Demanda
            </h3>
            <div className="space-y-4">
              <SkillBar skill="Frontend (React/Vue)" capacity="Alta (3 Devs)" demand="85%" color="bg-[#00FA82]" value={85} />
              <SkillBar skill="Backend (Node/Python)" capacity="Media (2 Devs)" demand="95%" color="bg-amber-500" value={95} warning="Cuello de botella detectado" />
              <SkillBar skill="Diseño UI/UX" capacity="Media (1 Designer)" demand="60%" color="bg-blue-400" value={60} />
              <SkillBar skill="DevOps / Cloud" capacity="Baja (1 Dev)" demand="30%" color="bg-purple-500" value={30} />
            </div>
            <button className="w-full mt-6 bg-[#1A1A1A] border border-white/10 text-white text-xs font-bold py-3 rounded-xl hover:border-[#00FA82]/50 hover:text-[#00FA82] transition-colors">
              Explorar contrataciones freelance
            </button>
          </div>

          {/* Top Performers */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Rendimiento (Últimos 30d)
            </h3>
            <div className="space-y-4">
              <PerformanceRow name="Sarah R." metric="98%" detail="Tareas a tiempo" rank={1} />
              <PerformanceRow name="Carlos M." metric="95%" detail="Tareas a tiempo" rank={2} />
              <PerformanceRow name="Juan M." metric="82%" detail="Retrasos por sobrecarga" rank={3} alert />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DE HR
// ==========================================

function OperatorCard({ name, role, avatar, capacity, status, tasks, primarySkill, secondarySkills, currentProject, isAI }: any) {
  const getStatusConfig = () => {
    if (status === 'overloaded') return { color: 'text-amber-500', bg: 'bg-amber-500', icon: BatteryWarning, border: 'border-amber-500/50' };
    if (status === 'warning') return { color: 'text-yellow-400', bg: 'bg-yellow-400', icon: BatteryCharging, border: 'border-yellow-400/30' };
    return { color: 'text-[#00FA82]', bg: 'bg-[#00FA82]', icon: BatteryFull, border: 'border-white/10 hover:border-[#00FA82]/50' };
  };

  const cfg = getStatusConfig();
  const Icon = cfg.icon;
  const PrimaryIcon = primarySkill.icon;

  return (
    <div className={`bg-[#0A0A0A] border rounded-2xl p-5 transition-all group flex flex-col ${cfg.border} relative overflow-hidden`}>
      
      {/* Glow background si está sobrecargado */}
      {status === 'overloaded' && <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -z-10"></div>}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black shrink-0 shadow-lg ${isAI ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-[#111] text-white border border-white/20'}`}>
            {avatar}
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {name} {isAI && <Zap className="w-3.5 h-3.5 text-purple-500 fill-current" />}
            </h3>
            <p className="text-xs text-gray-400 font-mono">{role}</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Capacity & Tasks */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-[#111] border border-white/5 rounded-xl p-3">
          <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 flex items-center gap-1">
            <Icon className={`w-3.5 h-3.5 ${cfg.color}`} /> Carga
          </p>
          <p className={`text-xl font-black font-mono ${cfg.color}`}>{capacity}%</p>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-xl p-3">
          <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Tareas
          </p>
          <p className="text-xl font-black font-mono text-white">{tasks}</p>
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Skill Principal</span>
          <span className="text-[9px] bg-white/10 text-white px-1.5 py-0.5 rounded font-mono">{primarySkill.level}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white font-medium">
          <PrimaryIcon className="w-4 h-4 text-gray-400" /> {primarySkill.label}
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {secondarySkills.map((skill: string) => (
            <span key={skill} className="text-[10px] font-medium px-2 py-0.5 bg-[#111] border border-white/10 text-gray-400 rounded-md">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Current Project */}
      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[9px] uppercase font-bold text-gray-500 tracking-widest mb-0.5">Foco Actual</p>
          <p className="text-xs text-white truncate max-w-[150px]">{currentProject}</p>
        </div>
        <button className="text-[10px] font-bold text-[#00FA82] hover:underline uppercase tracking-wider flex items-center gap-1">
          Ver Perfil <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function SkillBar({ skill, capacity, demand, color, value, warning }: any) {
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-sm font-bold text-white flex items-center gap-2">
            {skill}
            {warning && <span title={warning}><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /></span>}
          </p>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5">Capacidad: {capacity}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-black font-mono text-white">{demand}</span>
          <span className="text-[9px] text-gray-500 uppercase tracking-widest ml-1">Demanda</span>
        </div>
      </div>
      <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden border border-white/5">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

function PerformanceRow({ name, metric, detail, rank, alert }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#0A0A0A] border border-white/5 rounded-xl">
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black ${rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/10 text-gray-400'}`}>
          #{rank}
        </div>
        <div>
          <p className="text-sm font-bold text-white">{name}</p>
          <p className={`text-[10px] font-mono mt-0.5 ${alert ? 'text-amber-500' : 'text-gray-500'}`}>{detail}</p>
        </div>
      </div>
      <span className={`text-sm font-black font-mono ${alert ? 'text-amber-500' : 'text-[#00FA82]'}`}>{metric}</span>
    </div>
  );
}