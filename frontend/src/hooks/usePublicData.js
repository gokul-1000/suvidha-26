import { useEffect, useState, useCallback } from "react";
import { publicAPI } from "../components/services/api";

export const usePublicData = (department) => {
  const [schemes, setSchemes] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [schemesData, advisoriesData] = await Promise.all([
        publicAPI.getSchemes(department),
        publicAPI.getAdvisories(department),
      ]);
      setSchemes(
        Array.isArray(schemesData) ? schemesData : schemesData?.schemes || [],
      );
      setAdvisories(
        Array.isArray(advisoriesData)
          ? advisoriesData
          : advisoriesData?.advisories || advisoriesData || [],
      );
    } catch (err) {
      setError(err?.message || "Failed to load public data");
    } finally {
      setLoading(false);
    }
  }, [department]);

  useEffect(() => {
    load();
  }, [load]);

  return { schemes, advisories, loading, error, refresh: load };
};

export default usePublicData;
