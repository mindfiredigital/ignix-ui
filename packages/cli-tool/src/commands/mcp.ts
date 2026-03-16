// packages/cli-tool/src/commands/mcp.ts
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

// Look for mcp.json in multiple locations
const possiblePaths = [
  path.resolve(__dirname, '../../mcp.json'), // relative to cli-tool/dist
  path.resolve(__dirname, '../../../mcp.json'), // relative to project root
  path.resolve(process.cwd(), 'mcp.json'), // current working directory
];

let MCP_CONFIG_PATH = '';
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    MCP_CONFIG_PATH = p;
    break;
  }
}

if (!MCP_CONFIG_PATH) {
  console.error('❌ Could not find mcp.json in any of:', possiblePaths);
  process.exit(1);
}

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
  const configContent = fs.readFileSync(MCP_CONFIG_PATH, 'utf-8');
  MCP_CONFIG = JSON.parse(configContent);
  console.error(`✅ Loaded MCP config from ${MCP_CONFIG_PATH}`);
  console.error(`   Tools found: ${MCP_CONFIG.tools?.length || 0}`);
  MCP_CONFIG.tools?.forEach((t) => console.error(`   - ${t.name}`));
} catch (err) {
  console.error('❌ Failed to load mcp.json:', err);
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
    console.error(`🔧 Executing: ${command}`);
    const { stdout, stderr } = await execAsync(command, {
      env: {
        ...process.env,
        PATH: process.env.PATH,
      },
      shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
    });

    const output =
      typeof stdout === 'string' && stdout.trim().length > 0
        ? stdout.trim()
        : typeof stderr === 'string' && stderr.trim().length > 0
        ? stderr.trim()
        : 'Command executed successfully';

    // Try to parse as JSON if possible
    try {
      const parsed = JSON.parse(output);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(parsed, null, 2),
          },
        ],
      };
    } catch {
      // Not JSON, return as is
      return {
        content: [
          {
            type: 'text',
            text: String(output),
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

    console.error(`❌ Command failed: ${message}`);

    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: message || 'Unknown error',
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
        tools: {},
        resources: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error('\n📋 MCP: ListToolsRequest received');

    const toolList = tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema || {
        type: 'object',
        properties: {},
      },
    }));

    console.error(`   Returning ${toolList.length} tools:`);
    toolList.forEach((t) => console.error(`   - ${t.name}`));
    console.error('');

    return { tools: toolList };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.error(`\n🛠️ MCP: CallToolRequest received for "${request.params.name}"`);
    const { name, arguments: args } = request.params;

    const tool = tools.find((t) => t.name === name);

    if (!tool) {
      console.error(`   ❌ Unknown tool: ${name}`);
      throw new Error(`Unknown tool: ${name}`);
    }

    if (!tool.execution?.command) {
      console.error(`   ❌ Tool "${name}" has no execution command`);
      throw new Error(`Tool "${name}" does not define an execution command`);
    }

    const command = fillTemplate(tool.execution.command, args as Record<string, unknown>);
    console.error(`   🔧 Command: ${command}`);

    const result = await runCommand(command);
    console.error(`   ✅ Command completed`);
    console.error('');

    return result;
  });

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    console.error('\n📚 MCP: ListResourcesRequest received');

    const resourceList = resources.map((r) => ({
      name: r.name,
      uri: r.uri,
      description: r.description,
    }));

    console.error(`   Returning ${resourceList.length} resources`);
    console.error('');

    return { resources: resourceList };
  });

  const transport = new StdioServerTransport();

  await server.connect(transport);

  console.error('\n🚀 Ignix MCP server running');
  console.error(`📦 Available tools (${tools.length}):`);
  tools.forEach((t) => console.error(`   - ${t.name}`));
  console.error(`📚 Available resources (${resources.length}):`);
  resources.forEach((r) => console.error(`   - ${r.name}`));
  console.error('');
}
