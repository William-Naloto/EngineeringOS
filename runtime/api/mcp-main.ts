#!/usr/bin/env node

/**
 * EngineeringOS MCP Server — stdio transport.
 *
 * Usage:
 *   ENGINEERINGOS_ROOT=/path/to/repo node --experimental-strip-types runtime/api/mcp-main.ts
 *
 * Requires @modelcontextprotocol/sdk when using MCP transport:
 *   npm install
 *   npm run mcp
 */

import { createEngineeringOsRuntime } from './runtime.ts';
import { getToolDescription } from './handlers.ts';
import type { ToolName } from './interfaces.ts';

async function main(): Promise<void> {
  const repositoryRoot = process.env.ENGINEERINGOS_ROOT ?? process.cwd();
  const runtime = await createEngineeringOsRuntime(repositoryRoot);
  const api = runtime.api;

  let Server;
  let StdioServerTransport;

  try {
    const serverModule = await import('@modelcontextprotocol/sdk/server/index.js');
    const transportModule = await import('@modelcontextprotocol/sdk/server/stdio.js');
    Server = serverModule.Server;
    StdioServerTransport = transportModule.StdioServerTransport;
  } catch {
    console.error(
      'Missing @modelcontextprotocol/sdk. Run: npm install && npm run mcp',
    );
    process.exit(1);
  }

  const server = new Server(
    {
      name: 'engineeringos-mcp',
      version: runtime.version,
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  server.setRequestHandler(
    { method: 'tools/list' } as never,
    async () => ({
      tools: api.listTools().map((name) => ({
        name,
        description: getToolDescription(name),
        inputSchema: {
          type: 'object',
          additionalProperties: true,
        },
      })),
    }),
  );

  server.setRequestHandler(
    { method: 'tools/call' } as never,
    async (request: { params: { name: string; arguments?: Record<string, unknown> } }) => {
      const response = await api.invoke(request.params.name as ToolName, request.params.arguments ?? {});

      if (!response.ok) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    },
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
