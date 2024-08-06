"use client";

import axios from "axios";
import React from "react";
import CustomPieChart from "../../../components/charts/pieChart";

export default function DashboardPage() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);

  const getStatistics = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get("/api/statistics");
      setData(response.data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getStatistics();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <CustomPieChart
        data={[
          { name: "Group A", value: 400 },
          { name: "Group B", value: 300 },
          { name: "Group C", value: 300 },
          { name: "Group D", value: 200 },
        ]}
      />
    </div>
  );
}
