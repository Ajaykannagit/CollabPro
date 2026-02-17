// Demo-only: in-memory mock backend that mimics Supabase client APIs.
// This intentionally makes ZERO network calls and requires NO env vars.

import { createDemoBackend } from './demoBackend';

type OrderOptions = { ascending?: boolean };

type ExecResult<T> = { data: T; error: null; count?: number | null } | { data: null; error: { message: string }; count?: number | null };

const backend = createDemoBackend();

function ok<T>(data: T, extra?: { count?: number | null }): ExecResult<T> {
  return { data, error: null, count: extra?.count ?? null };
}

function err(message: string): ExecResult<any> {
  return { data: null, error: { message } };
}

type Filter =
  | { op: 'eq'; col: string; val: any }
  | { op: 'in'; col: string; val: any[] }
  | { op: 'ilike'; col: string; val: string }
  | { op: 'gte'; col: string; val: any };

type Mutation =
  | { type: 'none' }
  | { type: 'insert'; rows: any[] }
  | { type: 'update'; updates: any }
  | { type: 'upsert'; row: any; onConflict?: string }
  | { type: 'delete' };

class QueryBuilder {
  private table: keyof typeof backend.tables;
  private filters: Filter[] = [];
  private orderBy: { col: string; ascending: boolean } | null = null;
  private limitN: number | null = null;
  private wantSingle: 'none' | 'single' | 'maybeSingle' = 'none';
  private mutation: Mutation = { type: 'none' };
  private selectOptions: { count?: 'exact' | null } = {};

  constructor(table: keyof typeof backend.tables) {
    this.table = table;
  }

  select(_columns?: any, options?: { count?: 'exact' | null }) {
    this.selectOptions = options ?? {};
    return this;
  }

  insert(rows: any[] | any) {
    const normalized = Array.isArray(rows) ? rows : [rows];
    this.mutation = { type: 'insert', rows: normalized };
    return this;
  }

  update(updates: any) {
    this.mutation = { type: 'update', updates };
    return this;
  }

  upsert(row: any, opts?: { onConflict?: string }) {
    this.mutation = { type: 'upsert', row, onConflict: opts?.onConflict };
    return this;
  }

  delete() {
    this.mutation = { type: 'delete' };
    return this;
  }

  eq(col: string, val: any) {
    this.filters.push({ op: 'eq', col, val });
    return this;
  }

  in(col: string, val: any[]) {
    this.filters.push({ op: 'in', col, val });
    return this;
  }

  ilike(col: string, val: string) {
    this.filters.push({ op: 'ilike', col, val });
    return this;
  }

  gte(col: string, val: any) {
    this.filters.push({ op: 'gte', col, val });
    return this;
  }

  order(col: string, opts?: OrderOptions) {
    this.orderBy = { col, ascending: opts?.ascending !== false };
    return this;
  }

  limit(n: number) {
    this.limitN = n;
    return this;
  }

  single() {
    this.wantSingle = 'single';
    return this;
  }

  maybeSingle() {
    this.wantSingle = 'maybeSingle';
    return this;
  }

  private applyFilters(rows: any[]) {
    return rows.filter((r) => {
      return this.filters.every((f) => {
        const v = (r as any)[f.col];
        if (f.op === 'eq') return v === f.val;
        if (f.op === 'in') return f.val.includes(v);
        if (f.op === 'ilike') return backend.ilike(v, f.val);
        if (f.op === 'gte') return backend.toNumber(v) >= backend.toNumber(f.val);
        return true;
      });
    });
  }

  private applyOrder(rows: any[]) {
    if (!this.orderBy) return rows;
    const { col, ascending } = this.orderBy;
    return backend.stableSort(rows, (a: any, b: any) => {
      const av = a?.[col];
      const bv = b?.[col];
      if (av == null && bv == null) return 0;
      if (av == null) return ascending ? 1 : -1;
      if (bv == null) return ascending ? -1 : 1;
      if (typeof av === 'number' && typeof bv === 'number') return ascending ? av - bv : bv - av;
      return ascending ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }

  private applyLimit(rows: any[]) {
    if (this.limitN == null) return rows;
    return rows.slice(0, this.limitN);
  }

  private withRelations(rows: any[]) {
    return rows.map((r) => backend.attach(this.table as any, r));
  }

  private async executeSelect(): Promise<ExecResult<any>> {
    const base = backend.getTable(this.table as any);
    const filtered = this.applyLimit(this.applyOrder(this.applyFilters(base)));
    const rows = this.withRelations(filtered);
    const count = this.selectOptions.count === 'exact' ? this.applyFilters(base).length : null;

    if (this.wantSingle === 'single') {
      if (rows.length !== 1) return err('Expected single row');
      return ok(rows[0], { count });
    }
    if (this.wantSingle === 'maybeSingle') {
      if (rows.length === 0) return ok(null, { count });
      if (rows.length !== 1) return err('Expected at most one row');
      return ok(rows[0], { count });
    }
    return ok(rows, { count });
  }

  private async executeInsert(): Promise<ExecResult<any>> {
    const base = backend.getTable(this.table as any);
    const inserted = this.mutation.type === 'insert' ? this.mutation.rows : [];
    const created = inserted.map((r) => {
      const row = { ...r };
      if (row.id == null) row.id = backend.newId(this.table as any);
      if (row.created_at == null) row.created_at = new Date().toISOString();
      if (row.updated_at == null && (this.table === 'agreements' || this.table === 'active_projects' || this.table === 'student_profiles')) {
        row.updated_at = new Date().toISOString();
      }
      return row;
    });
    backend.setTable(this.table as any, [...base, ...created]);
    const out = this.withRelations(created);
    if (this.wantSingle === 'single') return out.length ? ok(out[0]) : err('Insert failed');
    return ok(out);
  }

  private async executeUpdate(): Promise<ExecResult<any>> {
    if (this.mutation.type !== 'update') return err('Invalid update');
    const updates = this.mutation.updates;
    const base = backend.getTable(this.table as any);
    const matches = this.applyFilters(base);
    const updatedRows = base.map((r) => {
      if (!matches.includes(r)) return r;
      const next = { ...r, ...updates };
      if ('updated_at' in r || this.table === 'agreements' || this.table === 'active_projects' || this.table === 'student_profiles' || this.table === 'agreement_checklist_items') {
        if (next.updated_at == null) next.updated_at = new Date().toISOString();
      }
      return next;
    });
    backend.setTable(this.table as any, updatedRows);
    const out = this.withRelations(this.applyFilters(updatedRows));
    if (this.wantSingle === 'single') return out.length ? ok(out[0]) : err('No row updated');
    return ok(out);
  }

  private async executeUpsert(): Promise<ExecResult<any>> {
    if (this.mutation.type !== 'upsert') return err('Invalid upsert');
    const base = backend.getTable(this.table as any);
    const row = { ...this.mutation.row };
    const onConflict = this.mutation.onConflict?.split(',').map((s) => s.trim()).filter(Boolean) ?? [];

    let idx = -1;
    if (onConflict.length) {
      idx = base.findIndex((r: any) => onConflict.every((k) => r?.[k] === row?.[k]));
    } else if (row.id != null) {
      idx = base.findIndex((r: any) => r?.id === row.id);
    }

    if (idx >= 0) {
      const next = { ...base[idx], ...row, updated_at: new Date().toISOString() };
      const updated = [...base];
      updated[idx] = next;
      backend.setTable(this.table as any, updated);
      const out = this.withRelations([next]);
      return ok(out);
    }

    if (row.id == null) row.id = backend.newId(this.table as any);
    if (row.created_at == null) row.created_at = new Date().toISOString();
    backend.setTable(this.table as any, [...base, row]);
    return ok(this.withRelations([row]));
  }

  private async executeDelete(): Promise<ExecResult<any>> {
    const base = backend.getTable(this.table as any);
    const remaining = base.filter((r) => !this.applyFilters([r]).length);
    backend.setTable(this.table as any, remaining);
    return ok([]);
  }

  async execute(): Promise<ExecResult<any>> {
    await backend.delay(140);
    try {
      if (this.mutation.type === 'none') return await this.executeSelect();
      if (this.mutation.type === 'insert') return await this.executeInsert();
      if (this.mutation.type === 'update') return await this.executeUpdate();
      if (this.mutation.type === 'upsert') return await this.executeUpsert();
      if (this.mutation.type === 'delete') return await this.executeDelete();
      return err('Unsupported operation');
    } catch (e: any) {
      return err(e?.message ?? 'Unknown error');
    }
  }

  // Make builder awaitable like supabase-js
  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

const storage = {
  from(bucket: string) {
    return {
      async upload(path: string, file: File) {
        await backend.delay(120);
        backend.files.set(`${bucket}:${path}`, file.slice(0, file.size, file.type));
        return ok({ path });
      },
      async download(path: string) {
        await backend.delay(120);
        const blob = backend.files.get(`${bucket}:${path}`) ?? new Blob([''], { type: 'application/octet-stream' });
        return ok(blob);
      },
    };
  },
};

export const supabase: any = {
  from(table: string) {
    return new QueryBuilder(table as any);
  },
  storage,
};

