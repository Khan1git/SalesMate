import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  {
    date: '2024-05-01',
    profit: 4000,
    loss: -1000,
  },
  {
    date: '2024-05-02',
    profit: 3000,
    loss: -500,
  },
  {
    date: '2024-05-03',
    profit: 2000,
    loss: -800,
  },
  {
    date: '2024-05-04',
    profit: 2780,
    loss: -1200,
  },
  {
    date: '2024-05-05',
    profit: 1890,
    loss: -700,
  },
  {
    date: '2024-05-06',
    profit: 2390,
    loss: -600,
  },
  {
    date: '2024-05-07',
    profit: 3490,
    loss: -1500,
  },
];

const Areagraph = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
        {/* <h1>PROFIT AND LOSS/</h1> */}
      <AreaChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="profit" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        <Area type="monotone" dataKey="loss" stackId="1" stroke="#ff7300" fill="#ff7300" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Areagraph;
