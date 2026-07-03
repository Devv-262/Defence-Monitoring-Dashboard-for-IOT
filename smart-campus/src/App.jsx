import { useState, useEffect, useRef } from "react";
import { Shield, AlertTriangle, Activity, Wifi, Lock, Unlock, Lightbulb, Thermometer, Droplet, Wind, Car, Trees, Building, Server, TrendingUp, Bell, Eye, Terminal, Zap, XCircle, CheckCircle, Mail, Database, Cpu, HardDrive, Network, Power, RefreshCw, Settings, BarChart3, LineChart as LineChartIcon, UserCheck, ShieldAlert, Ban, PlayCircle, StopCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

// FIX 1: Pre-define color maps to avoid dynamic Tailwind class generation (which gets purged)
const COLOR_STYLES = {
  red:    { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",   text: "#f87171",  badge: "rgba(239,68,68,0.2)"  },
  orange: { bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.3)",  text: "#fb923c",  badge: "rgba(249,115,22,0.2)" },
  yellow: { bg: "rgba(234,179,8,0.1)",   border: "rgba(234,179,8,0.3)",   text: "#facc15",  badge: "rgba(234,179,8,0.2)"  },
  purple: { bg: "rgba(139,92,246,0.1)",  border: "rgba(139,92,246,0.3)",  text: "#a78bfa",  badge: "rgba(139,92,246,0.2)" },
  cyan:   { bg: "rgba(6,182,212,0.1)",   border: "rgba(6,182,212,0.3)",   text: "#22d3ee",  badge: "rgba(6,182,212,0.2)"  },
  pink:   { bg: "rgba(236,72,153,0.1)",  border: "rgba(236,72,153,0.3)",  text: "#f472b6",  badge: "rgba(236,72,153,0.2)" },
  green:  { bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)",   text: "#4ade80",  badge: "rgba(34,197,94,0.2)"  },
  blue:   { bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.3)",  text: "#60a5fa",  badge: "rgba(59,130,246,0.2)" },
};

export default function SmartCampusDashboard() {
  const [activeView, setActiveView] = useState("login");
  const [selectedSector, setSelectedSector] = useState("all");
  const [alerts, setAlerts] = useState([]);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [attackHistory, setAttackHistory] = useState([]);
  const [cpuHistory, setCpuHistory] = useState([]);
  const [networkHistory, setNetworkHistory] = useState([]);
  const [mitigationStatus, setMitigationStatus] = useState({
    firewall: true,
    fail2ban: true,
    rateLimit: false,
    arpProtection: false,
    portSecurity: true,
  });

  const [attackMetrics, setAttackMetrics] = useState({
    dosCount: 0,
    sqlInjectionAttempts: 0,
    bruteForceAttempts: 0,
    arpSpoofing: 0,
    portScan: 0,
    mitm: 0,
  });

  const [systemHealth, setSystemHealth] = useState({
    cpu: 45,
    memory: 62,
    disk: 58,
    temperature: 52,
    network: 78,
    packets: { incoming: 1240, outgoing: 890 },
  });

  // FIX 2: Use a ref to track systemHealth in the interval callback to avoid
  // adding it as a dependency (which caused an infinite re-render loop).
  const systemHealthRef = useRef(systemHealth);
  useEffect(() => {
    systemHealthRef.current = systemHealth;
  }, [systemHealth]);

  const [sectors, setSectors] = useState({
    buildingA: {
      name: "Building A",
      ip: "192.168.1.101",
      status: "online",
      esp32: "ESP32-Node-01",
      sensors: {
        motion:      { active: false, value: 0,   unit: "",    lastUpdate: "2s ago" },
        light:       { active: true,  value: 75,  unit: "%",   lastUpdate: "1s ago" },
        temperature: { active: true,  value: 24,  unit: "°C",  lastUpdate: "3s ago" },
        smoke:       { active: false, value: 0,   unit: "ppm", lastUpdate: "2s ago" },
      },
    },
    buildingB: {
      name: "Building B",
      ip: "192.168.1.102",
      status: "online",
      esp32: "ESP32-Node-02",
      sensors: {
        motion:      { active: true,  value: 1,  unit: "",    lastUpdate: "1s ago" },
        light:       { active: false, value: 0,  unit: "%",   lastUpdate: "4s ago" },
        temperature: { active: true,  value: 22, unit: "°C",  lastUpdate: "2s ago" },
        smoke:       { active: false, value: 0,  unit: "ppm", lastUpdate: "5s ago" },
      },
    },
    parking: {
      name: "Parking Area",
      ip: "192.168.1.103",
      status: "online",
      esp32: "ESP32-Node-03",
      sensors: {
        ultrasonic: { active: true,  value: 45, unit: "cm", lastUpdate: "1s ago" },
        ir:         { active: true,  value: 1,  unit: "",   lastUpdate: "2s ago" },
        light:      { active: true,  value: 80, unit: "%",  lastUpdate: "1s ago" },
        gate:       { active: false, value: 0,  unit: "",   lastUpdate: "3s ago" },
      },
    },
    park: {
      name: "Park Zone",
      ip: "192.168.1.104",
      status: "online",
      esp32: "ESP32-Node-04",
      sensors: {
        soilMoisture: { active: true,  value: 65,  unit: "%",  lastUpdate: "2s ago" },
        light:        { active: true,  value: 100, unit: "%",  lastUpdate: "1s ago" },
        sound:        { active: false, value: 35,  unit: "dB", lastUpdate: "4s ago" },
        temperature:  { active: true,  value: 26,  unit: "°C", lastUpdate: "2s ago" },
      },
    },
  });

  // Initialize history data
  useEffect(() => {
    setAttackHistory(
      Array.from({ length: 20 }, (_, i) => ({
        time: `${i}s`,
        attacks: Math.floor(Math.random() * 10),
        packets: 100 + Math.floor(Math.random() * 50),
      }))
    );
    setCpuHistory(
      Array.from({ length: 20 }, (_, i) => ({
        time: `${i}s`,
        cpu: 30 + Math.floor(Math.random() * 40),
        memory: 40 + Math.floor(Math.random() * 30),
        temp: 45 + Math.floor(Math.random() * 20),
      }))
    );
    setNetworkHistory(
      Array.from({ length: 20 }, (_, i) => ({
        time: `${i}s`,
        incoming: 800 + Math.floor(Math.random() * 400),
        outgoing: 600 + Math.floor(Math.random() * 300),
      }))
    );
  }, []);

  // FIX 2 (continued): Removed `systemHealth` from deps array; read it via ref inside the interval.
  useEffect(() => {
    if (activeView !== "defense") return;

    const interval = setInterval(() => {
      const health = systemHealthRef.current;
      const attackTypes = ["dos", "sql", "brute", "arp", "portscan", "mitm"];
      const randomAttack = attackTypes[Math.floor(Math.random() * attackTypes.length)];

      if (Math.random() > 0.65) {
        const timestamp = new Date().toLocaleTimeString();
        const sourceIp = `192.168.1.${Math.floor(Math.random() * 255)}`;
        let newAlert = null;

        switch (randomAttack) {
          case "dos":
            setAttackMetrics((prev) => ({ ...prev, dosCount: prev.dosCount + 1 }));
            newAlert = { type: "critical", category: "DoS Attack", message: `High-volume packet flood detected from ${sourceIp}`, time: timestamp, severity: "CRITICAL" };
            setSystemHealth((prev) => ({
              ...prev,
              network: Math.max(20, prev.network - 15),
              packets: { incoming: prev.packets.incoming + 500, outgoing: prev.packets.outgoing },
            }));
            break;
          case "sql":
            setAttackMetrics((prev) => ({ ...prev, sqlInjectionAttempts: prev.sqlInjectionAttempts + 1 }));
            newAlert = { type: "warning", category: "SQL Injection", message: `Malicious SQL query detected in login form from ${sourceIp}`, time: timestamp, severity: "HIGH" };
            break;
          case "brute":
            setAttackMetrics((prev) => ({ ...prev, bruteForceAttempts: prev.bruteForceAttempts + 1 }));
            newAlert = { type: "warning", category: "Brute Force", message: `Multiple failed SSH login attempts (15/min) from ${sourceIp}`, time: timestamp, severity: "HIGH" };
            break;
          case "arp":
            setAttackMetrics((prev) => ({ ...prev, arpSpoofing: prev.arpSpoofing + 1 }));
            newAlert = { type: "critical", category: "ARP Spoofing", message: `ARP cache poisoning detected - MITM attack in progress`, time: timestamp, severity: "CRITICAL" };
            break;
          case "portscan":
            setAttackMetrics((prev) => ({ ...prev, portScan: prev.portScan + 1 }));
            newAlert = { type: "info", category: "Port Scan", message: `Sequential port scanning detected from ${sourceIp}`, time: timestamp, severity: "MEDIUM" };
            break;
          case "mitm":
            setAttackMetrics((prev) => ({ ...prev, mitm: prev.mitm + 1 }));
            newAlert = { type: "critical", category: "MITM Attack", message: `Man-in-the-Middle attack detected on network interface`, time: timestamp, severity: "CRITICAL" };
            break;
          default:
            break;
        }

        if (newAlert) {
          setAlerts((prev) => [newAlert, ...prev].slice(0, 15));
          setAttackHistory((prev) => [
            ...prev.slice(1),
            { time: new Date().toLocaleTimeString(), attacks: Math.floor(Math.random() * 15) + 5, packets: health.packets.incoming },
          ]);
        }
      }

      // Update system health
      setSystemHealth((prev) => ({
        cpu: Math.min(95, Math.max(30, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.min(90, Math.max(40, prev.memory + (Math.random() - 0.5) * 8)),
        disk: Math.min(85, Math.max(50, prev.disk + (Math.random() - 0.5) * 5)),
        temperature: Math.min(75, Math.max(45, prev.temperature + (Math.random() - 0.5) * 3)),
        network: Math.min(100, prev.network + 2),
        packets: {
          incoming: prev.packets.incoming + Math.floor(Math.random() * 50),
          outgoing: prev.packets.outgoing + Math.floor(Math.random() * 30),
        },
      }));

      setCpuHistory((prev) => [
        ...prev.slice(1),
        { time: new Date().toLocaleTimeString(), cpu: health.cpu, memory: health.memory, temp: health.temperature },
      ]);

      setNetworkHistory((prev) => [
        ...prev.slice(1),
        { time: new Date().toLocaleTimeString(), incoming: health.packets.incoming, outgoing: health.packets.outgoing },
      ]);
    }, 2500);

    return () => clearInterval(interval);
  }, [activeView]); // FIX 2: Only depend on activeView, not systemHealth

  const toggleSensor = (sectorKey, sensorKey) => {
    setSectors((prev) => ({
      ...prev,
      [sectorKey]: {
        ...prev[sectorKey],
        sensors: {
          ...prev[sectorKey].sensors,
          [sensorKey]: {
            ...prev[sectorKey].sensors[sensorKey],
            active: !prev[sectorKey].sensors[sensorKey].active,
          },
        },
      },
    }));
  };

  const toggleMitigation = (key) => {
    setMitigationStatus((prev) => ({ ...prev, [key]: !prev[key] }));
    const action = !mitigationStatus[key] ? "ENABLED" : "DISABLED";
    const timestamp = new Date().toLocaleTimeString();
    setAlerts((prev) =>
      [{ type: "info", category: "Security Action", message: `${key.toUpperCase()} has been ${action}`, time: timestamp, severity: "INFO" }, ...prev].slice(0, 15)
    );
  };

  const blockIP = (ip) => {
    const timestamp = new Date().toLocaleTimeString();
    setAlerts((prev) =>
      [{ type: "info", category: "IP Blocked", message: `IP address ${ip} has been blocked via UFW firewall`, time: timestamp, severity: "INFO" }, ...prev].slice(0, 15)
    );
  };

  // ─── LOGIN VIEW ───────────────────────────────────────────────────────────
  if (activeView === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.8),rgba(0,0,0,0.9))]" />
        <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-12 max-w-2xl w-full border border-gray-700 shadow-2xl">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Shield className="w-24 h-24 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3">
              Smart Campus
            </h1>
            <h2 className="text-2xl text-gray-300 mb-2">Simulation Project</h2>
            <p className="text-cyan-400 text-sm">Advanced IoT Security Control System</p>
            <div className="mt-4 text-gray-500 text-xs">
              <p>RNS Institute of Technology</p>
              <p className="mt-1">Raspberry Pi 4 Control Center</p>
            </div>
          </div>

          <div className="space-y-5">
            <button
              onClick={() => setActiveView("user")}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-5 rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 flex items-center justify-center gap-3 text-lg"
            >
              <Eye className="w-6 h-6" />
              User Control Dashboard
              <Activity className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActiveView("defense")}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-5 rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50 flex items-center justify-center gap-3 text-lg"
            >
              <Shield className="w-6 h-6" />
              Defense &amp; Security Dashboard
              <ShieldAlert className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-700 flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              <span>192.168.1.1</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Online</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── USER DASHBOARD ───────────────────────────────────────────────────────
  if (activeView === "user") {
    const filteredSectors =
      selectedSector === "all" ? Object.entries(sectors) : [[selectedSector, sectors[selectedSector]]];

    // FIX 1: Use inline styles instead of dynamic Tailwind class strings
    const sectorGradients = {
      buildingA: "linear-gradient(135deg,#3b82f6,#06b6d4)",
      buildingB: "linear-gradient(135deg,#a855f7,#ec4899)",
      parking:   "linear-gradient(135deg,#f97316,#eab308)",
      park:      "linear-gradient(135deg,#22c55e,#10b981)",
    };
    const sectorBorders = {
      buildingA: "rgba(59,130,246,0.3)",
      buildingB: "rgba(168,85,247,0.3)",
      parking:   "rgba(249,115,22,0.3)",
      park:      "rgba(34,197,94,0.3)",
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-cyan-400/30 shadow-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Shield className="w-16 h-16 text-cyan-300" />
                <div className="absolute inset-0 bg-cyan-400/30 blur-xl rounded-full" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">Smart Campus Simulation Project</h1>
                <p className="text-cyan-200 text-lg">User Control Dashboard - Real-time IoT Management</p>
                <p className="text-cyan-300 text-sm mt-1">RNS Institute of Technology | Raspberry Pi Control Center</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView("login")}
              className="bg-red-500/30 hover:bg-red-500/50 border border-red-400 text-red-200 px-6 py-3 rounded-xl transition-all hover:scale-105 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* System Status Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl p-4 border border-green-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm mb-1">Active Sensors</p>
                <p className="text-3xl font-bold text-white">
                  {Object.values(sectors).reduce(
                    (acc, sector) => acc + Object.values(sector.sensors).filter((s) => s.active).length,
                    0
                  )}
                </p>
              </div>
              <Activity className="w-10 h-10 text-green-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl p-4 border border-blue-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm mb-1">Online Nodes</p>
                <p className="text-3xl font-bold text-white">4/4</p>
              </div>
              <Wifi className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl p-4 border border-purple-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm mb-1">Network Status</p>
                <p className="text-2xl font-bold text-white">Secured</p>
              </div>
              <Lock className="w-10 h-10 text-purple-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-xl rounded-xl p-4 border border-orange-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm mb-1">Pi Temperature</p>
                <p className="text-3xl font-bold text-white">52°C</p>
              </div>
              <Thermometer className="w-10 h-10 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Sector Filter */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-cyan-400/30">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <Building className="w-6 h-6" /> Select Campus Sector
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => setSelectedSector("all")}
              className={`py-4 px-6 rounded-xl transition-all transform hover:scale-105 font-semibold ${
                selectedSector === "all"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                  : "bg-white/10 text-cyan-300 hover:bg-white/20 border border-cyan-400/30"
              }`}
            >
              All Sectors
            </button>
            {Object.entries(sectors).map(([key, sector]) => (
              <button
                key={key}
                onClick={() => setSelectedSector(key)}
                style={selectedSector === key ? { background: sectorGradients[key] } : {}}
                className={`py-4 px-6 rounded-xl transition-all transform hover:scale-105 font-semibold ${
                  selectedSector === key
                    ? "text-white shadow-lg"
                    : "bg-white/10 text-cyan-300 hover:bg-white/20 border border-cyan-400/30"
                }`}
              >
                {sector.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSectors.map(([key, sector]) => (
            <div
              key={key}
              style={{ borderColor: sectorBorders[key] }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {key === "parking" ? (
                      <Car className="w-12 h-12 text-orange-300" />
                    ) : key === "park" ? (
                      <Trees className="w-12 h-12 text-green-300" />
                    ) : (
                      <Building className="w-12 h-12 text-blue-300" />
                    )}
                    <div className="absolute inset-0 bg-current blur-lg opacity-30 rounded-full" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{sector.name}</h2>
                    <p className="text-sm text-cyan-200 mt-1">{sector.esp32}</p>
                    <p className="text-xs text-cyan-300">{sector.ip}</p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    sector.status === "online"
                      ? "bg-green-500/30 border border-green-400 text-green-200"
                      : "bg-red-500/30 border border-red-400 text-red-200"
                  }`}
                >
                  <Wifi className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase">{sector.status}</span>
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(sector.sensors).map(([sensorKey, sensor]) => (
                  <div key={sensorKey} className="bg-black/20 rounded-xl p-5 border border-white/10 hover:border-white/30 transition-all">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative">
                          {sensorKey.includes("light") ? (
                            <Lightbulb className={`w-8 h-8 ${sensor.active ? "text-yellow-300" : "text-gray-500"}`} />
                          ) : sensorKey.includes("temperature") ? (
                            <Thermometer className={`w-8 h-8 ${sensor.active ? "text-orange-300" : "text-gray-500"}`} />
                          ) : sensorKey.toLowerCase().includes("moisture") ? (
                            <Droplet className={`w-8 h-8 ${sensor.active ? "text-blue-300" : "text-gray-500"}`} />
                          ) : sensorKey.includes("smoke") ? (
                            <Wind className={`w-8 h-8 ${sensor.active ? "text-red-300" : "text-gray-500"}`} />
                          ) : (
                            <Activity className={`w-8 h-8 ${sensor.active ? "text-purple-300" : "text-gray-500"}`} />
                          )}
                          {sensor.active && <div className="absolute inset-0 bg-current blur-lg opacity-40 rounded-full" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-bold text-lg capitalize">
                            {sensorKey.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-2xl font-bold ${sensor.active ? "text-cyan-300" : "text-gray-500"}`}>
                              {sensor.value}{sensor.unit}
                            </span>
                            <span className="text-xs text-gray-400">{sensor.lastUpdate}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSensor(key, sensorKey)}
                        className={`px-6 py-3 rounded-xl transition-all transform hover:scale-110 font-bold flex items-center gap-2 ${
                          sensor.active
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/50"
                            : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-gray-300"
                        }`}
                      >
                        {sensor.active ? (
                          <><Unlock className="w-5 h-5" /> ON</>
                        ) : (
                          <><Lock className="w-5 h-5" /> OFF</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── DEFENSE DASHBOARD ────────────────────────────────────────────────────
  if (activeView === "defense") {
    const attackPieData = [
      { name: "DoS",           value: attackMetrics.dosCount,              color: "#ef4444" },
      { name: "SQL Injection", value: attackMetrics.sqlInjectionAttempts,  color: "#f97316" },
      { name: "Brute Force",   value: attackMetrics.bruteForceAttempts,    color: "#eab308" },
      { name: "ARP Spoofing",  value: attackMetrics.arpSpoofing,           color: "#8b5cf6" },
      { name: "Port Scan",     value: attackMetrics.portScan,              color: "#06b6d4" },
      { name: "MITM",          value: attackMetrics.mitm,                  color: "#ec4899" },
    ].filter((item) => item.value > 0);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950 to-gray-950 p-6 overflow-x-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-red-500/30 shadow-2xl">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Shield className="w-16 h-16 text-red-400 animate-pulse" />
                <div className="absolute inset-0 bg-red-400/30 blur-xl rounded-full" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                  Defense &amp; Security Dashboard
                  <ShieldAlert className="w-10 h-10 text-red-400" />
                </h1>
                <p className="text-red-300 text-lg">Real-time Attack Detection &amp; Raspbian OS Protection</p>
                <p className="text-red-200 text-sm mt-1">Smart Campus Simulation Project | Raspberry Pi 4</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-green-500/20 border border-green-400 px-4 py-2 rounded-xl">
                <Mail className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-semibold">Alerts: {emailAlerts ? "ON" : "OFF"}</span>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className="ml-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-all"
                >
                  Toggle
                </button>
              </div>
              <button
                onClick={() => setActiveView("login")}
                className="bg-red-500/30 hover:bg-red-500/50 border border-red-400 text-red-200 px-6 py-3 rounded-xl transition-all hover:scale-105 font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Attack Metrics - FIX 1: inline styles for color-dependent properties */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { key: "dosCount",              label: "DoS Attacks",   color: "red",    icon: Zap         },
            { key: "sqlInjectionAttempts",  label: "SQL Injection", color: "orange", icon: Terminal    },
            { key: "bruteForceAttempts",    label: "Brute Force",   color: "yellow", icon: Lock        },
            { key: "arpSpoofing",           label: "ARP Spoofing",  color: "purple", icon: AlertTriangle },
            { key: "portScan",              label: "Port Scans",    color: "cyan",   icon: Network     },
            { key: "mitm",                  label: "MITM Attacks",  color: "pink",   icon: ShieldAlert },
          ].map(({ key, label, color, icon: Icon }) => {
            const cs = COLOR_STYLES[color];
            return (
              <div
                key={key}
                style={{ background: cs.bg, borderColor: cs.border }}
                className="backdrop-blur-xl rounded-xl p-5 border hover:scale-105 transition-all shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon style={{ color: cs.text }} className="w-8 h-8" />
                  <span style={{ background: cs.badge, color: cs.text }} className="text-xs font-bold px-2 py-1 rounded-full">
                    LIVE
                  </span>
                </div>
                <p style={{ color: cs.text }} className="text-sm mb-1 font-semibold">{label}</p>
                <p className="text-4xl font-bold text-white">{attackMetrics[key]}</p>
              </div>
            );
          })}
        </div>

        {/* Mitigation Controls */}
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-blue-500/30 shadow-xl">
          <h3 className="text-white font-bold text-2xl mb-4 flex items-center gap-2">
            <Settings className="w-7 h-7" /> Raspbian OS Security Controls
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { key: "firewall",     label: "UFW Firewall",  desc: "Block suspicious IPs"  },
              { key: "fail2ban",     label: "Fail2Ban",      desc: "Auto-ban brute force"  },
              { key: "rateLimit",    label: "Rate Limiting", desc: "Throttle connections"  },
              { key: "arpProtection",label: "ARP Guard",     desc: "Prevent ARP spoofing"  },
              { key: "portSecurity", label: "Port Security", desc: "Close unused ports"    },
            ].map(({ key, label, desc }) => (
              <button
                key={key}
                onClick={() => toggleMitigation(key)}
                className={`p-4 rounded-xl transition-all transform hover:scale-105 border-2 ${
                  mitigationStatus[key]
                    ? "bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400 shadow-lg shadow-green-500/30"
                    : "bg-gradient-to-br from-red-500/30 to-orange-500/30 border-red-400 shadow-lg shadow-red-500/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  {mitigationStatus[key] ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  {mitigationStatus[key] ? (
                    <PlayCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <StopCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <p className="text-white font-bold text-sm mb-1">{label}</p>
                <p className="text-xs text-gray-300">{desc}</p>
                <div className={`mt-2 px-2 py-1 rounded-full text-xs font-bold ${mitigationStatus[key] ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                  {mitigationStatus[key] ? "ACTIVE" : "INACTIVE"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Attack History Chart */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" /> Attack Timeline (Real-time)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={attackHistory}>
                <defs>
                  <linearGradient id="attackGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} labelStyle={{ color: "#fff" }} />
                <Area type="monotone" dataKey="attacks" stroke="#ef4444" fillOpacity={1} fill="url(#attackGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Attack Distribution Pie Chart */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6" /> Attack Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={attackPieData.length > 0 ? attackPieData : [{ name: "No Data", value: 1, color: "#374151" }]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(attackPieData.length > 0 ? attackPieData : [{ name: "No Data", value: 1, color: "#374151" }]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* System Health Chart */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <LineChartIcon className="w-6 h-6" /> System Resources (Live)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={cpuHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} labelStyle={{ color: "#fff" }} />
                <Legend />
                <Line type="monotone" dataKey="cpu"    stroke="#06b6d4" strokeWidth={2} dot={false} name="CPU %"    />
                <Line type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Memory %" />
                <Line type="monotone" dataKey="temp"   stroke="#f97316" strokeWidth={2} dot={false} name="Temp °C"  />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Network Traffic Chart */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" /> Network Packets (Live)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={networkHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }} labelStyle={{ color: "#fff" }} />
                <Legend />
                <Bar dataKey="incoming" fill="#22c55e" name="Incoming" />
                <Bar dataKey="outgoing" fill="#3b82f6" name="Outgoing" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health Cards - FIX 1: inline styles for color-dependent properties */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: "CPU Usage",    value: systemHealth.cpu,         unit: "%",  icon: Cpu,        color: "cyan",   threshold: 80 },
            { label: "Memory",       value: systemHealth.memory,      unit: "%",  icon: Database,   color: "purple", threshold: 75 },
            { label: "Disk Usage",   value: systemHealth.disk,        unit: "%",  icon: HardDrive,  color: "blue",   threshold: 80 },
            { label: "Temperature",  value: systemHealth.temperature, unit: "°C", icon: Thermometer,color: "orange", threshold: 70 },
            { label: "Network",      value: systemHealth.network,     unit: "%",  icon: Network,    color: "green",  threshold: 40 },
          ].map(({ label, value, unit, icon: Icon, color, threshold }) => {
            const isWarning = label === "Network" ? value < threshold : value > threshold;
            const cs = COLOR_STYLES[color];
            const barWidth = label === "Temperature" ? (value / 100) * 100 : value;
            return (
              <div key={label} style={{ background: cs.bg, borderColor: cs.border }} className="backdrop-blur-xl rounded-xl p-4 border shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Icon style={{ color: cs.text }} className="w-7 h-7" />
                  {isWarning && <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />}
                </div>
                <p style={{ color: cs.text }} className="text-xs mb-1 font-semibold">{label}</p>
                <p className="text-3xl font-bold text-white">{value.toFixed(1)}{unit}</p>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div style={{ width: `${barWidth}%`, background: cs.text }} className="h-full transition-all duration-500 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-time Alerts Feed */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-2xl flex items-center gap-2">
              <Bell className="w-7 h-7 animate-pulse" /> Live Attack Detection Feed
            </h3>
            <button
              onClick={() => setAlerts([])}
              className="bg-red-500/30 hover:bg-red-500/50 border border-red-400 text-red-200 px-4 py-2 rounded-lg transition-all text-sm font-semibold"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {alerts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3" />
                <p className="text-gray-400 text-xl font-semibold">No threats detected</p>
                <p className="text-gray-500 text-sm mt-2">System is secure and monitoring</p>
              </div>
            ) : (
              alerts.map((alert, idx) => {
                const severityColors = {
                  CRITICAL: "from-red-600/30 to-red-700/30 border-red-500",
                  HIGH:     "from-orange-600/30 to-orange-700/30 border-orange-500",
                  MEDIUM:   "from-yellow-600/30 to-yellow-700/30 border-yellow-500",
                  INFO:     "from-blue-600/30 to-blue-700/30 border-blue-500",
                };
                const severityColor = severityColors[alert.severity] || severityColors.INFO;
                return (
                  <div key={idx} className={`bg-gradient-to-r ${severityColor} backdrop-blur-lg p-5 rounded-xl border-2 hover:scale-[1.02] transition-all`}>
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        {alert.type === "critical" ? (
                          <ShieldAlert className="w-8 h-8 text-red-400 animate-pulse" />
                        ) : alert.type === "warning" ? (
                          <AlertTriangle className="w-8 h-8 text-yellow-400" />
                        ) : (
                          <CheckCircle className="w-8 h-8 text-blue-400" />
                        )}
                        <div className="absolute inset-0 bg-current blur-xl opacity-40 rounded-full" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            alert.severity === "CRITICAL" ? "bg-red-500 text-white" :
                            alert.severity === "HIGH"     ? "bg-orange-500 text-white" :
                            alert.severity === "MEDIUM"   ? "bg-yellow-500 text-black" :
                                                            "bg-blue-500 text-white"
                          }`}>
                            {alert.severity}
                          </span>
                          <span className="text-white font-bold text-lg">{alert.category}</span>
                        </div>
                        <p className="text-white font-medium text-base mb-2">{alert.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-300 text-sm">{alert.time}</p>
                          {alert.type === "critical" && (
                            <button
                              onClick={() => blockIP("192.168.1.150")}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                            >
                              <Ban className="w-4 h-4" /> Block IP
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}