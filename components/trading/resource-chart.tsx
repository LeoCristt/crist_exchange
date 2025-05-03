"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Generates mockup price data for different resources
const generatePriceData = (resourceId: string) => {
  const basePrice = {
    "helium-3": 1000,
    "titanium": 280,
    "xenocrystal": 1150,
    "oxygen": 85,
    "uranium": 580,
    "water": 120
  }[resourceId] || 300;
  
  const volatility = {
    "helium-3": 15,
    "titanium": 10,
    "xenocrystal": 50,
    "oxygen": 5,
    "uranium": 30,
    "water": 8
  }[resourceId] || 10;
  
  // Generate some random price fluctuations
  const data = [];
  let lastPrice = basePrice;
  
  // Generate 24 data points (hourly)
  for (let i = 0; i < 24; i++) {
    const change = (Math.random() - 0.5) * volatility;
    lastPrice = Math.max(1, lastPrice + change);
    
    data.push({
      time: `${i}:00`,
      price: Math.round(lastPrice * 100) / 100,
    });
  }
  
  return data;
};

export function ResourceChart({ resourceId }: { resourceId: string }) {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    setData(generatePriceData(resourceId));
  }, [resourceId]);
  
  const resourceColors = {
    "helium-3": "#3b82f6",
    "titanium": "#9ca3af",
    "xenocrystal": "#8b5cf6",
    "oxygen": "#06b6d4",
    "uranium": "#22c55e",
    "water": "#60a5fa"
  };
  
  const color = resourceColors[resourceId as keyof typeof resourceColors] || "#3b82f6";
  
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`gradient-${resourceId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
          />
          <YAxis 
            stroke="#9ca3af" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: 'none',
              borderRadius: '8px',
              color: '#f3f4f6',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            labelStyle={{ color: '#9ca3af', fontWeight: 'bold', marginBottom: '4px' }}
            itemStyle={{ color: '#f3f4f6' }}
            formatter={(value) => [`${value} $`, 'Price']}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#gradient-${resourceId})`} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}