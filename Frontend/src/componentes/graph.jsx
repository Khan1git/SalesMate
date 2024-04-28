import React,{useState, useEffect} from 'react'
import { ResponsiveContainer, RadialBar, RadialBarChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, AreaChart, Area, BarChart, Bar } from 'recharts'

const Graph = () => { 
  const [pdata, setPdata] = useState([])

  const showAllproducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/product/getall", {
        method: "GET"
      })
      const result = await response.json()
      setPdata(result)

    } catch (error) {
      toast.error("An Error Has Occured")
      console.log(error)

    }
  }

  useEffect(() => {
    showAllproducts()
  }, [])

  const slicedPdata = pdata.slice(0, 9);
  return (
    <div>
        <ResponsiveContainer width="96%" height="100%" aspect={2.3} className="ch1">
            <BarChart
              width={500}
              height={10}
              data={slicedPdata}
              margin={{
                top: 20,
                right: 0,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#8884d8" />
              <Bar dataKey="saleprice" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
      
    </div>
  )
}

export default Graph
