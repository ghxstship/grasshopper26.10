/**
 * Export Edge Function
 * Handles data exports in CSV, Excel (XLSX), and PDF formats
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type ExportFormat = 'csv' | 'xlsx' | 'pdf';
type ExportType = 'orders' | 'tickets' | 'events' | 'users' | 'analytics' | 'advancing' | 'expenses';

interface ExportRequest {
  type: ExportType;
  format: ExportFormat;
  filters?: Record<string, unknown>;
  columns?: string[];
  startDate?: string;
  endDate?: string;
  userId?: string;
}

/**
 * Convert data to CSV format
 */
function toCSV(data: Record<string, unknown>[], columns?: string[]): string {
  if (data.length === 0) return '';

  const cols = columns || Object.keys(data[0]);
  const header = cols.join(',');
  
  const rows = data.map(row => {
    return cols.map(col => {
      const value = row[col];
      if (value === null || value === undefined) return '';
      const str = String(value);
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',');
  });

  return [header, ...rows].join('\n');
}

/**
 * Convert data to simple Excel format (CSV with .xlsx extension)
 * For production, consider using a proper XLSX library
 */
function toXLSX(data: Record<string, unknown>[], columns?: string[]): Uint8Array {
  const csv = toCSV(data, columns);
  return new TextEncoder().encode(csv);
}

/**
 * Convert data to simple PDF format (text-based)
 * For production, consider using a proper PDF library like jsPDF
 */
function toPDF(data: Record<string, unknown>[], title: string, columns?: string[]): Uint8Array {
  const cols = columns || (data.length > 0 ? Object.keys(data[0]) : []);
  
  let content = `%PDF-1.4\n`;
  content += `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
  content += `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
  content += `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n`;
  content += `4 0 obj\n<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>\nendobj\n`;
  
  let textContent = `BT\n/F1 16 Tf\n50 750 Td\n(${title}) Tj\nET\n`;
  textContent += `BT\n/F1 10 Tf\n50 720 Td\n`;
  
  // Add header
  textContent += `(${cols.join(' | ')}) Tj\n`;
  textContent += `0 -15 Td\n`;
  
  // Add rows (limited to first 40 rows for simple PDF)
  const limitedData = data.slice(0, 40);
  for (const row of limitedData) {
    const rowText = cols.map(col => String(row[col] || '')).join(' | ');
    textContent += `(${rowText.substring(0, 100)}) Tj\n`;
    textContent += `0 -12 Td\n`;
  }
  
  textContent += `ET\n`;
  
  const streamLength = textContent.length;
  content += `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${textContent}\nendstream\nendobj\n`;
  content += `xref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000214 00000 n\n0000000304 00000 n\n`;
  content += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${content.length}\n%%EOF`;
  
  return new TextEncoder().encode(content);
}

/**
 * Fetch data based on export type
 */
async function fetchData(
  supabase: ReturnType<typeof createClient>,
  request: ExportRequest
): Promise<Record<string, unknown>[]> {
  const { type, filters, startDate, endDate, userId } = request;

  let query = supabase.from(type).select('*');

  // Apply filters
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    }
  }

  // Apply date range
  if (startDate) {
    query = query.gte('created_at', startDate);
  }
  if (endDate) {
    query = query.lte('created_at', endDate);
  }

  // Apply user filter if provided
  if (userId) {
    query = query.eq('user_id', userId);
  }

  // Limit to 10000 rows for safety
  query = query.limit(10000);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch data: ${error.message}`);
  }

  return data || [];
}

/**
 * Get appropriate MIME type for format
 */
function getMimeType(format: ExportFormat): string {
  switch (format) {
    case 'csv':
      return 'text/csv';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}


serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const body: ExportRequest = await req.json();
    const { type, format, columns } = body;

    // Validate required fields
    if (!type || !format) {
      return new Response(
        JSON.stringify({ error: 'Type and format are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate format
    if (!['csv', 'xlsx', 'pdf'].includes(format)) {
      return new Response(
        JSON.stringify({ error: 'Invalid format. Must be csv, xlsx, or pdf' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch data
    const data = await fetchData(supabase, body);

    if (data.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No data found for export' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convert to requested format
    let exportData: Uint8Array;
    let filename: string;

    switch (format) {
      case 'csv':
        exportData = new TextEncoder().encode(toCSV(data, columns));
        filename = `${type}_export_${Date.now()}.csv`;
        break;
      case 'xlsx':
        exportData = toXLSX(data, columns);
        filename = `${type}_export_${Date.now()}.xlsx`;
        break;
      case 'pdf':
        exportData = toPDF(data, `${type.toUpperCase()} Export`, columns);
        filename = `${type}_export_${Date.now()}.pdf`;
        break;
      default:
        throw new Error('Unsupported format');
    }

    // Log export
    await supabase.from('export_logs').insert({
      user_id: body.userId,
      export_type: type,
      export_format: format,
      record_count: data.length,
      file_size: exportData.length,
      exported_at: new Date().toISOString(),
    });

    return new Response(exportData, {
      status: 200,
      headers: {
        'Content-Type': getMimeType(format),
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(exportData.length),
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Export failed',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
