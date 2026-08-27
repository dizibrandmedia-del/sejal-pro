import { Router, Request, Response } from 'express';
import { inventoryEngine } from '../services/inventoryEngine';
import { store } from '../db/store';

export const inventoryRouter = Router();

/**
 * GET /api/inventory
 * Get all inventory items with low-stock flags
 */
inventoryRouter.get('/', (req: Request, res: Response) => {
  try {
    const items = inventoryEngine.getAllInventory();
    return res.status(200).json({ success: true, data: items, count: items.length });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/inventory/:sku
 * Check live availability for a SKU
 */
inventoryRouter.get('/:sku', (req: Request, res: Response) => {
  try {
    const availability = inventoryEngine.getAvailability(req.params.sku);
    return res.status(200).json({ success: true, data: availability });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PATCH /api/inventory/adjust
 * Manual stock adjustment
 */
inventoryRouter.patch('/adjust', async (req: Request, res: Response) => {
  try {
    const { sku, quantity, adjustmentType, reason, actor } = req.body;
    if (!sku || quantity === undefined) {
      return res.status(400).json({ success: false, error: 'Missing sku or quantity.' });
    }

    const item = store.inventory.get(sku);
    if (!item) {
      return res.status(404).json({ success: false, error: `SKU ${sku} not found.` });
    }

    if (adjustmentType === 'set') {
      item.totalQuantity = quantity;
      item.availableQuantity = Math.max(0, quantity - item.reservedQuantity - item.soldQuantity - item.damagedQuantity);
    } else if (adjustmentType === 'add') {
      item.totalQuantity += quantity;
      item.availableQuantity += quantity;
    } else if (adjustmentType === 'subtract') {
      item.totalQuantity = Math.max(0, item.totalQuantity - quantity);
      item.availableQuantity = Math.max(0, item.availableQuantity - quantity);
    }

    item.isLowStock = item.availableQuantity <= item.lowStockThreshold;
    item.isOutOfStock = item.availableQuantity <= 0;
    item.updatedAt = new Date().toISOString();

    store.inventory.set(sku, item);

    return res.status(200).json({ success: true, data: item });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});
