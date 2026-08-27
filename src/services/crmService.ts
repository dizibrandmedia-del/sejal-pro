/**
 * SEJAL.PRO — Phase 5 Frontend CRM, Growth & Personalisation Service
 * REST API Client for CRM 360, Automations, Influencers, Affiliates, Analytics & AI Personalisation.
 */

import { Customer360Profile, CustomerTimelineEvent, DynamicSegment, SegmentRule } from '../types/crm';
import { MarketingWorkflow, NotificationTemplate, CommunicationLog } from '../types/automation';
import { InfluencerProfile, AffiliateProfile, CommissionLedgerEntry, AttributionReport } from '../types/attribution';
import { AdvancedAnalyticsDashboardData } from '../types/analytics';
import { PersonalisationContext, RecommendationResult, AIGiftFinderQuery, AIGiftFinderResult, StyleQuizQuestion } from '../types/personalisation';

const API_BASE = '/api';

export const crmService = {
  // --- Customer 360 & CRM ---
  async getCustomers(filters?: { country?: string; priveTier?: string; search?: string }): Promise<Customer360Profile[]> {
    const params = new URLSearchParams(filters as any).toString();
    const res = await fetch(`${API_BASE}/crm/customers?${params}`);
    const json = await res.json();
    return json.profiles || [];
  },

  async getCustomer360(id: string): Promise<Customer360Profile> {
    const res = await fetch(`${API_BASE}/crm/customers/${id}/360`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.profile;
  },

  async getCustomerTimeline(id: string): Promise<CustomerTimelineEvent[]> {
    const res = await fetch(`${API_BASE}/crm/customers/${id}/timeline`);
    const json = await res.json();
    return json.timeline || [];
  },

  async updateConsent(id: string, consent: Partial<Customer360Profile['consent']>): Promise<Customer360Profile> {
    const res = await fetch(`${API_BASE}/crm/customers/${id}/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consent }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.customer;
  },

  // --- Dynamic Segments ---
  async getSegments(): Promise<DynamicSegment[]> {
    const res = await fetch(`${API_BASE}/crm/segments`);
    const json = await res.json();
    return json.segments || [];
  },

  async createSegment(payload: { name: string; description: string; logic: 'ALL' | 'ANY'; rules: SegmentRule[] }): Promise<DynamicSegment> {
    const res = await fetch(`${API_BASE}/crm/segments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.segment;
  },

  async evaluateSegment(id: string): Promise<{ segment: DynamicSegment; matchingCustomerIds: string[] }> {
    const res = await fetch(`${API_BASE}/crm/segments/${id}/evaluate`, { method: 'POST' });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json;
  },

  // --- Marketing Workflows ---
  async getWorkflows(): Promise<MarketingWorkflow[]> {
    const res = await fetch(`${API_BASE}/automations/workflows`);
    const json = await res.json();
    return json.workflows || [];
  },

  async createWorkflow(payload: Partial<MarketingWorkflow>): Promise<MarketingWorkflow> {
    const res = await fetch(`${API_BASE}/automations/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.workflow;
  },

  // --- Notification Templates & Logs ---
  async getTemplates(): Promise<NotificationTemplate[]> {
    const res = await fetch(`${API_BASE}/notifications/templates`);
    const json = await res.json();
    return json.templates || [];
  },

  async saveTemplate(payload: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    const res = await fetch(`${API_BASE}/notifications/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.template;
  },

  async previewTemplate(templateString: string, variables: Record<string, any>): Promise<string> {
    const res = await fetch(`${API_BASE}/notifications/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateString, variables }),
    });
    const json = await res.json();
    return json.preview || '';
  },

  async getCommunicationLogs(limit: number = 50): Promise<CommunicationLog[]> {
    const res = await fetch(`${API_BASE}/notifications/logs?limit=${limit}`);
    const json = await res.json();
    return json.logs || [];
  },

  // --- Creators, Influencers & Affiliates ---
  async getInfluencers(): Promise<InfluencerProfile[]> {
    const res = await fetch(`${API_BASE}/creators/influencers`);
    const json = await res.json();
    return json.influencers || [];
  },

  async saveInfluencer(payload: Partial<InfluencerProfile>): Promise<InfluencerProfile> {
    const res = await fetch(`${API_BASE}/creators/influencers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.influencer;
  },

  async getAffiliates(): Promise<AffiliateProfile[]> {
    const res = await fetch(`${API_BASE}/creators/affiliates`);
    const json = await res.json();
    return json.affiliates || [];
  },

  async saveAffiliate(payload: Partial<AffiliateProfile>): Promise<AffiliateProfile> {
    const res = await fetch(`${API_BASE}/creators/affiliates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.affiliate;
  },

  async getCommissionLedger(): Promise<CommissionLedgerEntry[]> {
    const res = await fetch(`${API_BASE}/attribution/commissions`);
    const json = await res.json();
    return json.ledger || [];
  },

  async getAttributionReport(): Promise<AttributionReport[]> {
    const res = await fetch(`${API_BASE}/attribution/report`);
    const json = await res.json();
    return json.report || [];
  },

  // --- Advanced Analytics ---
  async getAdvancedAnalytics(): Promise<AdvancedAnalyticsDashboardData> {
    const res = await fetch(`${API_BASE}/analytics/advanced`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  },

  // --- Personalisation & AI-Ready Discovery ---
  async getRecommendations(context: PersonalisationContext, targetProductId?: string): Promise<RecommendationResult[]> {
    const res = await fetch(`${API_BASE}/personalisation/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, targetProductId }),
    });
    const json = await res.json();
    return json.recommendations || [];
  },

  async findLuxuryGift(query: AIGiftFinderQuery): Promise<AIGiftFinderResult> {
    const res = await fetch(`${API_BASE}/personalisation/gift-finder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.result;
  },

  async getStyleQuiz(): Promise<StyleQuizQuestion[]> {
    const res = await fetch(`${API_BASE}/personalisation/style-quiz`);
    const json = await res.json();
    return json.questions || [];
  },
};
