import { Router, Request, Response } from 'express';
import { bulkEngine } from '../services/bulkEngine';

export const bulkRouter = Router();

/**
 * POST /api/bulk/import/validate
 * Phase 1: Pre-validate CSV upload
 */
bulkRouter.post('/import/validate', (req: Request, res: Response) => {
  try {
    const { rows } = req.body;
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Rows array is required.' });
    }

    const validationResult = bulkEngine.validateProductCSV(rows);
    return res.status(200).json({ success: true, data: validationResult });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/bulk/import/apply
 * Phase 2: Atomic commit of validated CSV rows
 */
bulkRouter.post('/import/apply', (req: Request, res: Response) => {
  try {
    const { validRows, actor } = req.body;
    if (!Array.isArray(validRows) || validRows.length === 0) {
      return res.status(400).json({ success: false, error: 'Valid rows array required for commit.' });
    }

    const result = bulkEngine.commitProductCSV(validRows, actor);
    return res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/bulk/export/:entity
 * Stream CSV export
 */
bulkRouter.get('/export/:entity', (req: Request, res: Response) => {
  try {
    const entity = req.params.entity.toLowerCase();
    let csvData = '';
    let filename = `sejal_${entity}_export_${Date.now()}.csv`;

    switch (entity) {
      case 'products':
        csvData = bulkEngine.exportProductsCSV();
        break;
      case 'orders':
        csvData = bulkEngine.exportOrdersCSV();
        break;
      case 'inventory':
        csvData = bulkEngine.exportInventoryCSV();
        break;
      case 'payments':
        csvData = bulkEngine.exportPaymentsCSV();
        break;
      default:
        return res.status(400).json({ success: false, error: `Export not supported for entity "${entity}".` });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvData);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/bulk/edit
 * Batch price, stock, or category update
 */
bulkRouter.post('/edit', (req: Request, res: Response) => {
  try {
    const { productIds, priceAdjustmentMultiplier, category, availability, isSignature, actor } = req.body;
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ success: false, error: 'productIds array is required.' });
    }

    const count = bulkEngine.bulkUpdateProducts({
      productIds,
      priceAdjustmentMultiplier,
      category,
      availability,
      isSignature,
      actor,
    });

    return res.status(200).json({ success: true, updatedCount: count });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});
