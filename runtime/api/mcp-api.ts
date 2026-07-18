import type { EorContext } from './eor-context.ts';
import { createToolHandlers, getToolDescription } from './handlers.ts';
import type { McpApi, ToolName, ToolResponse } from './interfaces.ts';
import { failure } from './response.ts';

export class EngineeringOsMcpApi implements McpApi {
  readonly tools = createToolHandlers() as McpApi['tools'];
  private readonly context: EorContext;

  constructor(context: EorContext) {
    this.context = context;
  }

  async invoke(name: ToolName, input: unknown): Promise<ToolResponse<unknown>> {
    const handler = this.tools.get(name);
    if (!handler) {
      return failure('INVALID_INPUT', `Unknown tool: ${name}`, 0);
    }

    if (this.context.phase !== 'ACTIVE' && name !== 'engineeringos.status') {
      return failure('NOT_READY', 'EOR runtime is not active', 0);
    }

    const payload =
      input && typeof input === 'object' && !Array.isArray(input)
        ? (input as Record<string, unknown>)
        : {};

    return handler(this.context, payload);
  }

  listTools(): ToolName[] {
    return [...this.tools.keys()];
  }

  listToolDefinitions(): Array<{ name: ToolName; description: string }> {
    return this.listTools().map((name) => ({
      name,
      description: getToolDescription(name),
    }));
  }
}

export function createMcpApi(context: EorContext): McpApi {
  return new EngineeringOsMcpApi(context);
}
