import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../../..');
const MCP_CONFIG_PATH = path.join(ROOT_DIR, 'mcp.json');

type ToolExecution = {
  type: 'shell';
  command: string;
};

type MCPTool = {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  execution?: ToolExecution;
};

type MCPResource = {
  name: string;
  uri: string;
  description?: string;
};

type MCPConfig = {
  name?: string;
  version?: string;
  tools?: MCPTool[];
  resources?: MCPResource[];
};

let MCP_CONFIG: MCPConfig;

try {
  MCP_CONFIG = JSON.parse(fs.readFileSync(MCP_CONFIG_PATH, 'utf-8'));
} catch (err) {
  console.error('Failed to load mcp.json:', err);
  process.exit(1);
}

const tools: MCPTool[] = MCP_CONFIG.tools ?? [];
const resources: MCPResource[] = MCP_CONFIG.resources ?? [];

function fillTemplate(command: string, args: Record<string, unknown> = {}): string {
  return command.replace(/\{(\w+)\}/g, (_, key) => {
    const value = args[key];

    if (Array.isArray(value)) {
      return value.join(' ');
    }

    if (value === undefined || value === null) {
      return '';
    }

    return String(value);
  });
}

async function runCommand(command: string) {
  try {
    const { stdout } = await execAsync(command);

    try {
      return {
        content: [
          {
            type: 'json',
            json: JSON.parse(stdout),
          },
        ],
      };
    } catch {
      return {
        content: [
          {
            type: 'text',
            text: stdout,
          },
        ],
      };
    }
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === 'object' && err !== null && 'stderr' in err
        ? String((err as { stderr?: string }).stderr)
        : String(err);

    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: message,
        },
      ],
    };
  }
}

export async function startMcpServer() {
  const server = new Server(
    {
      name: MCP_CONFIG.name || 'ignix-ui',
      version: MCP_CONFIG.version || '0.1.0',
    },
    {
      capabilities: {
        tools: {
          listChanged: false,
        },
        resources: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const toolList = tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema || {
        type: 'object',
        properties: {},
      },
    }));

    return { tools: toolList };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    const tool = tools.find((t) => t.name === name);

    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    if (!tool.execution?.command) {
      throw new Error(`Tool "${name}" does not define an execution command`);
    }

    const command = fillTemplate(tool.execution.command, args as Record<string, unknown>);

    return runCommand(command);
  });

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const resourceList = resources.map((r) => ({
      name: r.name,
      uri: r.uri,
      description: r.description,
    }));

    return { resources: resourceList };
  });

  const transport = new StdioServerTransport();

  await server.connect(transport);

  console.error('Ignix MCP server running');
}
