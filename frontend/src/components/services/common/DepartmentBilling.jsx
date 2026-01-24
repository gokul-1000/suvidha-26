import { useEffect, useMemo, useState } from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import { billsAPI } from "../../services/api";
import { formatCurrency, formatDate } from "../../../utils/helpers";

const DepartmentBilling = ({ department, title }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await billsAPI.list();
        const filtered = Array.isArray(data)
          ? data.filter((b) => b?.serviceAccount?.department === department)
          : [];
        setBills(filtered);
      } catch (err) {
        setError(err?.message || "Failed to load bills");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [department]);

  const unpaidCount = useMemo(
    () => bills.filter((b) => !b.isPaid).length,
    [bills],
  );

  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{title} Bills</h1>
          <p className="text-gray-600">
            {unpaidCount} unpaid bill{unpaidCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          {loading ? (
            <p>Loading bills...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : bills.length ? (
            <div className="space-y-3">
              {bills.map((bill) => (
                <div
                  key={bill.id}
                  className="border rounded-lg p-4 flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-800">
                      {bill.serviceAccount?.consumerId || "Consumer"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Address: {bill.serviceAccount?.address || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Due: {formatDate(bill.dueDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {formatCurrency(bill.amount)}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                        bill.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {bill.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No bills found.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DepartmentBilling;
