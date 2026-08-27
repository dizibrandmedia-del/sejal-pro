import { store } from '../db/store';
import { BulkValidationResult, BulkValidationRowError } from '../../src/types/admin';
import { catalogueEngine } from './catalogueEngine';
import { auditLogEngine } from './auditLogEngine';

export class BulkEngine {
  /**
   * PHASE 1: VALIDATE CSV IMPORT ROWS
   * Never blindly import. Validates before applying changes.
   */
  public validateProductCSV(rows: any[]): BulkValidationResult {
    const errors: BulkValidationRowError[] = [];
    const warnings: string[] = [];
    const previewData: any[] = [];
    const seenSkus = new Set<string>();

    const existingSkus = new Set(Array.from(store.products.values()).map((p) => p.sku));

    rows.forEach((row, idx) => {
      const rowNumber = idx + 1;
      const sku = row.sku?.toString().trim();
      const name = row.name?.toString().trim();
      const price = Number(row.basePriceINR || row.price);
      const stock = Number(row.stock || row.quantity || 0);
      const category = row.category?.toString().trim();

      if (!sku) {
        errors.push({ rowNumber, field: 'sku', message: 'Missing mandatory SKU identifier.' });
      } else if (seenSkus.has(sku)) {
        errors.push({ rowNumber, sku, field: 'sku', message: `Duplicate SKU "${sku}" found within import file.` });
      } else {
        seenSkus.add(sku);
      }

      if (!name) {
        errors.push({ rowNumber, sku, field: 'name', message: 'Missing product name.' });
      }

      if (isNaN(price) || price <= 0) {
        errors.push({ rowNumber, sku, field: 'basePriceINR', message: `Invalid price "${row.basePriceINR}". Must be positive number.` });
      }

      if (isNaN(stock) || stock < 0) {
        errors.push({ rowNumber, sku, field: 'stock', message: `Invalid stock quantity "${row.stock}".` });
      }

      if (sku && existingSkus.has(sku)) {
        warnings.push(`Row ${rowNumber}: SKU "${sku}" already exists in catalogue. Will update existing record.`);
      }

      previewData.push({
        rowNumber,
        sku,
        name,
        basePriceINR: price,
        stock,
        category: category || 'high-jewellery',
        status: errors.some((e) => e.rowNumber === rowNumber) ? 'Invalid' : 'Valid',
      });
    });

    const validRows = previewData.filter((p) => p.status === 'Valid').length;
    const invalidRows = new Set(errors.map((e) => e.rowNumber)).size;

    return {
      totalRows: rows.length,
      validRows,
      invalidRows,
      errors,
      warnings,
      previewData,
      canImport: errors.length === 0 && rows.length > 0,
    };
  }

  /**
   * PHASE 2: ATOMIC CSV COMMIT
   */
  public commitProductCSV(validRows: any[], actor: string = 'Product Manager'): { importedCount: number; updatedCount: number } {
    let importedCount = 0;
    let updatedCount = 0;

    validRows.forEach((row) => {
      const existing = Array.from(store.products.values()).find((p) => p.sku === row.sku);
      if (existing) {
        catalogueEngine.updateProduct(existing.id, {
          name: row.name,
          basePriceINR: row.basePriceINR,
          stock: row.stock,
          category: row.category,
        }, actor);
        updatedCount++;
      } else {
        catalogueEngine.createProduct({
          sku: row.sku,
          name: row.name,
          basePriceINR: row.basePriceINR,
          stock: row.stock,
          category: row.category || 'high-jewellery',
          brand: row.brand || 'SEJAL Signature',
          shortDescription: row.shortDescription || `${row.name} - Masterpiece creation.`,
        }, actor);
        importedCount++;
      }
    });

    auditLogEngine.logAudit({
      entityType: 'Product',
      entityId: 'bulk_csv_import',
      referenceCode: 'CSV_IMPORT',
      action: 'BULK_IMPORT_COMPLETED',
      actor,
      reason: `Successfully imported ${importedCount} new creations and updated ${updatedCount} existing records.`,
    });

    return { importedCount, updatedCount };
  }

  /**
   * CSV EXPORTERS
   */
  public exportProductsCSV(): string {
    const products = Array.from(store.products.values());
    const header = 'ID,SKU,Name,Brand,Category,BasePriceINR,Stock,Availability,IsSignature,CreatedAt\n';
    const rows = products.map((p) =>
      `"${p.id}","${p.sku}","${p.name.replace(/"/g, '""')}","${p.brand}","${p.category}",${p.basePriceINR},${p.stock},"${p.availability}",${p.isSignature || false},"${p.createdAt}"`
    );
    return header + rows.join('\n');
  }

  public exportOrdersCSV(): string {
    const orders = Array.from(store.orders.values());
    const header = 'OrderNumber,Date,CustomerName,Email,TotalINR,OrderStatus,PaymentStatus,TrackingNumber\n';
    const rows = orders.map((o) =>
      `"${o.orderNumber}","${o.createdAt}","${o.customerName}","${o.customerEmail}",${o.totalINR},"${o.orderStatus}","${o.paymentStatus}","${o.trackingNumber || ''}"`
    );
    return header + rows.join('\n');
  }

  public exportInventoryCSV(): string {
    const inv = Array.from(store.inventory.values());
    const header = 'SKU,ProductName,Variant,Available,Reserved,Sold,Damaged,Total,IsLowStock\n';
    const rows = inv.map((i) =>
      `"${i.sku}","${i.productName.replace(/"/g, '""')}","${i.variantTitle}",${i.availableQuantity},${i.reservedQuantity},${i.soldQuantity},${i.damagedQuantity},${i.totalQuantity},${i.isLowStock}`
    );
    return header + rows.join('\n');
  }

  public exportPaymentsCSV(): string {
    const payments = Array.from(store.payments.values());
    const header = 'PaymentID,OrderNumber,AmountINR,Currency,Method,Status,SignatureVerified,CapturedAt\n';
    const rows = payments.map((p) =>
      `"${p.id}","${p.orderNumber}",${p.amountINR},"${p.currency}","${p.method}","${p.status}",${p.isSignatureVerified},"${p.capturedAt || ''}"`
    );
    return header + rows.join('\n');
  }

  /**
   * BULK BATCH EDITOR
   */
  public bulkUpdateProducts(params: {
    productIds: string[];
    priceAdjustmentMultiplier?: number;   // e.g. 1.10 for +10% price increase
    category?: string;
    availability?: any;
    isSignature?: boolean;
    actor?: string;
  }): number {
    let updated = 0;
    const actor = params.actor || 'Product Manager';

    params.productIds.forEach((id) => {
      const product = store.products.get(id);
      if (product) {
        const updates: Partial<any> = {};
        if (params.priceAdjustmentMultiplier) {
          updates.basePriceINR = Math.round(product.basePriceINR * params.priceAdjustmentMultiplier);
        }
        if (params.category) updates.category = params.category;
        if (params.availability) updates.availability = params.availability;
        if (params.isSignature !== undefined) updates.isSignature = params.isSignature;

        catalogueEngine.updateProduct(product.id, updates, actor);
        updated++;
      }
    });

    return updated;
  }
}

export const bulkEngine = new BulkEngine();
