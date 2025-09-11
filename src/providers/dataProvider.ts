import { supabase } from "../lib/supabase";
import { Database } from "../types/database.types";

// Admiral-style interfaces
export interface GetListParams {
  pagination?: { page: number; perPage: number };
  sort?: { field: string; order: "ASC" | "DESC" };
  filter?: Record<string, unknown>;
}

export interface GetListResult<T = Record<string, unknown>> {
  items: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface GetOneParams {
  id: string;
}

export interface GetOneResult<T = Record<string, unknown>> {
  data: T;
  values?: Record<string, unknown>;
}

export interface CreateParams {
  data: Record<string, unknown>;
}

export interface CreateResult<T = Record<string, unknown>> {
  data: T;
}

export interface UpdateParams {
  id: string;
  data: Record<string, unknown>;
}

export interface UpdateResult<T = Record<string, unknown>> {
  data: T;
}

export interface DeleteParams {
  id: string;
}

export interface DeleteResult<T = Record<string, unknown>> {
  data: T;
}

export interface GetFormDataResult<T = Record<string, unknown>> {
  data?: T;
  values: Record<string, unknown>;
}

export interface GetFiltersFormDataResult {
  filters: Record<string, unknown>;
}

// Valid table names from your schema
type ValidTableName = keyof Database["public"]["Tables"];

// Main DataProvider interface (Admiral-style)
export interface DataProvider {
  getList: <T = Record<string, unknown>>(
    resource: ValidTableName,
    params: GetListParams
  ) => Promise<GetListResult<T>>;

  getOne: <T = Record<string, unknown>>(
    resource: ValidTableName,
    params: GetOneParams
  ) => Promise<GetOneResult<T>>;

  getCreateFormData: <T = Record<string, unknown>>(
    resource: ValidTableName
  ) => Promise<GetFormDataResult<T>>;

  getUpdateFormData: <T = Record<string, unknown>>(
    resource: ValidTableName,
    params: GetOneParams
  ) => Promise<GetFormDataResult<T>>;

  getFiltersFormData: (
    resource: ValidTableName
  ) => Promise<GetFiltersFormDataResult>;

  create: <T = Record<string, unknown>>(
    resource: ValidTableName,
    params: CreateParams
  ) => Promise<CreateResult<T>>;

  update: <T = Record<string, unknown>>(
    resource: ValidTableName,
    params: UpdateParams
  ) => Promise<UpdateResult<T>>;

  deleteOne: <T = Record<string, unknown>>(
    resource: ValidTableName,
    params: DeleteParams
  ) => Promise<DeleteResult<T>>;
}

// Supabase DataProvider implementation
class SupabaseDataProvider implements DataProvider {
  async getList<T = Record<string, unknown>>(
    resource: ValidTableName,
    params: GetListParams
  ): Promise<GetListResult<T>> {
    const { pagination = { page: 1, perPage: 10 }, sort, filter = {} } = params;

    let query = supabase.from(resource).select("*", { count: "exact" });

    // Apply filters
    Object.entries(filter).forEach(([field, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "string") {
          query = query.ilike(field, `%${value}%`);
        } else {
          query = query.eq(field, value);
        }
      }
    });

    // Apply sorting
    if (sort) {
      query = query.order(sort.field, { ascending: sort.order === "ASC" });
    }

    // Apply pagination
    const from = (pagination.page - 1) * pagination.perPage;
    const to = from + pagination.perPage - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / pagination.perPage);

    return {
      items: data as T[],
      meta: {
        current_page: pagination.page,
        from: from + 1,
        last_page: totalPages,
        per_page: pagination.perPage,
        to: Math.min(to + 1, total),
        total,
      },
    };
  }

  async getOne<T = Record<string, unknown>>(
    resource: ValidTableName,
    params: GetOneParams
  ): Promise<GetOneResult<T>> {
    const { data, error } = await supabase
      .from(resource)
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) throw error;

    return {
      data: data as T,
      values: await this.getRelatedData(resource),
    };
  }

  async getCreateFormData<T = Record<string, unknown>>(
    resource: ValidTableName
  ): Promise<GetFormDataResult<T>> {
    return {
      values: await this.getRelatedData(resource),
    };
  }

  async getUpdateFormData<T = Record<string, unknown>>(
    resource: ValidTableName,
    params: GetOneParams
  ): Promise<GetFormDataResult<T>> {
    const { data, error } = await supabase
      .from(resource)
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) throw error;

    return {
      data: data as T,
      values: await this.getRelatedData(resource),
    };
  }

  async getFiltersFormData(
    resource: ValidTableName
  ): Promise<GetFiltersFormDataResult> {
    return {
      filters: await this.getRelatedData(resource),
    };
  }

  async create<T = Record<string, unknown>>(
    resource: ValidTableName,
    params: CreateParams
  ): Promise<CreateResult<T>> {
    const { data, error } = await supabase
      .from(resource)
      .insert(params.data as never)
      .select()
      .single();

    if (error) throw error;

    return { data: data as T };
  }

  async update<T = Record<string, unknown>>(
    resource: ValidTableName,
    params: UpdateParams
  ): Promise<UpdateResult<T>> {
    const { data, error } = await supabase
      .from(resource)
      .update(params.data as never)
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return { data: data as T };
  }

  async deleteOne<T = Record<string, unknown>>(
    resource: ValidTableName,
    params: DeleteParams
  ): Promise<DeleteResult<T>> {
    const { data, error } = await supabase
      .from(resource)
      .delete()
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return { data: data as T };
  }

  // Helper method to get related data for selects
  private async getRelatedData(
    resource: ValidTableName
  ): Promise<Record<string, unknown>> {
    const relatedData: Record<string, unknown> = {};

    // Define relationships based on your schema
    const relationships: Record<string, string[]> = {
      properties: ["profiles:owner_id", "profiles:validated_by"],
      bookings: ["profiles:traveler_id", "properties:property_id"],
      service_requests: [
        "profiles:requester_id",
        "properties:property_id",
        "services:service_id",
      ],
      services: ["profiles:provider_id"],
      payments: ["profiles:payer_id", "profiles:payee_id"],
      interventions: [
        "profiles:provider_id",
        "service_requests:service_request_id",
      ],
      reviews: ["profiles:reviewer_id", "profiles:reviewee_id"],
      notifications: ["profiles:user_id"],
      subscriptions: ["profiles:user_id"],
    };

    if (relationships[resource]) {
      for (const relation of relationships[resource]) {
        const [table, field] = relation.split(":");
        try {
          const { data } = await supabase
            .from(table as ValidTableName)
            .select("id, email, full_name, title, name")
            .limit(100);

          if (data) {
            relatedData[field] = data.map((item) => {
              const itemData = item as unknown as Record<string, unknown>;
              return {
                label:
                  itemData.email ||
                  itemData.full_name ||
                  itemData.title ||
                  itemData.name ||
                  `ID: ${itemData.id}`,
                value: itemData.id,
              };
            });
          }
        } catch (error) {
          console.warn(`Failed to load related data for ${table}:`, error);
        }
      }
    }

    return relatedData;
  }
}

// Export singleton instance
export const dataProvider = new SupabaseDataProvider();
