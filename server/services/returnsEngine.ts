import { store } from '../db/store';
import {
  ReturnRequest,
  ReturnItem,
  SubmitReturnRequestPayload,
  ExecuteQualityCheckPayload,
} from '../../src/types/returns';
import { auditLogEngine } from './auditLogEngine';
import { inventoryEngine } from './inventoryEngine';
import { refundEngine } from './refundEngine';

export class ReturnsEngine {
  /**
   * SUBMIT ITEM-LEVEL RETURN REQUEST
   */
  public async submitReturnRequest(payload: SubmitReturnRequestPayload): Promise<ReturnRequest> {
    const order = store.orders.get(payload.orderId);
    if (!order) {
      throw new Error(`Order ${payload.orderId} does not exist.`);
    }

    if (order.orderStatus !== 'Delivered') {
      throw new Error(`Returns are only permitted for delivered creations. Current status: ${order.orderStatus}`);
    }

    const returnId = `ret_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const returnItems: ReturnItem[] = [];
    let totalRefundRequestedINR = 0;

    for (const reqItem of payload.items) {
      const orderItem = order.items.find((i) => i.id === reqItem.orderItemId);
      if (!orderItem) {
        throw new Error(`Order item ${reqItem.orderItemId} does not exist in order ${order.orderNumber}.`);
      }

      if (orderItem.isReturned) {
        throw new Error(`Item ${orderItem.productName} has already been returned.`);
      }

      const itemRefundAmount = (orderItem.priceINR / orderItem.quantity) * reqItem.quantity;
      totalRefundRequestedINR += itemRefundAmount;

      returnItems.push({
        id: `ret_item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        orderItemId: orderItem.id,
        productId: orderItem.productId,
        productName: orderItem.productName,
        variantId: orderItem.variantId,
        variantTitle: orderItem.selectedOptionsText,
        sku: orderItem.sku,
        quantity: reqItem.quantity,
        itemPriceINR: orderItem.priceINR,
        refundEligibleAmountINR: itemRefundAmount,
        reason: reqItem.reason,
        customReasonDetail: reqItem.customReasonDetail,
        photos: reqItem.photos || [],
      });

      // Mark order item returned flag
      orderItem.isReturned = true;
      orderItem.returnId = returnId;
    }

    const returnRequest: ReturnRequest = {
      id: returnId,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      items: returnItems,
      totalRefundRequestedINR,
      status: 'Requested',
      statusHistory: [
        {
          status: 'Requested',
          timestamp: new Date().toISOString(),
          actor: 'customer',
          note: `Return request initiated for ${returnItems.length} items.`,
        },
      ],
      pickupAddress: {
        recipientName: order.shippingAddress.recipientName,
        phoneNumber: order.shippingAddress.phoneNumber,
        addressLine1: order.shippingAddress.addressLine1,
        addressLine2: order.shippingAddress.addressLine2,
        city: order.shippingAddress.city,
        stateProvince: order.shippingAddress.stateProvince,
        postalCode: order.shippingAddress.postalCode,
        country: order.shippingAddress.country,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.returns.set(returnRequest.id, returnRequest);

    // Link return ID to order
    order.returnIds.push(returnRequest.id);
    order.orderStatus = 'Returned';
    order.updatedAt = new Date().toISOString();
    store.orders.set(order.id, order);

    auditLogEngine.logAudit({
      entityType: 'Return',
      entityId: returnRequest.id,
      referenceCode: order.orderNumber,
      action: 'RETURN_REQUESTED',
      newState: 'Requested',
      actor: order.customerEmail,
      reason: `Return requested for ₹${totalRefundRequestedINR} across ${returnItems.length} items`,
    });

    auditLogEngine.emitCommerceEvent(
      'return.requested',
      'return',
      returnRequest.id,
      { orderNumber: order.orderNumber, totalRefundRequestedINR, itemsCount: returnItems.length },
      'customer',
      order.orderNumber
    );

    return returnRequest;
  }

  /**
   * EXECUTE QUALITY CHECK INSPECTION & STOCK DISPOSITION
   */
  public async executeQualityCheck(payload: ExecuteQualityCheckPayload): Promise<ReturnRequest> {
    const returnReq = store.returns.get(payload.returnId);
    if (!returnReq) {
      throw new Error(`Return request ${payload.returnId} not found.`);
    }

    const order = store.orders.get(returnReq.orderId);
    if (!order) {
      throw new Error(`Linked order ${returnReq.orderId} not found.`);
    }

    // Apply Quality Check Result to each item
    for (const item of returnReq.items) {
      item.qualityResult = {
        inspectorName: payload.inspectorName,
        inspectionDate: new Date().toISOString(),
        isPassed: payload.isApproved,
        receivedCondition: payload.receivedCondition,
        securityTagIntact: payload.securityTagIntact,
        certificatePresent: payload.certificatePresent,
        notes: payload.notes,
        disposition: payload.disposition,
        approvedRefundAmountINR: payload.approvedRefundAmountINR,
      };

      // Handle inventory disposition atomically
      await inventoryEngine.handleReturnDisposition(
        item.sku,
        item.quantity,
        payload.disposition,
        returnReq.id,
        order.orderNumber
      );
    }

    returnReq.approvedRefundAmountINR = payload.approvedRefundAmountINR;
    returnReq.status = payload.isApproved ? 'Refund Initiated' : 'Rejected';
    returnReq.statusHistory.push({
      status: returnReq.status,
      timestamp: new Date().toISOString(),
      actor: 'admin_user',
      note: `Quality Check by ${payload.inspectorName}. Condition: ${payload.receivedCondition}, Disposition: ${payload.disposition}`,
    });

    // If approved, trigger partial or full refund through Refund Engine
    if (payload.isApproved && payload.approvedRefundAmountINR > 0) {
      const refund = await refundEngine.initiateRefund({
        orderId: order.id,
        amountINR: payload.approvedRefundAmountINR,
        reason: `Quality-approved return ${returnReq.id}: ${payload.notes}`,
        requestedBy: payload.inspectorName,
        returnId: returnReq.id,
      });

      returnReq.linkedRefundId = refund.id;
      returnReq.status = 'Refund Completed';
      returnReq.statusHistory.push({
        status: 'Refund Completed',
        timestamp: new Date().toISOString(),
        actor: 'system',
        note: `Refund ₹${payload.approvedRefundAmountINR} completed via ${refund.razorpayRefundId}`,
      });
    }

    returnReq.updatedAt = new Date().toISOString();
    returnReq.resolvedAt = new Date().toISOString();
    store.returns.set(returnReq.id, returnReq);

    auditLogEngine.logAudit({
      entityType: 'Return',
      entityId: returnReq.id,
      referenceCode: order.orderNumber,
      action: 'QUALITY_CHECK_EXECUTED',
      newState: returnReq.status,
      actor: payload.inspectorName,
      reason: `Quality inspection verdict: ${payload.disposition}, Approved Refund: ₹${payload.approvedRefundAmountINR}`,
    });

    return returnReq;
  }

  /**
   * Get all returns for an order or customer
   */
  public listReturns(customerEmail?: string): ReturnRequest[] {
    let list = Array.from(store.returns.values());
    if (customerEmail) {
      list = list.filter((r) => r.customerEmail.toLowerCase() === customerEmail.toLowerCase());
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get return request by ID
   */
  public getReturn(returnId: string): ReturnRequest | undefined {
    return store.returns.get(returnId);
  }
}

export const returnsEngine = new ReturnsEngine();
