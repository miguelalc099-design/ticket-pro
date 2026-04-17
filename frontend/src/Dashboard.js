import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await axios.get("http://localhost:3001/stats?tipo=diario");
    setData(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      {data.map((d, i) => (
        <div key={i}>
          {d.fecha} - {d.total}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;