/**
 * SEJAL.PRO — Phase 5 Marketing Automation Engine
 * Reusable Workflow Engine, Step-by-Step State Machine, Idempotent Execution, and Exit Conditions.
 */

import { store } from '../db/store';
import {
  MarketingWorkflow,
  WorkflowExecutionState,
  WorkflowTriggerType,
  WorkflowStep,
} from '../../src/types/automation';
import { omniNotificationEngine } from './omniNotificationEngine';
import { auditLogEngine } from './auditLogEngine';

export class AutomationEngine {
  /**
   * CREATE MARKETING WORKFLOW
   */
  public createWorkflow(payload: {
    name: string;
    description: string;
    triggerType: WorkflowTriggerType;
    targetSegmentId?: string;
    steps: WorkflowStep[];
    frequencyCapHours?: number;
    quietHoursEnforced?: boolean;
    actor?: string;
  }): MarketingWorkflow {
    const id = `wf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const workflow: MarketingWorkflow = {
      id,
      name: payload.name,
      description: payload.description,
      triggerType: payload.triggerType,
      targetSegmentId: payload.targetSegmentId,
      steps: payload.steps,
      isActive: true,
      frequencyCapHours: payload.frequencyCapHours || 24,
      quietHoursEnforced: payload.quietHoursEnforced !== false,
      totalEnrolledCount: 0,
      totalConvertedCount: 0,
      totalRevenueGeneratedINR: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.marketingWorkflows.set(id, workflow);

    auditLogEngine.logAudit({
      entityType: 'Workflow',
      entityId: id,
      referenceCode: payload.name,
      action: 'WORKFLOW_CREATED',
      actor: payload.actor || 'Marketing Manager',
      reason: `Created workflow for trigger: ${payload.triggerType}`,
    });

    return workflow;
  }

  /**
   * LIST ALL WORKFLOWS
   */
  public listWorkflows(): MarketingWorkflow[] {
    return Array.from(store.marketingWorkflows.values());
  }

  /**
   * TRIGGER WORKFLOW ENROLLMENT (WITH IDEMPOTENCY)
   */
  public async triggerWorkflow(
    triggerType: WorkflowTriggerType,
    customer: { id?: string; email: string; phone?: string; name: string },
    eventContext: { triggerEventId: string; metadata?: Record<string, any> }
  ): Promise<WorkflowExecutionState[]> {
    const matchingWorkflows = Array.from(store.marketingWorkflows.values()).filter(
      (w) => w.isActive && w.triggerType === triggerType
    );

    const executions: WorkflowExecutionState[] = [];

    for (const workflow of matchingWorkflows) {
      // 1. Idempotency Check: Customer + Workflow + TriggerEventId
      const existingExecution = Array.from(store.workflowExecutions.values()).find(
        (ex) => ex.workflowId === workflow.id &&
               ex.customerEmail.toLowerCase() === customer.email.toLowerCase() &&
               ex.triggerEventId === eventContext.triggerEventId
      );

      if (existingExecution) {
        console.log(`[Automation Engine] Workflow ${workflow.name} enrollment suppressed (duplicate event ${eventContext.triggerEventId})`);
        executions.push(existingExecution);
        continue;
      }

      // 2. Frequency Cooldown Check
      const recentExecution = Array.from(store.workflowExecutions.values()).find(
        (ex) => ex.workflowId === workflow.id &&
               ex.customerEmail.toLowerCase() === customer.email.toLowerCase() &&
               Date.now() - new Date(ex.createdAt).getTime() < workflow.frequencyCapHours * 60 * 60 * 1000
      );

      if (recentExecution) {
        console.log(`[Automation Engine] Workflow ${workflow.name} enrollment suppressed by frequency cooldown`);
        continue;
      }

      // 3. Create Execution Record
      const executionId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const execution: WorkflowExecutionState = {
        id: executionId,
        workflowId: workflow.id,
        customerId: customer.id || customer.email,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        triggerEventId: eventContext.triggerEventId,
        currentStepIndex: 0,
        status: 'active',
        executionHistory: [
          {
            stepId: 'trigger',
            actionExecuted: `Triggered by ${triggerType}`,
            result: 'Enrolled successfully',
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      workflow.totalEnrolledCount += 1;
      store.marketingWorkflows.set(workflow.id, workflow);
      store.workflowExecutions.set(execution.id, execution);

      // 4. Process immediate workflow execution steps
      await this.processWorkflowExecution(execution.id, customer.name, eventContext.metadata);
      executions.push(store.workflowExecutions.get(execution.id)!);
    }

    return executions;
  }

  /**
   * STEP-BY-STEP WORKFLOW PROCESSOR
   */
  public async processWorkflowExecution(
    executionId: string,
    customerName: string,
    metadata: Record<string, any> = {}
  ): Promise<WorkflowExecutionState> {
    const execution = store.workflowExecutions.get(executionId);
    if (!execution || execution.status !== 'active') {
      return execution!;
    }

    const workflow = store.marketingWorkflows.get(execution.workflowId);
    if (!workflow || !workflow.isActive) {
      execution.status = 'failed';
      return execution;
    }

    // Check if customer has purchased since trigger (Automatic conversion exit)
    const recentPurchases = Array.from(store.orders.values()).filter(
      (o) => o.customerEmail.toLowerCase() === execution.customerEmail.toLowerCase() &&
             new Date(o.createdAt).getTime() >= new Date(execution.createdAt).getTime()
    );

    if (recentPurchases.length > 0 && workflow.triggerType === 'cart_abandoned') {
      execution.status = 'exited_converted';
      execution.executionHistory.push({
        stepId: 'exit_conversion',
        actionExecuted: 'Order Completed',
        result: `Customer completed order ${recentPurchases[0].orderNumber}. Workflow exited.`,
        timestamp: new Date().toISOString(),
      });
      store.workflowExecutions.set(execution.id, execution);
      return execution;
    }

    // Execute steps sequentially
    while (execution.currentStepIndex < workflow.steps.length) {
      const step = workflow.steps[execution.currentStepIndex];

      if (step.stepType === 'delay') {
        execution.status = 'waiting_delay';
        const delayMs = (step.delayMinutes || 0) * 60 * 1000;
        execution.delayUntilTimestamp = new Date(Date.now() + delayMs).toISOString();
        execution.executionHistory.push({
          stepId: step.id,
          actionExecuted: `Wait ${step.delayMinutes} minutes`,
          result: `Delay active until ${execution.delayUntilTimestamp}`,
          timestamp: new Date().toISOString(),
        });
        execution.currentStepIndex += 1;
        break; // Pause execution for worker/simulation
      }

      if (step.stepType === 'condition' && step.condition) {
        let conditionPassed = true;
        if (step.condition.field === 'hasPurchasedSinceTrigger') {
          conditionPassed = recentPurchases.length > 0;
        }

        if (!conditionPassed) {
          execution.executionHistory.push({
            stepId: step.id,
            actionExecuted: `Evaluated Condition: ${step.condition.field}`,
            result: 'Condition not met. Exiting workflow branch.',
            timestamp: new Date().toISOString(),
          });
          execution.status = 'completed';
          break;
        }
        execution.currentStepIndex += 1;
        continue;
      }

      if (step.stepType === 'action' && step.action) {
        await omniNotificationEngine.sendNotification({
          recipient: {
            email: execution.customerEmail,
            phone: execution.customerPhone,
            name: customerName,
            customerId: execution.customerId,
          },
          templateId: step.action.templateId,
          channel: step.action.channel,
          messageType: 'marketing',
          variables: {
            customer_name: customerName,
            ...metadata,
          },
          associatedWorkflowId: workflow.id,
        });

        execution.executionHistory.push({
          stepId: step.id,
          actionExecuted: `Sent ${step.action.channel.toUpperCase()} via ${step.action.templateId}`,
          result: 'Action executed successfully',
          timestamp: new Date().toISOString(),
        });
        execution.currentStepIndex += 1;
      }
    }

    if (execution.currentStepIndex >= workflow.steps.length && execution.status === 'active') {
      execution.status = 'completed';
    }

    execution.updatedAt = new Date().toISOString();
    store.workflowExecutions.set(execution.id, execution);
    return execution;
  }
}

export const automationEngine = new AutomationEngine();
