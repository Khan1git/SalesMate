import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Piechart = () => {
  const [counts, setCounts] = useState({ customers: 0, products: 0 });
  // console.log(counts)

  useEffect(() => {
    const countCustomers = async () => {
      try {
        const getCustomers = await fetch("http://localhost:5000/api/customer/countall");
        const result = await getCustomers.json();
        setCounts(prevCounts => ({ ...prevCounts, customers: result }));
      } catch (error) {
        console.log("Error fetching customer count:", error);
      }
    };

    const countProducts = async () => {
      try {
        const countAllProducts = await fetch("http://localhost:5000/api/product/countall");
        const result = await countAllProducts.json();
        setCounts(prevCounts => ({ ...prevCounts, products: result }));
      } catch (error) {
        console.log("Error fetching product count:", error);
      }
    };

    countCustomers();
    countProducts();
  }, []);

  const data = [
    { name: 'Customer', value: counts.customers },
    { name: 'Products', value: counts.products },
    { name: 'Purchases', value:4},
    { name: 'Sales', value: 3 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Piechart;
