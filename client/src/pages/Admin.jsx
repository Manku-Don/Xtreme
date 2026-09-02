import { useEffect, useState, useCallback } from "react";
import { Lock, RefreshCw, Zap, ExternalLink, MapPin } from "lucide-react";
import { API_BASE_URL, GYM } from "../data/siteData";
import { TAG_OPTIONS } from "../utils/tracking";

const KEY_STORAGE = "xfg_admin_key";

const STATUS_OPTIONS = ["new", "contacted", "demo_booked", "converted", "lost"];
const TAG_LABELS = Object.fromEntries(TAG_OPTIONS.map((t) => [t.id, t.label]));

function StatCard({ label, value }) {
  return (
    <div className="border border-line bg-panel px-5 py-4">
      <p className="text-stencil text-[0.65rem] font-bold tracking-[0.1em] text-steel-dim">{label}</p>
      <p className="text-display mt-1 text-3xl text-chalk">{value}</p>
    </div>
  );
}

function ScoreBadge({ score }) {
  const hot = score >= 20;
  const warm = score >= 8;
  const color = hot ? "text-plate-red" : warm ? "text-plate-yellow" : "text-steel-dim";
  return <span className={`font-bold ${color}`}>{score}</span>;
}

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(KEY_STORAGE) || "");
  const [keyInput, setKeyInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sort, setSort] = useState("proximity");
  const [runningAutomation, setRunningAutomation] = useState(false);

  const authedFetch = useCallback(
    async (path, options = {}) => {
      const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: { ...(options.headers || {}), "x-admin-key": adminKey },
      });
      if (res.status === 401 || res.status === 503) {
        const body = await res.json().catch(() => ({}));
        setAuthError(body.error || "Access denied.");
        sessionStorage.removeItem(KEY_STORAGE);
        setAdminKey("");
        return null;
      }
      return res;
    },
    [adminKey]
  );

  const loadData = useCallback(async () => {
    if (!adminKey) return;
    setLoading(true);
    const params = new URLSearchParams({
      sort,
      ...(statusFilter && { status: statusFilter }),
      ...(tagFilter && { tag: tagFilter }),
    });
    const [leadsRes, statsRes] = await Promise.all([
      authedFetch(`/api/leads?${params}`),
      authedFetch(`/api/leads/stats`),
    ]);
    if (leadsRes?.ok) setLeads((await leadsRes.json()).leads);
    if (statsRes?.ok) setStats(await statsRes.json());
    setLoading(false);
  }, [adminKey, sort, statusFilter, tagFilter, authedFetch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleKeySubmit = (e) => {
    e.preventDefault();
    setAuthError("");
    sessionStorage.setItem(KEY_STORAGE, keyInput);
    setAdminKey(keyInput);
  };

  const updateLead = async (id, patch) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    await authedFetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  };

  const runAutomationNow = async () => {
    setRunningAutomation(true);
    await authedFetch(`/api/leads/automation/run-now`, { method: "POST" });
    await loadData();
    setRunningAutomation(false);
  };

  if (!adminKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-5">
        <form
          onSubmit={handleKeySubmit}
          className="w-full max-w-sm border border-line-strong bg-panel p-8"
        >
          <div className="mb-4 flex items-center gap-2 text-plate-yellow">
            <Lock size={18} />
            <span className="text-stencil text-xs font-bold tracking-[0.1em]">ADMIN ACCESS</span>
          </div>
          <h1 className="text-display text-2xl text-chalk">{GYM.name} — Leads</h1>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Admin key"
            autoFocus
            className="mt-5 w-full border border-line-strong bg-panel-2 px-4 py-3 text-chalk outline-none focus:border-plate-red"
          />
          {authError && <p className="mt-2 text-xs text-plate-red">{authError}</p>}
          <button
            type="submit"
            className="text-stencil mt-4 w-full bg-plate-red py-3 text-sm font-bold tracking-[0.1em] text-chalk transition-colors hover:bg-plate-red-dim"
          >
            Enter
          </button>
          <p className="mt-4 text-xs text-steel-dim">
            Set with <code className="text-steel">ADMIN_API_KEY</code> in server/.env.
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink px-5 py-10 text-chalk sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-display text-3xl">Leads Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={loadData}
              className="text-stencil flex items-center gap-2 border border-line-strong px-4 py-2.5 text-xs font-bold tracking-[0.1em] text-chalk-dim hover:border-chalk hover:text-chalk"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              onClick={runAutomationNow}
              disabled={runningAutomation}
              className="text-stencil flex items-center gap-2 bg-plate-red px-4 py-2.5 text-xs font-bold tracking-[0.1em] text-chalk hover:bg-plate-red-dim disabled:opacity-60"
            >
              <Zap size={14} /> {runningAutomation ? "Running..." : "Run Automation Now"}
            </button>
          </div>
        </div>

        {stats && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <StatCard label="Total Leads" value={stats.totalLeads} />
            <StatCard label="Local (Nearby)" value={stats.localLeads} />
            <StatCard label="Site Visitors" value={stats.totalVisitors} />
            <StatCard label="WhatsApp Opted-In" value={stats.optedInWhatsApp} />
            <StatCard label="Converted" value={stats.converted} />
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-line-strong bg-panel-2 px-3 py-2 text-sm text-chalk"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="border border-line-strong bg-panel-2 px-3 py-2 text-sm text-chalk"
          >
            <option value="">All audiences</option>
            {TAG_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-line-strong bg-panel-2 px-3 py-2 text-sm text-chalk"
          >
            <option value="proximity">Sort: Nearby first</option>
            <option value="interest">Sort: Hottest first</option>
            <option value="recent">Sort: Most recent</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto border border-line">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-panel text-stencil text-[0.65rem] font-bold tracking-[0.08em] text-steel-dim">
                <th className="px-4 py-3">Lead</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Nearby</th>
                <th className="px-4 py-3">Audience</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Last Seen</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-line/60 align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-chalk">{lead.name || "—"}</p>
                    <a
                      href={`https://wa.me/91${lead.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-steel hover:text-plate-yellow"
                    >
                      {lead.phone} <ExternalLink size={11} />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-xs text-steel">{lead.source}</td>
                  <td className="px-4 py-3"><ScoreBadge score={lead.interestScore} /></td>
                  <td className="px-4 py-3 text-xs">
                    {lead.isLocal ? (
                      <span className="inline-flex items-center gap-1 text-plate-yellow">
                        <MapPin size={12} />
                        {lead.geo?.distanceKm != null ? `${lead.geo.distanceKm}km` : lead.region?.city || "Local"}
                      </span>
                    ) : (
                      <span className="text-steel-dim">{lead.region?.city || "—"}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-steel">
                    {(lead.tags || []).length
                      ? lead.tags.map((t) => TAG_LABELS[t] || t).join(", ")
                      : <span className="text-steel-dim">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {lead.optedInWhatsApp ? (
                      lead.whatsappOptOut ? (
                        <span className="text-steel-dim">Opted out</span>
                      ) : (
                        <span className="text-[#25D366]">Opted in</span>
                      )
                    ) : (
                      <span className="text-steel-dim">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-steel">
                    {new Date(lead.lastSeenAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                      className="border border-line-strong bg-panel-2 px-2 py-1.5 text-xs text-chalk"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      defaultValue={lead.notes}
                      onBlur={(e) => updateLead(lead.id, { notes: e.target.value })}
                      placeholder="Add a note..."
                      className="w-full min-w-[160px] border border-transparent bg-transparent px-2 py-1.5 text-xs text-steel outline-none focus:border-line-strong"
                    />
                  </td>
                </tr>
              ))}
              {!leads.length && !loading && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-steel-dim">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
