import { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

// ─── SHOPEE COLOR PALETTE ───────────────────────────────────────────────────
const C = {
  orange: "#EE4D2D",
  orangeLight: "#FF6633",
  orangeDeep: "#C73E1D",
  orangePale: "#FFF0ED",
  orangeMid: "#FF8C69",
  white: "#FFFFFF",
  bg: "#F5F5F5",
  card: "#FFFFFF",
  text: "#333333",
  textLight: "#757575",
  textMuted: "#BDBDBD",
  border: "#E8E8E8",
  green: "#00A854",
  red: "#EE4D2D",
  yellow: "#FFA900",
  blue: "#2B7DE9",
  dark: "#1A1A1A",
};

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const HUB = "LM Hub_SP_Campinas_São Martinho";

const initialDisponibilidade = [
  { hub: HUB, data: "2025-06-04", id: "D001", drive: "Carlos Silva",   cluster: "A", veiculo: "Moto",  noShow: false },
  { hub: HUB, data: "2025-06-04", id: "D002", drive: "Ana Lima",       cluster: "B", veiculo: "Carro", noShow: true  },
  { hub: HUB, data: "2025-06-04", id: "D003", drive: "Roberto Dias",   cluster: "A", veiculo: "Van",   noShow: false },
  { hub: HUB, data: "2025-06-04", id: "D004", drive: "Mariana Costa",  cluster: "C", veiculo: "Moto",  noShow: false },
  { hub: HUB, data: "2025-06-04", id: "D005", drive: "Felipe Rocha",   cluster: "B", veiculo: "Carro", noShow: true  },
  { hub: HUB, data: "2025-06-05", id: "D001", drive: "Carlos Silva",   cluster: "A", veiculo: "Moto",  noShow: false },
  { hub: HUB, data: "2025-06-05", id: "D002", drive: "Ana Lima",       cluster: "B", veiculo: "Carro", noShow: false },
  { hub: HUB, data: "2025-06-05", id: "D003", drive: "Roberto Dias",   cluster: "A", veiculo: "Van",   noShow: true  },
  { hub: HUB, data: "2025-06-05", id: "D006", drive: "Lucas Mendes",   cluster: "C", veiculo: "Moto",  noShow: false },
];

const initialExpedicao = [
  { hub: HUB, data: "2025-06-04", id: "D001", drive: "Carlos Silva",  veiculo: "Moto",  pacotes: 142, cidade: "Campinas", cluster: "A", paradas: 38, distancia: 67 },
  { hub: HUB, data: "2025-06-04", id: "D003", drive: "Roberto Dias",  veiculo: "Van",   pacotes: 210, cidade: "Campinas", cluster: "A", paradas: 52, distancia: 89 },
  { hub: HUB, data: "2025-06-04", id: "D004", drive: "Mariana Costa", veiculo: "Moto",  pacotes: 98,  cidade: "Campinas", cluster: "C", paradas: 27, distancia: 45 },
  { hub: HUB, data: "2025-06-05", id: "D001", drive: "Carlos Silva",  veiculo: "Moto",  pacotes: 158, cidade: "Campinas", cluster: "A", paradas: 41, distancia: 72 },
  { hub: HUB, data: "2025-06-05", id: "D002", drive: "Ana Lima",      veiculo: "Carro", pacotes: 134, cidade: "Campinas", cluster: "B", paradas: 35, distancia: 61 },
  { hub: HUB, data: "2025-06-05", id: "D006", drive: "Lucas Mendes",  veiculo: "Moto",  pacotes: 187, cidade: "Campinas", cluster: "C", paradas: 48, distancia: 81 },
];

const initialOnboarding = [
  { id: "D007", drive: "Patricia Nunes",  telefone: "19991112233", cidade: "Campinas", bairro: "Taquaral",  veiculo: "Moto",  status: "Em análise" },
  { id: "D008", drive: "Gustavo Pires",   telefone: "19992223344", cidade: "Campinas", bairro: "Barão Geraldo", veiculo: "Carro", status: "Aprovado" },
  { id: "D009", drive: "Renata Souza",    telefone: "19993334455", cidade: "Campinas", bairro: "Cambui",    veiculo: "Moto",  status: "Pendente" },
  { id: "D010", drive: "Marcos Ferreira", telefone: "19994445566", cidade: "Campinas", bairro: "Nova Odessa", veiculo: "Van",  status: "Reprovado" },
];

const initialDrivesAtivos = [
  { id: "D001", drive: "Carlos Silva",  telefone: "19981112233", cidade: "Campinas", bairro: "Centro",    veiculo: "Moto",  status: "Ativo" },
  { id: "D002", drive: "Ana Lima",      telefone: "19982223344", cidade: "Campinas", bairro: "Cambuí",    veiculo: "Carro", status: "Ativo" },
  { id: "D003", drive: "Roberto Dias",  telefone: "19983334455", cidade: "Campinas", bairro: "Taquaral",  veiculo: "Van",   status: "Inativo" },
  { id: "D004", drive: "Mariana Costa", telefone: "19984445566", cidade: "Campinas", bairro: "Barão Geraldo", veiculo: "Moto", status: "Ativo" },
  { id: "D005", drive: "Felipe Rocha",  telefone: "19985556677", cidade: "Campinas", bairro: "Cambui",    veiculo: "Carro", status: "Suspenso" },
  { id: "D006", drive: "Lucas Mendes",  telefone: "19986667788", cidade: "Campinas", bairro: "Nova Odessa", veiculo: "Moto", status: "Ativo" },
];

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const statusColors = {
  "Ativo":      { bg: "#E8F5E9", text: "#2E7D32" },
  "Inativo":    { bg: "#FAFAFA", text: "#757575" },
  "Suspenso":   { bg: "#FFF3E0", text: "#E65100" },
  "Aprovado":   { bg: "#E8F5E9", text: "#2E7D32" },
  "Em análise": { bg: "#E3F2FD", text: "#1565C0" },
  "Pendente":   { bg: "#FFF8E1", text: "#F57F17" },
  "Reprovado":  { bg: "#FFEBEE", text: "#C62828" },
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Badge({ status }) {
  const cfg = statusColors[status] || { bg: "#F5F5F5", text: "#333" };
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 700,
      background: cfg.bg,
      color: cfg.text,
      letterSpacing: 0.3,
    }}>{status}</span>
  );
}

function KpiCard({ label, value, sub, icon, accent }) {
  return (
    <div style={{
      background: C.card,
      borderRadius: 14,
      padding: "18px 22px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      borderLeft: `4px solid ${accent || C.orange}`,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      minWidth: 0,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 13, color: C.textLight, fontWeight: 600, letterSpacing: 0.3 }}>{label}</span>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>
      <span style={{ fontSize: 30, fontWeight: 800, color: accent || C.orange, lineHeight: 1.1 }}>{value}</span>
      {sub && <span style={{ fontSize: 12, color: C.textMuted }}>{sub}</span>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "24px 0 12px" }}>
      <div style={{ width: 4, height: 20, background: C.orange, borderRadius: 4 }} />
      <span style={{ fontSize: 15, fontWeight: 800, color: C.text, letterSpacing: 0.2 }}>{children}</span>
    </div>
  );
}

function TopDriverCard({ rank, name, value, label, color }) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div style={{
      background: C.card,
      borderRadius: 12,
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      border: rank === 0 ? `2px solid ${C.orange}` : `1px solid ${C.border}`,
    }}>
      <span style={{ fontSize: 26 }}>{medals[rank]}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
        <div style={{ fontSize: 12, color: C.textLight }}>{label}</div>
      </div>
      <span style={{ fontSize: 22, fontWeight: 800, color: color || C.orange }}>{value}</span>
    </div>
  );
}

function FilterBar({ filters, setFilters, dateRange, setDateRange, clusters, veiculos }) {
  return (
    <div style={{
      background: C.card,
      borderRadius: 14,
      padding: "14px 20px",
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      alignItems: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      marginBottom: 20,
    }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: C.textLight }}>🔍 Filtros</span>
      <input type="date" value={dateRange.start} onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))}
        style={inputStyle} />
      <input type="date" value={dateRange.end} onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))}
        style={inputStyle} />
      <select value={filters.cluster} onChange={e => setFilters(p => ({ ...p, cluster: e.target.value }))} style={inputStyle}>
        <option value="">Todos Clusters</option>
        {clusters.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={filters.veiculo} onChange={e => setFilters(p => ({ ...p, veiculo: e.target.value }))} style={inputStyle}>
        <option value="">Todos Veículos</option>
        {veiculos.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
      <button onClick={() => { setFilters({ cluster: "", veiculo: "" }); setDateRange({ start: "2025-06-04", end: "2025-06-05" }); }}
        style={{ ...inputStyle, background: C.orangePale, color: C.orange, fontWeight: 700, cursor: "pointer", border: `1px solid ${C.orangeMid}` }}>
        ✕ Limpar
      </button>
    </div>
  );
}

const inputStyle = {
  padding: "7px 12px",
  borderRadius: 8,
  border: `1px solid ${C.border}`,
  fontSize: 13,
  color: C.text,
  background: C.bg,
  outline: "none",
  fontFamily: "inherit",
};

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard",      label: "Dashboard",        icon: "🏠" },
  { id: "captacao",       label: "Captação",         icon: "🎯" },
  { id: "disponibilidade",label: "Disponibilidade",  icon: "📅" },
  { id: "noshow",         label: "No Show",          icon: "🚫" },
  { id: "expedicao",      label: "Expedição",        icon: "📦" },
  { id: "drives",         label: "Drives Ativos",    icon: "🚗" },
  { id: "relatorios",     label: "Relatórios",       icon: "📊" },
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [disponibilidade, setDisponibilidade] = useState(initialDisponibilidade);
  const [expedicao, setExpedicao] = useState(initialExpedicao);
  const [onboarding, setOnboarding] = useState(initialOnboarding);
  const [drivesAtivos, setDrivesAtivos] = useState(initialDrivesAtivos);
  const [filters, setFilters] = useState({ cluster: "", veiculo: "" });
  const [dateRange, setDateRange] = useState({ start: "2025-06-04", end: "2025-06-05" });
  const [sheetsUrl, setSheetsUrl] = useState("");
  const [sheetsConnected, setSheetsConnected] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const clusters = [...new Set([...disponibilidade, ...expedicao].map(d => d.cluster))].sort();
  const veiculos = [...new Set([...disponibilidade, ...expedicao, ...drivesAtivos].map(d => d.veiculo))].sort();

  const filterRows = (rows) => rows.filter(r => {
    const inDate = (!dateRange.start || r.data >= dateRange.start) && (!dateRange.end || r.data <= dateRange.end);
    const inCluster = !filters.cluster || r.cluster === filters.cluster;
    const inVeiculo = !filters.veiculo || r.veiculo === filters.veiculo;
    return inDate && inCluster && inVeiculo;
  });

  const filteredDisp = filterRows(disponibilidade);
  const filteredExp = filterRows(expedicao);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>
      {/* FONT */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #F5F5F5; }
        ::-webkit-scrollbar-thumb { background: #EE4D2D55; border-radius: 4px; }
        table { border-collapse: collapse; width: 100%; }
        th { background: #FFF0ED; color: #C73E1D; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 10px 14px; text-align: left; }
        td { padding: 9px 14px; font-size: 13px; color: #333; border-bottom: 1px solid #F0F0F0; }
        tr:hover td { background: #FFF8F7; }
        input, select, textarea { font-family: inherit; }
        @keyframes fadeIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.25s ease; }
        @keyframes toastIn { from { opacity:0; transform: translateX(40px); } to { opacity:1; transform: translateX(0); } }
      `}</style>

      {/* HEADER */}
      <div style={{ background: C.orange, padding: "0 24px", boxShadow: "0 2px 12px rgba(238,77,45,0.3)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "6px 10px", fontSize: 22 }}>🛵</div>
              <div>
                <div style={{ color: C.white, fontWeight: 800, fontSize: 18, letterSpacing: -0.3 }}>Shopee Fleet</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 500 }}>{HUB}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px"
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: sheetsConnected ? "#00E676" : "#FFD740", display: "inline-block" }} />
                <span style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{sheetsConnected ? "Sheets Conectado" : "Sheets Offline"}</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 600 }}>
                {new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })}
              </div>
            </div>
          </div>
          {/* TAB BAR */}
          <div style={{ display: "flex", gap: 2, marginTop: 8, overflowX: "auto" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "10px 18px",
                border: "none",
                background: tab === t.id ? C.white : "transparent",
                color: tab === t.id ? C.orange : "rgba(255,255,255,0.85)",
                fontWeight: tab === t.id ? 800 : 600,
                fontSize: 13,
                borderRadius: "10px 10px 0 0",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
                letterSpacing: 0.2,
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 20px", minHeight: "calc(100vh - 110px)" }} className="fade-in">
        {tab !== "captacao" && tab !== "drives" && tab !== "relatorios" && (
          <FilterBar filters={filters} setFilters={setFilters} dateRange={dateRange} setDateRange={setDateRange}
            clusters={clusters} veiculos={veiculos} />
        )}

        {tab === "dashboard"      && <TabDashboard disponibilidade={filteredDisp} expedicao={filteredExp} drivesAtivos={drivesAtivos} allDisp={disponibilidade} allExp={expedicao} />}
        {tab === "captacao"       && <TabCaptacao onboarding={onboarding} setOnboarding={setOnboarding} showToast={showToast} sheetsUrl={sheetsUrl} setSheetsUrl={setSheetsUrl} setSheetsConnected={setSheetsConnected} sheetsConnected={sheetsConnected} />}
        {tab === "disponibilidade"&& <TabDisponibilidade rows={filteredDisp} allRows={disponibilidade} />}
        {tab === "noshow"         && <TabNoShow rows={filteredDisp} expedicao={filteredExp} />}
        {tab === "expedicao"      && <TabExpedicao rows={filteredExp} />}
        {tab === "drives"         && <TabDrives drives={drivesAtivos} setDrives={setDrivesAtivos} showToast={showToast} />}
        {tab === "relatorios"     && <TabRelatorios disponibilidade={disponibilidade} expedicao={expedicao} drivesAtivos={drivesAtivos} />}
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          background: toast.type === "success" ? C.green : C.red,
          color: C.white, borderRadius: 12, padding: "12px 20px",
          fontWeight: 700, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          animation: "toastIn 0.3s ease",
        }}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </div>
  );
}

// ─── TAB: DASHBOARD ──────────────────────────────────────────────────────────
function TabDashboard({ disponibilidade, expedicao, drivesAtivos, allDisp, allExp }) {
  const totalPacotes   = expedicao.reduce((s, r) => s + r.pacotes, 0);
  const totalDist      = expedicao.reduce((s, r) => s + r.distancia, 0);
  const totalParadas   = expedicao.reduce((s, r) => s + r.paradas, 0);
  const totalEscalados = disponibilidade.length;
  const totalNoShow    = disponibilidade.filter(r => r.noShow).length;
  const totalPresentes = totalEscalados - totalNoShow;
  const taxaPresenca   = totalEscalados ? Math.round(totalPresentes / totalEscalados * 100) : 0;
  const ativos         = drivesAtivos.filter(d => d.status === "Ativo").length;

  // ── aggregation por drive ────────────────────────────────────────────────
  const driveAgg = Object.entries(expedicao.reduce((a, r) => {
    if (!a[r.drive]) a[r.drive] = { pacotes: 0, paradas: 0, distancia: 0 };
    a[r.drive].pacotes   += r.pacotes;
    a[r.drive].paradas   += r.paradas;
    a[r.drive].distancia += r.distancia;
    return a;
  }, {})).map(([name, v]) => ({ name, ...v }));

  const topPacotes  = [...driveAgg].sort((a, b) => b.pacotes   - a.pacotes).slice(0, 3);
  const topKm       = [...driveAgg].sort((a, b) => b.distancia - a.distancia).slice(0, 3);
  const menosParada = [...driveAgg].sort((a, b) => a.paradas   - b.paradas).slice(0, 3);

  // ── no show por drive ────────────────────────────────────────────────────
  const noShowAgg = Object.entries(disponibilidade.filter(r => r.noShow).reduce((a, r) => {
    a[r.drive] = (a[r.drive] || 0) + 1; return a;
  }, {})).map(([name, v]) => ({ name, value: v })).sort((a, b) => b.value - a.value);

  // ── disp x no show por data ──────────────────────────────────────────────
  const dispVsNoShow = Object.entries(disponibilidade.reduce((a, r) => {
    if (!a[r.data]) a[r.data] = { data: r.data.slice(5), Disponíveis: 0, "No Show": 0 };
    if (r.noShow) a[r.data]["No Show"]++;
    else a[r.data].Disponíveis++;
    return a;
  }, {})).map(([, v]) => v).sort((a, b) => a.data.localeCompare(b.data));

  // ── pacotes por data ─────────────────────────────────────────────────────
  const pacotesPorData = Object.entries(expedicao.reduce((a, r) => {
    a[r.data] = (a[r.data] || 0) + r.pacotes; return a;
  }, {})).map(([d, v]) => ({ data: d.slice(5), Pacotes: v })).sort((a, b) => a.data.localeCompare(b.data));

  // ── pacotes por cluster ──────────────────────────────────────────────────
  const pacotesPorCluster = Object.entries(expedicao.reduce((a, r) => {
    a[r.cluster] = (a[r.cluster] || 0) + r.pacotes; return a;
  }, {})).map(([name, Pacotes]) => ({ name, Pacotes })).sort((a, b) => b.Pacotes - a.Pacotes);

  const COLORS = [C.orange, C.blue, C.green, C.yellow];

  // ── mini ranking card ────────────────────────────────────────────────────
  const RankBlock = ({ title, icon, items, valueKey, unit, color, reverse }) => (
    <div style={{ background: C.card, borderRadius: 14, padding: 18, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontWeight: 800, fontSize: 14, color: C.text }}>{title}</span>
      </div>
      {items.map((item, i) => {
        const medals = ["🥇","🥈","🥉"];
        const val = valueKey ? item[valueKey] : item.value;
        const barW = items[0] ? Math.round((val / (valueKey ? items[0][valueKey] : items[0].value)) * 100) : 0;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text, display: "flex", gap: 5, alignItems: "center" }}>
                <span>{medals[i]}</span>
                <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
              </span>
              <span style={{ fontSize: 14, fontWeight: 800, color: color || C.orange }}>{val}{unit}</span>
            </div>
            <div style={{ height: 5, background: C.bg, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${reverse ? 100 - barW + 20 : barW}%`, background: color || C.orange, borderRadius: 4, transition: "width 0.4s ease" }} />
            </div>
          </div>
        );
      })}
      {items.length === 0 && <span style={{ fontSize: 12, color: C.textMuted }}>Sem dados no período</span>}
    </div>
  );

  return (
    <div>
      {/* KPIs PRINCIPAIS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 22 }}>
        <KpiCard label="Pacotes Expedidos"  value={totalPacotes.toLocaleString()} icon="📦" accent={C.orange} />
        <KpiCard label="Drives Escalados"   value={totalEscalados}                icon="👥" accent={C.blue} />
        <KpiCard label="Presentes"          value={totalPresentes}                icon="✅" accent={C.green} sub={`Taxa ${taxaPresenca}%`} />
        <KpiCard label="No Show"            value={totalNoShow}                   icon="🚫" accent={C.red}  sub={`${totalEscalados ? Math.round(totalNoShow/totalEscalados*100) : 0}% da escala`} />
        <KpiCard label="Distância Total"    value={`${totalDist} km`}             icon="🛣️" accent={C.green} />
        <KpiCard label="Paradas Total"      value={totalParadas}                  icon="📍" accent={C.yellow} />
        <KpiCard label="Drives Ativos"      value={ativos}                        icon="🚗" accent={C.orange} />
        <KpiCard label="Entregas / km"      value={totalDist ? (totalPacotes/totalDist).toFixed(1) : "—"} icon="⚡" accent={C.blue} />
      </div>

      {/* DISPONIBILIDADE x NO SHOW */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
          <SectionTitle>📅 Disponibilidade × Recusa (No Show) por Data</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dispVsNoShow} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="data" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.border}` }} />
              <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
              <Bar dataKey="Disponíveis" fill={C.green}  radius={[5,5,0,0]} />
              <Bar dataKey="No Show"     fill={C.orange} radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
          <SectionTitle>🔄 Presença Geral</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={[
                  { name: "Presentes", value: totalPresentes },
                  { name: "No Show",   value: totalNoShow },
                ]}
                dataKey="value" nameKey="name" cx="50%" cy="48%" outerRadius={80} innerRadius={45}
                paddingAngle={3}
              >
                <Cell fill={C.green} />
                <Cell fill={C.orange} />
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
              <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ textAlign: "center", marginTop: -6 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: taxaPresenca >= 80 ? C.green : C.orange }}>{taxaPresenca}%</span>
            <div style={{ fontSize: 11, color: C.textLight, fontWeight: 600 }}>Taxa de Presença</div>
          </div>
        </div>
      </div>

      {/* EXPEDIÇÃO POR DATA + CLUSTER */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
          <SectionTitle>📦 Pacotes Expedidos por Data</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pacotesPorData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="data" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={v => [`${v} pacotes`, "Expedidos"]} contentStyle={{ borderRadius: 10 }} />
              <Bar dataKey="Pacotes" fill={C.orange} radius={[6,6,0,0]}>
                {pacotesPorData.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? C.orange : C.orangeLight} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
          <SectionTitle>🗂️ Volume por Cluster</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pacotesPorCluster} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 13, fontWeight: 700 }} width={40} />
              <Tooltip formatter={v => [`${v} pacotes`, "Volume"]} contentStyle={{ borderRadius: 10 }} />
              <Bar dataKey="Pacotes" radius={[0,6,6,0]}>
                {pacotesPorCluster.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RANKINGS 4 COLUNAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14, marginBottom: 16 }}>
        <RankBlock
          title="Mais Pacotes"
          icon="📦"
          items={topPacotes}
          valueKey="pacotes"
          unit=" pcts"
          color={C.orange}
        />
        <RankBlock
          title="Menos Paradas"
          icon="📍"
          items={menosParada}
          valueKey="paradas"
          unit=" prd"
          color={C.blue}
          reverse={true}
        />
        <RankBlock
          title="Mais KM Rodados"
          icon="🛣️"
          items={topKm}
          valueKey="distancia"
          unit=" km"
          color={C.green}
        />
        <RankBlock
          title="Mais No Show"
          icon="🚫"
          items={noShowAgg.slice(0, 3)}
          valueKey={null}
          unit="x"
          color={C.red}
        />
      </div>

      {/* TABELA RESUMO EXPEDIÇÃO */}
      <div style={{ background: C.card, borderRadius: 14, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", overflow: "hidden" }}>
        <SectionTitle>&nbsp;&nbsp;📋 Resumo de Expedição — Período Filtrado</SectionTitle>
        <div style={{ overflowX: "auto", paddingBottom: 8 }}>
          <table>
            <thead><tr>
              {["Data","ID","Drive","Veículo","Cluster","Pacotes","Paradas","Distância"].map(h => <th key={h}>{h}</th>)}
            </tr></thead>
            <tbody>
              {expedicao.length === 0
                ? <tr><td colSpan={8} style={{ textAlign: "center", color: C.textMuted, fontStyle: "italic", padding: 24 }}>Sem registros no período selecionado</td></tr>
                : expedicao.map((r, i) => (
                  <tr key={i}>
                    <td>{r.data}</td>
                    <td style={{ fontWeight: 700, color: C.orange }}>{r.id}</td>
                    <td style={{ fontWeight: 600 }}>{r.drive}</td>
                    <td>{r.veiculo}</td>
                    <td><span style={{ background: C.orangePale, color: C.orange, padding: "2px 8px", borderRadius: 6, fontWeight: 700, fontSize: 12 }}>{r.cluster}</span></td>
                    <td><span style={{ fontWeight: 800, color: C.orange, fontSize: 15 }}>{r.pacotes}</span></td>
                    <td>{r.paradas}</td>
                    <td>{r.distancia} km</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: CAPTAÇÃO ────────────────────────────────────────────────────────────
function TabCaptacao({ onboarding, setOnboarding, showToast, sheetsUrl, setSheetsUrl, setSheetsConnected, sheetsConnected }) {
  const [form, setForm] = useState({ id: "", drive: "", telefone: "", cidade: "Campinas", bairro: "", veiculo: "Moto", status: "Em análise" });
  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const statusOpts = ["Em análise", "Aprovado", "Pendente", "Reprovado"];

  const handleAdd = () => {
    if (!form.id || !form.drive || !form.telefone) { showToast("Preencha ID, Drive e Telefone", "error"); return; }
    setOnboarding(p => [...p, { ...form }]);
    setForm({ id: "", drive: "", telefone: "", cidade: "Campinas", bairro: "", veiculo: "Moto", status: "Em análise" });
    showToast("Drive captado com sucesso!");
  };

  const saveEdit = () => {
    setOnboarding(p => p.map(r => r.id === editId ? editRow : r));
    setEditId(null);
    showToast("Registro atualizado!");
  };

  const handleConnect = () => {
    if (!sheetsUrl.includes("docs.google.com")) { showToast("URL do Google Sheets inválida", "error"); return; }
    setSheetsConnected(true);
    showToast("Google Sheets conectado!");
  };

  return (
    <div>
      {/* SHEETS CONNECT */}
      <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 20 }}>
        <SectionTitle>🔗 Conexão com Google Sheets</SectionTitle>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input value={sheetsUrl} onChange={e => setSheetsUrl(e.target.value)}
            placeholder="Cole aqui o link da planilha Google Sheets..."
            style={{ ...inputStyle, flex: 1, minWidth: 260, background: C.white, border: `1px solid ${C.border}` }} />
          <button onClick={handleConnect} style={{ padding: "7px 20px", background: C.orange, color: C.white, border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            Conectar Planilha
          </button>
          {sheetsConnected && (
            <button onClick={() => showToast("Sincronizando dados...")} style={{ padding: "7px 16px", background: C.green, color: C.white, border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              ↻ Sincronizar
            </button>
          )}
        </div>
        {sheetsConnected && (
          <div style={{ marginTop: 10, fontSize: 12, color: C.green, fontWeight: 600 }}>
            ✅ Planilha conectada — dados sincronizados em tempo real
          </div>
        )}
      </div>

      {/* FORM */}
      <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 20 }}>
        <SectionTitle>➕ Capitar Novo Drive</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {[
            { key: "id", label: "ID Drive", placeholder: "Ex: D011" },
            { key: "drive", label: "Nome Drive", placeholder: "Nome completo" },
            { key: "telefone", label: "Telefone (WhatsApp)", placeholder: "11999998888" },
            { key: "cidade", label: "Cidade", placeholder: "Campinas" },
            { key: "bairro", label: "Bairro", placeholder: "Centro" },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 4 }}>{f.label}</label>
              <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder} style={{ ...inputStyle, width: "100%", background: C.white, border: `1px solid ${C.border}` }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 4 }}>Veículo</label>
            <select value={form.veiculo} onChange={e => setForm(p => ({ ...p, veiculo: e.target.value }))} style={{ ...inputStyle, width: "100%", background: C.white, border: `1px solid ${C.border}` }}>
              {["Moto", "Carro", "Van"].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 4 }}>Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ ...inputStyle, width: "100%", background: C.white, border: `1px solid ${C.border}` }}>
              {statusOpts.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleAdd} style={{
          marginTop: 16, padding: "10px 28px", background: C.orange, color: C.white,
          border: "none", borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: "pointer",
          boxShadow: "0 3px 12px rgba(238,77,45,0.35)", letterSpacing: 0.3,
        }}>
          🎯 Capitar Drive
        </button>
      </div>

      {/* TABLE */}
      <div style={{ background: C.card, borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <SectionTitle>&nbsp;&nbsp;📋 Onboarding — Drives em Captação</SectionTitle>
        <div style={{ overflowX: "auto", padding: "0 0 8px" }}>
          <table>
            <thead><tr>
              {["ID","Drive","Telefone","Cidade","Bairro","Veículo","Status","Ações"].map(h => <th key={h}>{h}</th>)}
            </tr></thead>
            <tbody>
              {onboarding.map(r => (
                <tr key={r.id}>
                  {editId === r.id ? (
                    <>
                      <td><input value={editRow.id} onChange={e => setEditRow(p => ({ ...p, id: e.target.value }))} style={{ ...inputStyle, width: 70 }} /></td>
                      <td><input value={editRow.drive} onChange={e => setEditRow(p => ({ ...p, drive: e.target.value }))} style={{ ...inputStyle, width: 140 }} /></td>
                      <td><input value={editRow.telefone} onChange={e => setEditRow(p => ({ ...p, telefone: e.target.value }))} style={{ ...inputStyle, width: 120 }} /></td>
                      <td><input value={editRow.cidade} onChange={e => setEditRow(p => ({ ...p, cidade: e.target.value }))} style={{ ...inputStyle, width: 100 }} /></td>
                      <td><input value={editRow.bairro} onChange={e => setEditRow(p => ({ ...p, bairro: e.target.value }))} style={{ ...inputStyle, width: 120 }} /></td>
                      <td><select value={editRow.veiculo} onChange={e => setEditRow(p => ({ ...p, veiculo: e.target.value }))} style={{ ...inputStyle }}>
                        {["Moto","Carro","Van"].map(v => <option key={v}>{v}</option>)}
                      </select></td>
                      <td><select value={editRow.status} onChange={e => setEditRow(p => ({ ...p, status: e.target.value }))} style={{ ...inputStyle }}>
                        {statusOpts.map(s => <option key={s}>{s}</option>)}
                      </select></td>
                      <td style={{ display: "flex", gap: 6 }}>
                        <button onClick={saveEdit} style={{ padding: "4px 12px", background: C.green, color: C.white, border: "none", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>💾</button>
                        <button onClick={() => setEditId(null)} style={{ padding: "4px 10px", background: C.border, color: C.text, border: "none", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>✕</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ fontWeight: 700, color: C.orange }}>{r.id}</td>
                      <td style={{ fontWeight: 600 }}>{r.drive}</td>
                      <td>
                        <a href={`https://wa.me/55${r.telefone}`} target="_blank" rel="noreferrer"
                          style={{ color: C.green, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                          <span>📱</span>{r.telefone}
                        </a>
                      </td>
                      <td>{r.cidade}</td>
                      <td>{r.bairro}</td>
                      <td>{r.veiculo}</td>
                      <td><Badge status={r.status} /></td>
                      <td>
                        <button onClick={() => { setEditId(r.id); setEditRow({ ...r }); }}
                          style={{ padding: "4px 12px", background: C.orangePale, color: C.orange, border: `1px solid ${C.orangeMid}`, borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                          ✏️ Editar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: DISPONIBILIDADE ─────────────────────────────────────────────────────
function TabDisponibilidade({ rows, allRows }) {
  const total = rows.length;
  const presentes = rows.filter(r => !r.noShow).length;
  const ausentes = rows.filter(r => r.noShow).length;

  const byDate = Object.entries(rows.reduce((acc, r) => {
    if (!acc[r.data]) acc[r.data] = { data: r.data.slice(5), total: 0, presentes: 0 };
    acc[r.data].total++;
    if (!r.noShow) acc[r.data].presentes++;
    return acc;
  }, {})).map(([, v]) => v);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
        <KpiCard label="Total Escalados" value={total} icon="👥" accent={C.orange} />
        <KpiCard label="Presentes" value={presentes} icon="✅" accent={C.green} />
        <KpiCard label="No Show" value={ausentes} icon="🚫" accent={C.red} sub={`${total ? Math.round(ausentes/total*100) : 0}% da escala`} />
        <KpiCard label="Taxa Presença" value={`${total ? Math.round(presentes/total*100) : 0}%`} icon="📈" accent={C.blue} />
      </div>

      {byDate.length > 0 && (
        <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 20 }}>
          <SectionTitle>Disponibilidade por Data</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byDate}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="data" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" fill={C.orangeMid} name="Escalados" radius={[4,4,0,0]} />
              <Bar dataKey="presentes" fill={C.green} name="Presentes" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ background: C.card, borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <SectionTitle>&nbsp;&nbsp;📅 Escala Diária</SectionTitle>
        <div style={{ overflowX: "auto", paddingBottom: 8 }}>
          <table>
            <thead><tr>{["Hub","Data","ID","Drive","Cluster","Veículo","No Show"].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11 }}>{r.hub}</td>
                  <td>{r.data}</td>
                  <td style={{ fontWeight: 700, color: C.orange }}>{r.id}</td>
                  <td style={{ fontWeight: 600 }}>{r.drive}</td>
                  <td><span style={{ background: C.orangePale, color: C.orange, padding: "2px 8px", borderRadius: 6, fontWeight: 700, fontSize: 12 }}>{r.cluster}</span></td>
                  <td>{r.veiculo}</td>
                  <td>{r.noShow
                    ? <Badge status="Reprovado" />
                    : <span style={{ color: C.green, fontWeight: 700, fontSize: 12 }}>✅ Presente</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: NO SHOW ─────────────────────────────────────────────────────────────
function TabNoShow({ rows, expedicao }) {
  const noShows = rows.filter(r => r.noShow);

  // Drive que mais deu no show
  const byDrive = Object.entries(noShows.reduce((a, r) => { a[r.drive] = (a[r.drive] || 0) + 1; return a; }, {}))
    .map(([name, v]) => ({ name, value: v })).sort((a, b) => b.value - a.value);

  // Cluster que mais teve no show
  const byCluster = Object.entries(noShows.reduce((a, r) => { a[r.cluster] = (a[r.cluster] || 0) + 1; return a; }, {}))
    .map(([name, v]) => ({ name, value: v })).sort((a, b) => b.value - a.value);

  // Cluster que mais expediu
  const byClusterExp = Object.entries(expedicao.reduce((a, r) => { a[r.cluster] = (a[r.cluster] || 0) + r.pacotes; return a; }, {}))
    .map(([name, v]) => ({ name, value: v })).sort((a, b) => b.value - a.value);

  const COLORS = [C.orange, C.orangeMid, C.yellow, C.blue];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
        <KpiCard label="Total No Show" value={noShows.length} icon="🚫" accent={C.red} />
        <KpiCard label="Clusters Afetados" value={byCluster.length} icon="📍" accent={C.yellow} />
        <KpiCard label="Top Cluster (No Show)" value={byCluster[0]?.name || "—"} icon="⚠️" accent={C.orange} />
        <KpiCard label="Top Cluster (Volume)" value={byClusterExp[0]?.name || "—"} icon="📦" accent={C.green} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Top Drive no show */}
        <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <SectionTitle>🏆 Drive com Mais No Show</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {byDrive.slice(0, 3).map((d, i) => (
              <TopDriverCard key={i} rank={i} name={d.name} value={d.value} label="ausências" color={C.red} />
            ))}
            {byDrive.length === 0 && <span style={{ color: C.textMuted, fontSize: 13 }}>Nenhum no show no período</span>}
          </div>
        </div>

        {/* Cluster no show */}
        <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <SectionTitle>📍 No Show por Cluster</SectionTitle>
          {byCluster.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={byCluster} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {byCluster.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <span style={{ color: C.textMuted, fontSize: 13 }}>Sem dados</span>}
        </div>
      </div>

      {/* Cluster volume */}
      <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 20 }}>
        <SectionTitle>📦 Volume Expedido por Cluster</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={byClusterExp}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 700 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={v => [`${v} pacotes`, "Volume"]} />
            <Bar dataKey="value" fill={C.orange} name="Pacotes" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela no show */}
      <div style={{ background: C.card, borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <SectionTitle>&nbsp;&nbsp;🚫 Registros de No Show</SectionTitle>
        <div style={{ overflowX: "auto", paddingBottom: 8 }}>
          <table>
            <thead><tr>{["Data","ID","Drive","Cluster","Veículo"].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {noShows.map((r, i) => (
                <tr key={i}>
                  <td>{r.data}</td>
                  <td style={{ fontWeight: 700, color: C.orange }}>{r.id}</td>
                  <td style={{ fontWeight: 600 }}>{r.drive}</td>
                  <td><span style={{ background: C.orangePale, color: C.orange, padding: "2px 8px", borderRadius: 6, fontWeight: 700, fontSize: 12 }}>{r.cluster}</span></td>
                  <td>{r.veiculo}</td>
                </tr>
              ))}
              {noShows.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: C.textMuted, fontStyle: "italic" }}>Nenhum no show no período 🎉</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: EXPEDIÇÃO (Experiência) ─────────────────────────────────────────────
function TabExpedicao({ rows }) {
  const totalPacotes = rows.reduce((s, r) => s + r.pacotes, 0);
  const totalParadas = rows.reduce((s, r) => s + r.paradas, 0);
  const totalDist = rows.reduce((s, r) => s + r.distancia, 0);

  // Top 3 drives por pacotes
  const byDrive = Object.entries(rows.reduce((a, r) => {
    if (!a[r.drive]) a[r.drive] = { pacotes: 0, paradas: 0, distancia: 0 };
    a[r.drive].pacotes += r.pacotes;
    a[r.drive].paradas += r.paradas;
    a[r.drive].distancia += r.distancia;
    return a;
  }, {})).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.pacotes - a.pacotes);

  const chartData = byDrive.map(d => ({ name: d.name.split(" ")[0], Pacotes: d.pacotes, Paradas: d.paradas }));

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
        <KpiCard label="Total Pacotes" value={totalPacotes.toLocaleString()} icon="📦" accent={C.orange} />
        <KpiCard label="Total Paradas" value={totalParadas} icon="📍" accent={C.blue} />
        <KpiCard label="Distância Total" value={`${totalDist} km`} icon="🛣️" accent={C.green} />
        <KpiCard label="Drives Ativos" value={rows.length} icon="🚗" accent={C.yellow} />
      </div>

      {/* TOP 3 DRIVES */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <SectionTitle>🏆 Top 3 — Mais Pacotes</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {byDrive.slice(0, 3).map((d, i) => (
              <TopDriverCard key={i} rank={i} name={d.name} value={d.pacotes} label={`${d.paradas} paradas · ${d.distancia}km`} />
            ))}
          </div>
        </div>

        <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <SectionTitle>📊 Pacotes & Paradas por Drive</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Pacotes" fill={C.orange} radius={[4,4,0,0]} />
              <Bar dataKey="Paradas" fill={C.blue} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DISTÂNCIA LINE */}
      <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 20 }}>
        <SectionTitle>🛣️ Distância por Drive (km)</SectionTitle>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={byDrive.map(d => ({ name: d.name.split(" ")[0], km: d.distancia }))}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={v => [`${v} km`, "Distância"]} />
            <Line type="monotone" dataKey="km" stroke={C.orange} strokeWidth={3} dot={{ fill: C.orange, r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: C.card, borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <SectionTitle>&nbsp;&nbsp;📦 Detalhes de Expedição</SectionTitle>
        <div style={{ overflowX: "auto", paddingBottom: 8 }}>
          <table>
            <thead><tr>{["Data","ID","Drive","Veículo","Pacotes","Cluster","Paradas","Distância"].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.data}</td>
                  <td style={{ fontWeight: 700, color: C.orange }}>{r.id}</td>
                  <td style={{ fontWeight: 600 }}>{r.drive}</td>
                  <td>{r.veiculo}</td>
                  <td><span style={{ fontWeight: 800, color: C.orange }}>{r.pacotes}</span></td>
                  <td><span style={{ background: C.orangePale, color: C.orange, padding: "2px 8px", borderRadius: 6, fontWeight: 700, fontSize: 12 }}>{r.cluster}</span></td>
                  <td>{r.paradas}</td>
                  <td>{r.distancia} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: DRIVES ATIVOS ───────────────────────────────────────────────────────
function TabDrives({ drives, setDrives, showToast }) {
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const statusOpts = ["Ativo", "Inativo", "Suspenso"];

  const filtered = drives.filter(d =>
    d.drive.toLowerCase().includes(search.toLowerCase()) ||
    d.id.toLowerCase().includes(search.toLowerCase()) ||
    d.bairro.toLowerCase().includes(search.toLowerCase())
  );

  const saveEdit = () => {
    setDrives(p => p.map(r => r.id === editId ? editRow : r));
    setEditId(null);
    showToast("Drive atualizado!");
  };

  const counts = { Ativo: 0, Inativo: 0, Suspenso: 0 };
  drives.forEach(d => { if (counts[d.status] !== undefined) counts[d.status]++; });

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
        <KpiCard label="Drives Ativos" value={counts.Ativo} icon="✅" accent={C.green} />
        <KpiCard label="Inativos" value={counts.Inativo} icon="⏸️" accent={C.textLight} />
        <KpiCard label="Suspensos" value={counts.Suspenso} icon="⚠️" accent={C.yellow} />
        <KpiCard label="Total Cadastros" value={drives.length} icon="👥" accent={C.orange} />
      </div>

      <div style={{ background: C.card, borderRadius: 14, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Buscar por nome, ID ou bairro..."
          style={{ ...inputStyle, flex: 1, background: C.white, border: `1px solid ${C.border}` }} />
        {search && <button onClick={() => setSearch("")} style={{ ...inputStyle, cursor: "pointer", color: C.orange, fontWeight: 700 }}>✕</button>}
      </div>

      <div style={{ background: C.card, borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto", paddingBottom: 8 }}>
          <table>
            <thead><tr>{["ID","Drive","Telefone","Cidade","Bairro","Veículo","Status","Ações"].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  {editId === r.id ? (
                    <>
                      <td style={{ fontWeight: 700, color: C.orange }}>{r.id}</td>
                      <td><input value={editRow.drive} onChange={e => setEditRow(p => ({ ...p, drive: e.target.value }))} style={{ ...inputStyle, width: 140 }} /></td>
                      <td><input value={editRow.telefone} onChange={e => setEditRow(p => ({ ...p, telefone: e.target.value }))} style={{ ...inputStyle, width: 120 }} /></td>
                      <td><input value={editRow.cidade} onChange={e => setEditRow(p => ({ ...p, cidade: e.target.value }))} style={{ ...inputStyle, width: 100 }} /></td>
                      <td><input value={editRow.bairro} onChange={e => setEditRow(p => ({ ...p, bairro: e.target.value }))} style={{ ...inputStyle, width: 120 }} /></td>
                      <td><select value={editRow.veiculo} onChange={e => setEditRow(p => ({ ...p, veiculo: e.target.value }))} style={inputStyle}>
                        {["Moto","Carro","Van"].map(v => <option key={v}>{v}</option>)}
                      </select></td>
                      <td><select value={editRow.status} onChange={e => setEditRow(p => ({ ...p, status: e.target.value }))} style={inputStyle}>
                        {statusOpts.map(s => <option key={s}>{s}</option>)}
                      </select></td>
                      <td style={{ display: "flex", gap: 6 }}>
                        <button onClick={saveEdit} style={{ padding: "4px 12px", background: C.green, color: C.white, border: "none", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>💾</button>
                        <button onClick={() => setEditId(null)} style={{ padding: "4px 10px", background: C.border, color: C.text, border: "none", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>✕</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ fontWeight: 700, color: C.orange }}>{r.id}</td>
                      <td style={{ fontWeight: 600 }}>{r.drive}</td>
                      <td>
                        <a href={`https://wa.me/55${r.telefone}`} target="_blank" rel="noreferrer"
                          style={{ color: C.green, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                          <span>📱</span>{r.telefone}
                        </a>
                      </td>
                      <td>{r.cidade}</td>
                      <td>{r.bairro}</td>
                      <td>{r.veiculo}</td>
                      <td><Badge status={r.status} /></td>
                      <td>
                        <button onClick={() => { setEditId(r.id); setEditRow({ ...r }); }}
                          style={{ padding: "4px 12px", background: C.orangePale, color: C.orange, border: `1px solid ${C.orangeMid}`, borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                          ✏️ Editar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: RELATÓRIOS ─────────────────────────────────────────────────────────
function TabRelatorios({ disponibilidade, expedicao, drivesAtivos }) {
  const totalPacotes = expedicao.reduce((s, r) => s + r.pacotes, 0);
  const totalDist = expedicao.reduce((s, r) => s + r.distancia, 0);
  const totalNoShow = disponibilidade.filter(r => r.noShow).length;
  const totalEscalados = disponibilidade.length;
  const taxaPresenca = totalEscalados ? Math.round((1 - totalNoShow / totalEscalados) * 100) : 0;
  const ativos = drivesAtivos.filter(d => d.status === "Ativo").length;

  // Pacotes por data
  const pacotesPorData = Object.entries(expedicao.reduce((a, r) => {
    a[r.data] = (a[r.data] || 0) + r.pacotes;
    return a;
  }, {})).map(([data, Pacotes]) => ({ data: data.slice(5), Pacotes }));

  // Veículos
  const veiculosMix = Object.entries(expedicao.reduce((a, r) => {
    a[r.veiculo] = (a[r.veiculo] || 0) + r.pacotes;
    return a;
  }, {})).map(([name, value]) => ({ name, value }));

  const COLORS = [C.orange, C.blue, C.green];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
        <KpiCard label="Total Pacotes" value={totalPacotes.toLocaleString()} icon="📦" accent={C.orange} />
        <KpiCard label="Distância Total" value={`${totalDist} km`} icon="🛣️" accent={C.green} />
        <KpiCard label="Taxa Presença" value={`${taxaPresenca}%`} icon="✅" accent={C.blue} />
        <KpiCard label="No Show Total" value={totalNoShow} icon="🚫" accent={C.red} />
        <KpiCard label="Drives Ativos" value={ativos} icon="🚗" accent={C.green} />
        <KpiCard label="Total Escalados" value={totalEscalados} icon="👥" accent={C.orange} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <SectionTitle>📦 Pacotes por Data</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pacotesPorData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="data" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="Pacotes" fill={C.orange} radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <SectionTitle>🚗 Mix de Veículos</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={veiculosMix} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`} labelLine={false}>
                {veiculosMix.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* STATUS DOS DRIVES */}
      <div style={{ background: C.card, borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 20 }}>
        <SectionTitle>📋 Resumo Hub — {HUB}</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {[
            { label: "Média de Pacotes/Drive", value: expedicao.length ? Math.round(totalPacotes / expedicao.length) : 0, icon: "📊" },
            { label: "Média Distância/Drive", value: expedicao.length ? `${Math.round(totalDist / expedicao.length)} km` : "—", icon: "📏" },
            { label: "Entregas por km", value: totalDist ? (totalPacotes / totalDist).toFixed(1) : "—", icon: "⚡" },
          ].map((m, i) => (
            <div key={i} style={{ background: C.bg, borderRadius: 10, padding: "14px 18px", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.orange }}>{m.value}</div>
              <div style={{ fontSize: 12, color: C.textLight, fontWeight: 600 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.orangePale, border: `1px solid ${C.orangeMid}`, borderRadius: 12, padding: "14px 20px", fontSize: 13, color: C.orangeDeep, fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>💡</span>
        Para exportar os dados completos, conecte a planilha Google Sheets na aba <strong>Captação</strong> e utilize os filtros de data para gerar relatórios personalizados.
      </div>
    </div>
  );
}
