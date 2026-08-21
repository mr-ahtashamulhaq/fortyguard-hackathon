import { z } from "zod";
import type { FieldInput, HeatEvaluation, NormalizedObservation, PolicyInput } from "./policy-engine";

export const EvidenceExplanationSchema = z.object({
  source: z.enum(["groq", "template"]),
  headline: z.string().min(1),
  summary: z.string().min(1),
  reasons: z.array(z.string().min(1)).min(1),
  recommendedAction: z.string().min(1),
  disclaimer: z.string().min(1),
});

export type EvidenceExplanation = z.infer<typeof EvidenceExplanationSchema>;

type AgentContext = {
  field: FieldInput;
  policy: PolicyInput;
  observations: NormalizedObservation[];
  evaluation: HeatEvaluation;
};

export type MonitoringAgentToolHandlers = {
  getFieldData: () => unknown | Promise<unknown>;
  evaluateHeatEvent: () => unknown | Promise<unknown>;
  createEvidenceRecord: () => unknown | Promise<unknown>;
  createSimulatedPayout: () => unknown | Promise<unknown>;
};

type ToolCall = { id: string; type: "function"; function: { name: string; arguments: string } };
type GroqMessage = { role: "system" | "user" | "assistant" | "tool"; content: string | null; tool_calls?: ToolCall[]; tool_call_id?: string; name?: string };

const monitoringTools = [
  { type: "function", function: { name: "get_field_data", description: "Read the selected field metadata and normalized observations. This tool cannot change any data.", parameters: { type: "object", properties: { fieldId: { type: "string" } }, required: ["fieldId"] } } },
  { type: "function", function: { name: "evaluate_heat_event", description: "Read the deterministic policy result that was already calculated by the server. This tool cannot change the policy or result.", parameters: { type: "object", properties: { fieldId: { type: "string" } }, required: ["fieldId"] } } },
  { type: "function", function: { name: "create_evidence_record", description: "Request creation of the evidence record. The server creates it from the deterministic evaluation only.", parameters: { type: "object", properties: { fieldId: { type: "string" } }, required: ["fieldId"] } } },
  { type: "function", function: { name: "create_simulated_payout", description: "Request an idempotent simulated-payout record only when the deterministic evaluation has a payout band. The server determines the amount.", parameters: { type: "object", properties: { fieldId: { type: "string" } }, required: ["fieldId"] } } },
];

function templateExplanation({ field, policy, evaluation }: AgentContext): EvidenceExplanation {
  const band = evaluation.payoutBand === "none" ? "no simulated payout" : `${evaluation.payoutBand.replace("_", " ").replace("_", " ")} simulated payout`;
  return {
    source: "template",
    headline: evaluation.status === "triggered" ? "Heat event meets the fixed policy rule." : "Heat event did not meet the fixed policy rule.",
    summary: `${field.id} was evaluated against ${policy.version}. The server found ${evaluation.longestExposureHours} qualifying hourly readings and a ${evaluation.heatScore} degree-hour heat score, producing ${band}.`,
    reasons: evaluation.reasons,
    recommendedAction: evaluation.status === "triggered" ? "Review the evidence record before marking the simulated payout as reviewed." : "Continue monitoring the field. No payout record is created for this result.",
    disclaimer: "This is a synthetic hackathon demonstration. The policy decision is deterministic and no money is moved.",
  };
}

async function executeControlledTool(name: string, rawArguments: string, context: AgentContext, handlers: MonitoringAgentToolHandlers) {
  let argumentsValue: { fieldId?: string } = {};
  try { argumentsValue = JSON.parse(rawArguments) as { fieldId?: string }; } catch { return { error: "Tool arguments were not valid JSON." }; }
  if (argumentsValue.fieldId !== context.field.id) return { error: "The requested field is not available to this monitoring run." };
  if (name === "get_field_data") return handlers.getFieldData();
  if (name === "evaluate_heat_event") return handlers.evaluateHeatEvent();
  if (name === "create_evidence_record") return handlers.createEvidenceRecord();
  if (name === "create_simulated_payout") return handlers.createSimulatedPayout();
  return { error: "This tool is not allow-listed." };
}

async function callGroq(messages: GroqMessage[], toolChoice: "none" | { type: "function"; function: { name: string } }) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "openai/gpt-oss-120b", messages, tools: monitoringTools, tool_choice: toolChoice, temperature: 0, max_completion_tokens: 700, parallel_tool_calls: false, response_format: toolChoice === "none" ? { type: "json_object" } : undefined }),
  });
  if (!response.ok) throw new Error(`Groq returned ${response.status}.`);
  const payload = await response.json() as { choices?: { message?: { content?: string | null; tool_calls?: ToolCall[] } }[] };
  const message = payload.choices?.[0]?.message;
  if (!message) throw new Error("Groq returned no completion choice.");
  return { content: message.content ?? "", toolCalls: message.tool_calls ?? [] };
}

export async function createAgentExplanation(context: AgentContext, handlers: MonitoringAgentToolHandlers): Promise<EvidenceExplanation> {
  if (!process.env.GROQ_API_KEY) return templateExplanation(context);
  const system = "You are the AgriGuard monitoring agent. You explain a deterministic wheat heat-policy evaluation. You cannot alter policy thresholds, field data, stages, payout bands, or payout amounts. First use the supplied tools. Then return only JSON with headline, summary, reasons, recommendedAction, and disclaimer. Keep wording simple and state that money is not moved.";
  const messages: GroqMessage[] = [{ role: "system", content: system }, { role: "user", content: `Explain the monitoring run for field ${context.field.id}.` }];
  try {
    for (const toolName of ["get_field_data", "evaluate_heat_event", "create_evidence_record", "create_simulated_payout"]) {
      const response = await callGroq(messages, { type: "function", function: { name: toolName } });
      const toolCall = response.toolCalls.find((candidate) => candidate.function.name === toolName);
      if (!toolCall) throw new Error(`Groq did not call the required ${toolName} tool.`);
      messages.push({ role: "assistant", content: response.content, tool_calls: [toolCall] });
      const toolResult = await executeControlledTool(toolCall.function.name, toolCall.function.arguments, context, handlers);
      messages.push({ role: "tool", tool_call_id: toolCall.id, name: toolCall.function.name, content: JSON.stringify(toolResult) });
    }
    const final = await callGroq(messages, "none");
    const parsed = EvidenceExplanationSchema.omit({ source: true }).safeParse(JSON.parse(final.content));
    if (!parsed.success) return templateExplanation(context);
    return { source: "groq", ...parsed.data };
  } catch {
    return templateExplanation(context);
  }
}

export { templateExplanation as createTemplateExplanation };
