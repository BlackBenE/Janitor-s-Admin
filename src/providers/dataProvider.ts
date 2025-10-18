import { supabase, supabaseAdmin } from "../lib/supabaseClient";
import { Database } from "../types";

type TableName = keyof Database["public"]["Tables"];
type RowType<T extends TableName> = Database["public"]["Tables"][T]["Row"];
type InsertType<T extends TableName> =
  Database["public"]["Tables"][T]["Insert"];
type UpdateType<T extends TableName> =
  Database["public"]["Tables"][T]["Update"];

export class DataProviderError<T extends TableName = TableName> extends Error {
  constructor(
    message: string,
    public table: T,
    public operation:
      | "getList"
      | "getOne"
      | "create"
      | "createMany"
      | "update"
      | "delete"
      | "deleteMany",
    public details?: unknown
  ) {
    super(`[${operation.toUpperCase()}] ${message}`);
    this.name = "DataProviderError";
  }
}

export type DataProviderResponse<T> = {
  success: boolean;
  data: T | null;
  error?: DataProviderError;
};

export const dataProvider = {
  async getList<T extends TableName>(
    table: T,
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: keyof RowType<T>;
      includeDeleted?: boolean; // Nouvelle option pour inclure les utilisateurs supprimés
    },
    filters?: Partial<RowType<T>>
  ): Promise<DataProviderResponse<RowType<T>[]>> {
    // Use admin client for admin panel - bypasses RLS
    const client = supabaseAdmin || supabase;

    let query = client.from(table as string).select("*");

    // Pour la table profiles, filtrer les utilisateurs supprimés par défaut
    if (table === "profiles" && !options?.includeDeleted) {
      query = query.is("deleted_at", null);
    }

    if (filters) {
      (
        Object.entries(filters) as [
          keyof RowType<T>,
          RowType<T>[keyof RowType<T>]
        ][]
      ).forEach(([key, value]) => {
        query = query.eq(key as string, value);
      });
    }

    if (options?.orderBy) query = query.order(options.orderBy as string);
    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit ?? 10) - 1
      );

    const { data, error } = await query;

    if (error)
      return {
        success: false,
        data: null,
        error: new DataProviderError(error.message, table, "getList", error),
      };

    return { success: true, data: data ?? [] };
  },

  async getOne<T extends TableName>(
    table: T,
    id: string
  ): Promise<DataProviderResponse<RowType<T>>> {
    const client = supabaseAdmin || supabase;

    const { data, error } = await client
      .from(table as string)
      .select("*")
      .eq("id", id)
      .single();

    if (error)
      return {
        success: false,
        data: null,
        error: new DataProviderError(error.message, table, "getOne", error),
      };

    return { success: true, data: data ?? null };
  },

  async create<T extends TableName>(
    table: T,
    payload: InsertType<T>
  ): Promise<DataProviderResponse<RowType<T>>> {
    const client = supabaseAdmin || supabase;

    const { data, error } = await client
      .from(table as string)
      .insert(payload)
      .select()
      .single();

    if (error)
      return {
        success: false,
        data: null,
        error: new DataProviderError(error.message, table, "create", error),
      };

    return { success: true, data: data ?? null };
  },

  async createMany<T extends TableName>(
    table: T,
    payloads: InsertType<T>[]
  ): Promise<DataProviderResponse<RowType<T>[]>> {
    const client = supabaseAdmin || supabase;

    const { data, error } = await client
      .from(table as string)
      .insert(payloads)
      .select();

    if (error)
      return {
        success: false,
        data: null,
        error: new DataProviderError(error.message, table, "createMany", error),
      };

    return { success: true, data: data ?? [] };
  },

  async update<T extends TableName>(
    table: T,
    id: string,
    payload: UpdateType<T>
  ): Promise<DataProviderResponse<RowType<T>>> {
    const client = supabaseAdmin || supabase;

    const { data, error } = await client
      .from(table as string)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error)
      return {
        success: false,
        data: null,
        error: new DataProviderError(error.message, table, "update", error),
      };

    return { success: true, data: data ?? null };
  },

  async delete<T extends TableName>(
    table: T,
    id: string
  ): Promise<DataProviderResponse<{ id: string }>> {
    const client = supabaseAdmin || supabase;

    const { error } = await client
      .from(table as string)
      .delete()
      .eq("id", id);

    if (error)
      return {
        success: false,
        data: null,
        error: new DataProviderError(error.message, table, "delete", error),
      };

    return { success: true, data: { id } };
  },

  async deleteMany<T extends TableName>(
    table: T,
    ids: string[]
  ): Promise<DataProviderResponse<{ ids: string[] }>> {
    const client = supabaseAdmin || supabase;

    const { error } = await client
      .from(table as string)
      .delete()
      .in("id", ids);

    if (error)
      return {
        success: false,
        data: null,
        error: new DataProviderError(error.message, table, "deleteMany", error),
      };

    return { success: true, data: { ids } };
  },
};
