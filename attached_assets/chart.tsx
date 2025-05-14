import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';

interface PriceData {
  date: string;
  price: number;
}

interface PriceChartProps {
  data: PriceData[];
  height?: number;
}

export function PriceChart({ data, height = 300 }: PriceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickLine={false}
          axisLine={false}
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          tickFormatter={(value) => `$${value.toFixed(5)}`}
          tickLine={false}
          axisLine={false}
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          formatter={(value) => [`$${Number(value).toFixed(5)}`, 'Price']}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="price" 
          stroke="hsl(var(--primary))" 
          fillOpacity={1} 
          fill="url(#colorPrice)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
