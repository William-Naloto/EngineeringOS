import type { EngineeringOsRuntime, McpApi } from './interfaces.ts';
import { EorContext } from './eor-context.ts';
import { createMcpApi } from './mcp-api.ts';
import { EOR_VERSION } from './response.ts';

export class EngineeringOsRuntimeImpl implements EngineeringOsRuntime {
  readonly version = EOR_VERSION;
  readonly api: McpApi;
  private readonly context: EorContext;

  private constructor(context: EorContext, api: McpApi) {
    this.context = context;
    this.api = api;
  }

  static async create(repositoryRoot: string): Promise<EngineeringOsRuntimeImpl> {
    const context = new EorContext(repositoryRoot);
    const api = createMcpApi(context);
    return new EngineeringOsRuntimeImpl(context, api);
  }

  async initialize(): Promise<void> {
    await this.context.initialize();
  }

  async shutdown(): Promise<void> {
    await this.context.shutdown();
  }
}

export async function createEngineeringOsRuntime(
  repositoryRoot: string,
): Promise<EngineeringOsRuntime> {
  const runtime = await EngineeringOsRuntimeImpl.create(repositoryRoot);
  await runtime.initialize();
  return runtime;
}
