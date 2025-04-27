import Dashboard from "./Dashboard";
import { ProgressDashboard } from '@/components/dashboard/ProgressDashboard';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <>
      <Dashboard />
      {/* Health Metrics with Progress Bars */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Health Progress</h2>
        <ProgressDashboard />
      </section>
      {/* Add a link to the Personalized Insights Feed page */}
      <Link to="/personalized-insights" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">Personalized Insights Feed</h2>
        <p className="text-gray-600">Get your customized health content, articles, and recommendations.</p>
      </Link>
      
      {/* Add a link to the Symptom Checker page */}
      <Link to="/symptom-checker" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">Symptom Checker</h2>
        <p className="text-gray-600">Check your symptoms and get potential conditions with our step-by-step wizard.</p>
      </Link>
    </>
  );
};

export default Index;
