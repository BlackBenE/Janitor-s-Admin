import { useState, useEffect, useCallback } from "react";
import {
  dataProvider,
  GetListParams,
  GetListResult,
} from "../providers/dataProvider";
import { Database } from "../types/database.types";

type ValidTableName = keyof Database["public"]["Tables"];

// List hook (Admiral-style)
export function useList<
  T extends Record<string, unknown> = Record<string, unknown>
>(resource: ValidTableName, params?: GetListParams) {
  const [data, setData] = useState<GetListResult<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(
    async (newParams?: GetListParams) => {
      try {
        setLoading(true);
        setError(null);
        const result = await dataProvider.getList<T>(
          resource,
          newParams || params || {}
        );
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [resource, params]
  );

  const paramsString = JSON.stringify(params);

  useEffect(() => {
    refetch();
  }, [refetch, resource, paramsString]);

  return {
    data: data?.items || [],
    meta: data?.meta,
    loading,
    error,
    refetch,
  };
}

// Get one hook (Admiral-style)
export function useGetOne<
  T extends Record<string, unknown> = Record<string, unknown>
>(resource: ValidTableName, id: string) {
  const [data, setData] = useState<T | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dataProvider.getOne<T>(resource, { id });
      setData(result.data);
      setValues(result.values || {});
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [resource, id]);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [refetch, resource, id]);

  return {
    data,
    values,
    loading,
    error,
    refetch,
  };
}

// Create hook (Admiral-style)
export function useCreate<
  T extends Record<string, unknown> = Record<string, unknown>
>(resource: ValidTableName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createResource = useCallback(
    async (data: Record<string, unknown>): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await dataProvider.create<T>(resource, { data });
        return result.data;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [resource]
  );

  return {
    createResource,
    loading,
    error,
  };
}

// Update hook (Admiral-style)
export function useUpdate<
  T extends Record<string, unknown> = Record<string, unknown>
>(resource: ValidTableName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateResource = useCallback(
    async (id: string, data: Record<string, unknown>): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await dataProvider.update<T>(resource, { id, data });
        return result.data;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [resource]
  );

  return {
    updateResource,
    loading,
    error,
  };
}

// Delete hook (Admiral-style)
export function useDelete<
  T extends Record<string, unknown> = Record<string, unknown>
>(resource: ValidTableName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteOne = async (id: string): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await dataProvider.deleteOne<T>(resource, { id });
      return result.data;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteOne,
    loading,
    error,
  };
}

// Form data hook (Admiral-style)
export function useFormData<
  T extends Record<string, unknown> = Record<string, unknown>
>(resource: ValidTableName, id?: string) {
  const [data, setData] = useState<T | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFormData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      if (id) {
        result = await dataProvider.getUpdateFormData<T>(resource, { id });
      } else {
        result = await dataProvider.getCreateFormData<T>(resource);
      }

      setData(result.data || null);
      setValues(result.values || {});
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [resource, id]);

  useEffect(() => {
    fetchFormData();
  }, [fetchFormData, resource, id]);

  return {
    data,
    values,
    loading,
    error,
    refetch: fetchFormData,
  };
}
