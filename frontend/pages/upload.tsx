import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell
} from "recharts";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [featureData, setFeatureData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brandData, setBrandData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [verifiedData, setVerifiedData] = useState([]);
  const [ageData, setAgeData] = useState([]);

  const uploadAndAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setFeatureData(data.feature_summary);
    setPieData(data.overall_summary);
    setBrandData(data.sentiment_by_brand || []);
    setProductData(data.sentiment_by_product || []);
    setRatingData(data.sentiment_by_rating || []);
    setPlatformData(data.sentiment_by_platform || []);
    setGenderData(data.sentiment_by_gender || []);
    setVerifiedData(data.sentiment_by_verified || []);
    setAgeData(data.sentiment_by_age || []);
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📤 Upload CSV File</h2>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button
        style={{ marginTop: '1rem', padding: '10px 20px', cursor: 'pointer' }}
        onClick={uploadAndAnalyze}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {loading && (
        <div style={{ marginTop: '1rem', color: '#888' }}>Processing, please wait...</div>
      )}

      {featureData.length > 0 && (
        <>
          <h3 style={{ marginTop: '2rem' }}>📊 Feature-wise Sentiment</h3>
          <BarChart width={600} height={300} data={featureData}>
            <XAxis dataKey="feature" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="POSITIVE" fill="#82ca9d" />
            <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
          </BarChart>
        </>
      )}

      {pieData.length > 0 && (
        <>
          <h3 style={{ marginTop: '2rem' }}>🧠 Overall Sentiment</h3>
          <PieChart width={400} height={300}>
            <Pie data={pieData} cx={200} cy={150} outerRadius={100} label dataKey="count">
              <Cell fill="#82ca9d" />
              <Cell fill="#ff7f7f" />
            </Pie>
            <Tooltip />
          </PieChart>
        </>
      )}

      {/* Brand Sentiment Chart */}
      {brandData.length > 0 && (
        <>
          <h3 style={{ marginTop: '2rem' }}>🏷️ Sentiment by Brand</h3>
          <BarChart width={600} height={300} data={brandData}>
            <XAxis dataKey="Brand" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="POSITIVE" fill="#82ca9d" />
            <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
          </BarChart>
        </>
      )}
      {/* Product Sentiment Chart */}
      {productData.length > 0 && (
        <>
          <h3 style={{ marginTop: '2rem' }}>📱 Sentiment by Product</h3>
          <BarChart width={600} height={300} data={productData}>
            <XAxis dataKey="Product Name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="POSITIVE" fill="#82ca9d" />
            <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
          </BarChart>
        </>
      )}
      {/* Rating Sentiment Chart */}
      {ratingData.length > 0 && (
        <>
          <h3 style={{ marginTop: '2rem' }}>⭐ Sentiment by Rating</h3>
          <BarChart width={600} height={300} data={ratingData}>
            <XAxis dataKey="Rating" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="POSITIVE" fill="#82ca9d" />
            <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
          </BarChart>
        </>
      )}
      {/* Platform Sentiment Chart */}
      {platformData.length > 0 && (
        <>
          <h3 style={{ marginTop: '2rem' }}>🛒 Sentiment by Platform</h3>
          <BarChart width={600} height={300} data={platformData}>
            <XAxis dataKey="Platform" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="POSITIVE" fill="#82ca9d" />
            <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
          </BarChart>
        </>
      )}
      {/* Gender Sentiment Chart */}
      {genderData.length > 0 && (
        <>
          <h3 style={{ marginTop: '2rem' }}>👤 Sentiment by Gender</h3>
          <BarChart width={600} height={300} data={genderData}>
            <XAxis dataKey="Gender" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="POSITIVE" fill="#82ca9d" />
            <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
          </BarChart>
        </>
      )}
      {/* Verified Purchase Sentiment Chart */}
      {verifiedData.length > 0 && (
        <>
          <h3 style={{ marginTop: '2rem' }}>✅ Sentiment by Verified Purchase</h3>
          <BarChart width={600} height={300} data={verifiedData}>
            <XAxis dataKey="Verified Purchase" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="POSITIVE" fill="#82ca9d" />
            <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
          </BarChart>
        </>
      )}
      {/* Age Sentiment Chart */}
      {ageData.length > 0 && (
        <>
          <h3 style={{ marginTop: '2rem' }}>🎂 Sentiment by Age</h3>
          <BarChart width={600} height={300} data={ageData}>
            <XAxis dataKey="Age" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="POSITIVE" fill="#82ca9d" />
            <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
          </BarChart>
        </>
      )}
    </div>
  );
}
