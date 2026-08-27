/**
 * SEJAL.PRO — Phase 5 Dynamic Segmentation Engine
 * Rule-Based Audience Evaluation (ALL / ANY) with Real-Time Customer Re-evaluation.
 */

import { store } from '../db/store';
import { DynamicSegment, SegmentRule, Customer360Profile } from '../../src/types/crm';
import { auditLogEngine } from './auditLogEngine';

export class SegmentationEngine {
  /**
   * CREATE DYNAMIC SEGMENT
   */
  public createSegment(payload: {
    name: string;
    description: string;
    logic: 'ALL' | 'ANY';
    rules: SegmentRule[];
    actor?: string;
  }): DynamicSegment {
    const id = `seg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const segment: DynamicSegment = {
      id,
      name: payload.name,
      description: payload.description,
      logic: payload.logic,
      rules: payload.rules,
      memberCount: 0,
      isSystemSegment: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastCalculatedAt: new Date().toISOString(),
    };

    store.dynamicSegments.set(id, segment);
    this.evaluateSegment(id);

    auditLogEngine.logAudit({
      entityType: 'Segment',
      entityId: id,
      referenceCode: payload.name,
      action: 'SEGMENT_CREATED',
      actor: payload.actor || 'Marketing Manager',
      reason: `Created dynamic segment with ${payload.rules.length} rules (${payload.logic})`,
    });

    return store.dynamicSegments.get(id)!;
  }

  /**
   * LIST ALL SEGMENTS
   */
  public listSegments(): DynamicSegment[] {
    return Array.from(store.dynamicSegments.values());
  }

  /**
   * GET SEGMENT BY ID
   */
  public getSegment(id: string): DynamicSegment | undefined {
    return store.dynamicSegments.get(id);
  }

  /**
   * EVALUATE SEGMENT AUDIENCE
   * Evaluates all customer profiles against the segment rules.
   */
  public evaluateSegment(segmentId: string): { segment: DynamicSegment; matchingCustomerIds: string[] } {
    const segment = store.dynamicSegments.get(segmentId);
    if (!segment) {
      throw new Error(`Segment ${segmentId} does not exist.`);
    }

    const allCustomers = Array.from(store.crmProfiles.values());
    const matchingCustomerIds: string[] = [];

    for (const customer of allCustomers) {
      const isMatch = this.evaluateCustomerAgainstRules(customer, segment.rules, segment.logic);
      if (isMatch) {
        matchingCustomerIds.push(customer.id);
        matchingCustomerIds.push(customer.email);
        if (!customer.activeSegmentIds.includes(segment.id)) {
          customer.activeSegmentIds.push(segment.id);
        }
      } else {
        customer.activeSegmentIds = customer.activeSegmentIds.filter((id) => id !== segment.id);
      }
      store.crmProfiles.set(customer.id, customer);
    }

    segment.memberCount = matchingCustomerIds.length;
    segment.lastCalculatedAt = new Date().toISOString();
    segment.updatedAt = new Date().toISOString();
    store.dynamicSegments.set(segment.id, segment);

    return { segment, matchingCustomerIds };
  }

  /**
   * EVALUATE SINGLE CUSTOMER AGAINST RULES
   */
  public evaluateCustomerAgainstRules(
    customer: Customer360Profile,
    rules: SegmentRule[],
    logic: 'ALL' | 'ANY'
  ): boolean {
    if (rules.length === 0) return true;

    const results = rules.map((rule) => this.evaluateSingleRule(customer, rule));

    if (logic === 'ALL') {
      return results.every(Boolean);
    } else {
      return results.some(Boolean);
    }
  }

  /**
   * EVALUATE SINGLE RULE AGAINST CUSTOMER PROFILE
   */
  private evaluateSingleRule(customer: Customer360Profile, rule: SegmentRule): boolean {
    const { field, operator, value } = rule;

    let customerValue: any;
    switch (field) {
      case 'country':
        customerValue = customer.country;
        break;
      case 'lifetimeSpendINR':
        customerValue = customer.lifetimeSpendINR;
        break;
      case 'totalOrdersCount':
        customerValue = customer.totalOrdersCount;
        break;
      case 'averageOrderValueINR':
        customerValue = customer.averageOrderValueINR;
        break;
      case 'priveTier':
        customerValue = customer.priveTier;
        break;
      case 'categoryAffinity':
        customerValue = customer.preferredCategories;
        break;
      case 'hasAbandonedCart':
        customerValue = customer.cartProductIds.length > 0;
        break;
      case 'hasWishlistItems':
        customerValue = customer.wishlistProductIds.length > 0;
        break;
      case 'acquisitionSource':
        customerValue = customer.acquisitionSource;
        break;
      case 'attributedInfluencerId':
        customerValue = customer.attributedInfluencerId;
        break;
      case 'returnsCount':
        customerValue = customer.totalReturnsCount;
        break;
      default:
        customerValue = (customer as any)[field];
    }

    switch (operator) {
      case 'equals':
        return String(customerValue).toLowerCase() === String(value).toLowerCase();
      case 'not_equals':
        return String(customerValue).toLowerCase() !== String(value).toLowerCase();
      case 'greater_than':
        return Number(customerValue) > Number(value);
      case 'less_than':
        return Number(customerValue) < Number(value);
      case 'greater_than_or_equal':
        return Number(customerValue) >= Number(value);
      case 'less_than_or_equal':
        return Number(customerValue) <= Number(value);
      case 'contains':
        if (Array.isArray(customerValue)) {
          return customerValue.some((item) => String(item).toLowerCase().includes(String(value).toLowerCase()));
        }
        return String(customerValue).toLowerCase().includes(String(value).toLowerCase());
      case 'in_list':
        if (Array.isArray(value)) {
          return value.map((v) => String(v).toLowerCase()).includes(String(customerValue).toLowerCase());
        }
        return false;
      case 'is_true':
        return Boolean(customerValue) === true;
      case 'is_false':
        return Boolean(customerValue) === false;
      default:
        return false;
    }
  }

  /**
   * REFRESH ALL SEGMENTS FOR A CUSTOMER (CALLED WHEN ORDERS/SPEND CHANGES)
   */
  public refreshCustomerSegments(customerId: string): string[] {
    const customer = store.crmProfiles.get(customerId);
    if (!customer) return [];

    const activeSegments: string[] = [];
    store.dynamicSegments.forEach((segment) => {
      const isMatch = this.evaluateCustomerAgainstRules(customer, segment.rules, segment.logic);
      if (isMatch) {
        activeSegments.push(segment.id);
      }
    });

    customer.activeSegmentIds = activeSegments;
    customer.updatedAt = new Date().toISOString();
    store.crmProfiles.set(customer.id, customer);

    return activeSegments;
  }
}

export const segmentationEngine = new SegmentationEngine();
