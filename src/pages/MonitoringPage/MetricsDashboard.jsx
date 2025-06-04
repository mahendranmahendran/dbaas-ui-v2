export default function MetricsDashboard() {
  return (
    <div className="metrics-dashboard p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
      {/* Metrics visualization will go here */}
      <div className="grid grid-cols-3 gap-4">
        <div className="metric-card">Queries/sec</div>
        <div className="metric-card">Memory Usage</div>
        <div className="metric-card">Disk Usage</div>
      </div>
    </div>
  );
}