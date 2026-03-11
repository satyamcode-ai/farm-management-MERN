// src/hooks/useFetchData.js

import { useState, useEffect, useCallback } from 'react';

const useFetchData = (fetchFunction, initialData = []) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useCallback memorizes the function to prevent unnecessary re-runs
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchFunction();
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [fetchFunction]); // Recreate if fetchFunction changes (rarely)

    // Run once on mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // refreshData allows manual data reloading (e.g., after a POST request)
    return { data, loading, error, refreshData: fetchData };
};

export default useFetchData;