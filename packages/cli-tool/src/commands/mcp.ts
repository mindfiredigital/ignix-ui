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
  path.resolve(process.cwd(), 'mcp.json'), // current working directory
  path.resolve(__dirname, '../mcp.json'), // relative to cli-tool/dist
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

type CreateReactProjectArgs = {
  projectName: string;
  cwd?: string;
  packageManager?: string;
};

type SetupProjectWithIgnixArgs = {
  projectName: string;
  cwd?: string;
  packageManager?: string;
};

type SearchArgs = {
  query: string;
};

type PrerequisitesResult = {
  node: boolean;
  npm: boolean;
  git: boolean;
  ignix: boolean;
};

type Component = {
  name: string;
  description: string;
  type?: string;
};

type ComponentData = {
  components: Component[];
};

type Theme = {
  name: string;
  description: string;
};

type ThemeData = {
  themes: Theme[];
};

let MCP_CONFIG: MCPConfig;

try {
  const configContent = fs.readFileSync(MCP_CONFIG_PATH, 'utf-8');
  MCP_CONFIG = JSON.parse(configContent);
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

// Add this function to check if directory is empty
async function isDirectoryEmpty(dirPath: string): Promise<boolean> {
  try {
    const files = await fs.promises.readdir(dirPath);
    // Ignore common files like .git, .DS_Store, etc.
    const filtered = files.filter((f) => !f.startsWith('.') && f !== 'node_modules');
    return filtered.length === 0;
  } catch {
    return true; // If directory doesn't exist, treat as empty
  }
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

    // Add validation for tools that need cwd
    const toolsNeedingCwd = [
      'install_component',
      'install_template',
      'install_theme',
      'init_project',
    ];
    if (toolsNeedingCwd.includes(name) && (!args || !args.cwd)) {
      console.error(`⚠️ Warning: Tool ${name} called without cwd parameter`);
      console.error(`   This might fail if not in the correct project directory`);
      console.error(`   Consider using cwd from create_react_project result`);
    }

    const tool = tools.find((t) => t.name === name);

    if (!tool) {
      console.error(`   ❌ Unknown tool: ${name}`);
      throw new Error(`Unknown tool: ${name}`);
    }

    if (!tool.execution?.command) {
      console.error(`   ❌ Tool "${name}" has no execution command`);
      throw new Error(`Tool "${name}" does not define an execution command`);
    }

    if (name === 'create_react_project') {
      const typedArgs = (args as unknown) as CreateReactProjectArgs;
      const projectName = typedArgs.projectName;
      const cwd = typedArgs.cwd || '.';

      // Check if we're in an empty directory
      const isEmpty = await isDirectoryEmpty(cwd);
      let projectPath = path.resolve(cwd);

      try {
        if (isEmpty) {
          // Create project directly in current directory
          console.error(`📁 Creating project directly in ${cwd}`);

          // Create Vite project in current directory (not as subfolder)
          await execAsync(`npm create vite@latest . -- --template react-ts`, {
            cwd,
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
        } else {
          // Create as subfolder (original behavior)
          projectPath = path.resolve(cwd, projectName);
          await execAsync(`npm create vite@latest ${projectName} -- --template react-ts`, {
            cwd,
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
        }

        // Install dependencies
        await execAsync(`npm install`, {
          cwd: projectPath,
          shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
        });

        await execAsync(`npm install -D tailwindcss postcss autoprefixer`, {
          cwd: projectPath,
          shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
        });

        // Initialize Tailwind
        await execAsync(`npx tailwindcss init -p`, {
          cwd: projectPath,
          shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
        });

        // Add Tailwind directives
        const indexPath = path.join(projectPath, 'src', 'index.css');
        await fs.promises.writeFile(
          indexPath,
          '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n'
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  projectPath,
                  message: isEmpty
                    ? `Project created in ${projectPath}`
                    : `Project created at ${projectPath}`,
                  nextSteps: `Run 'npm run dev' to start the dev server`,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: false,
                  error: error instanceof Error ? error.message : String(error),
                },
                null,
                2
              ),
            },
          ],
        };
      }
    }

    if (name === 'setup_project_with_ignix') {
      const typedArgs = (args as unknown) as SetupProjectWithIgnixArgs;
      const projectName = typedArgs.projectName;
      const cwd = typedArgs.cwd || '.';
      const isEmpty = await isDirectoryEmpty(cwd);
      let projectPath = path.resolve(cwd);

      try {
        // Check if Node.js is available
        try {
          await execAsync('node --version', {
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
        } catch {
          throw new Error('Node.js is not installed. Please install Node.js first.');
        }

        // Check if npm is available
        try {
          await execAsync('npm --version', {
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
        } catch {
          throw new Error('npm is not installed. Please install npm first.');
        }

        if (isEmpty) {
          console.error(`📁 Creating React project directly in ${cwd}`);

          // Create Vite project in current directory
          await execAsync(`npm create vite@latest . -- --template react-ts`, {
            cwd,
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
        } else {
          projectPath = path.resolve(cwd, projectName);
          console.error(`📁 Creating React project in ${projectPath}`);

          await execAsync(`npm create vite@latest ${projectName} -- --template react-ts`, {
            cwd,
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
        }

        // Install dependencies
        console.error('📦 Installing dependencies...');
        await execAsync(`npm install`, {
          cwd: projectPath,
          shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
        });

        // Install Tailwind CSS
        console.error('🎨 Installing Tailwind CSS...');
        await execAsync(`npm install -D tailwindcss postcss autoprefixer`, {
          cwd: projectPath,
          shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
        });

        // Initialize Tailwind
        console.error('⚙️ Initializing Tailwind...');
        await execAsync(`npx tailwindcss init -p`, {
          cwd: projectPath,
          shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
        });

        // Add Tailwind directives
        const indexPath = path.join(projectPath, 'src', 'index.css');
        await fs.promises.writeFile(
          indexPath,
          '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n'
        );

        // Update tailwind.config.js
        const tailwindConfigPath = path.join(projectPath, 'tailwind.config.js');
        let tailwindConfig = await fs.promises.readFile(tailwindConfigPath, 'utf-8');
        tailwindConfig = tailwindConfig.replace(
          'content: []',
          'content: [\n    "./index.html",\n    "./src/**/*.{js,ts,jsx,tsx}",\n  ]'
        );
        await fs.promises.writeFile(tailwindConfigPath, tailwindConfig);

        // Install ignix-cli locally if not available
        console.error('📦 Installing ignix-cli...');
        await execAsync(`npm install --save-dev ignix-cli`, {
          cwd: projectPath,
          shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
        });

        // Initialize Ignix
        console.error('🚀 Initializing Ignix...');
        await execAsync(`npx ignix init --yes --json`, {
          cwd: projectPath,
          shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  projectPath,
                  message: `✅ Project created and initialized at ${projectPath}`,
                  ready: true,
                  nextSteps: [`cd ${path.basename(projectPath)}`, 'npm run dev'],
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        console.error('❌ Setup failed:', error);
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: false,
                  error: error instanceof Error ? error.message : String(error),
                  suggestion: 'Please ensure Node.js and npm are installed, then try again.',
                },
                null,
                2
              ),
            },
          ],
        };
      }
    }

    if (name === 'list_components') {
      try {
        let stdout: string;
        try {
          const result = await execAsync('npx ignix list component --json', {
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
          stdout = result.stdout;
        } catch {
          const result = await execAsync('ignix list component --json', {
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
          stdout = result.stdout;
        }

        const data = JSON.parse(stdout) as ComponentData;
        const components = data.components.filter(
          (component: Component) => component.type !== 'template'
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  components: components.map((component: Component) => ({
                    name: component.name,
                    description: component.description,
                    type: 'component',
                  })),
                  count: components.length,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  components: [],
                  count: 0,
                  warning: 'Could not fetch components. Run "npm install -g ignix-cli" to fix.',
                  fallbackComponents: [
                    'Button',
                    'Card',
                    'Input',
                    'Navbar',
                    'Modal',
                    'Dropdown',
                    'Table',
                    'Form',
                  ],
                },
                null,
                2
              ),
            },
          ],
        };
      }
    }

    if (name === 'list_templates') {
      try {
        let stdout: string;
        try {
          const result = await execAsync('npx ignix list component --json', {
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
          stdout = result.stdout;
        } catch {
          const result = await execAsync('ignix list component --json', {
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
          stdout = result.stdout;
        }

        const data = JSON.parse(stdout) as ComponentData;
        const templates = data.components.filter(
          (component: Component) => component.type === 'template'
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  templates: templates.map((template: Component) => ({
                    name: template.name,
                    description: template.description,
                    type: 'template',
                  })),
                  count: templates.length,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  templates: [
                    { name: 'SignIn', description: 'Sign in page template' },
                    { name: 'SignUp', description: 'Sign up page template' },
                    { name: 'dashboard-overview-page', description: 'Dashboard overview' },
                    { name: 'hero-section', description: 'Hero section template' },
                  ],
                  count: 4,
                  warning:
                    'Using fallback template list. Run "npm install -g ignix-cli" for latest.',
                },
                null,
                2
              ),
            },
          ],
        };
      }
    }

    if (name === 'list_themes') {
      try {
        let stdout: string;
        try {
          const result = await execAsync('npx ignix list theme --json', {
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
          stdout = result.stdout;
        } catch {
          const result = await execAsync('ignix list theme --json', {
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
          stdout = result.stdout;
        }
        const data = JSON.parse(stdout) as ThemeData;
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { success: true, themes: data.themes || [], count: data.themes?.length || 0 },
                null,
                2
              ),
            },
          ],
        };
      } catch {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  themes: [
                    { name: 'dark-forest', description: 'Dark theme with forest accents' },
                    { name: 'light-ocean', description: 'Light theme with ocean colors' },
                    { name: 'sunset', description: 'Warm sunset theme' },
                  ],
                  count: 3,
                  warning: 'Using fallback theme list.',
                },
                null,
                2
              ),
            },
          ],
        };
      }
    }

    if (name === 'search_components') {
      const typedArgs = (args as unknown) as SearchArgs;
      const query = typedArgs.query?.toLowerCase() || '';

      try {
        const { stdout } = await execAsync('ignix list component --json', {
          shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
        });

        const data = JSON.parse(stdout) as ComponentData;
        // Filter for components only (type === 'component' or no type)
        const components = data.components.filter(
          (component: Component) =>
            component.type !== 'template' &&
            (component.name.toLowerCase().includes(query) ||
              (component.description && component.description.toLowerCase().includes(query)))
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  query,
                  results: components,
                  count: components.length,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: false,
                  error: error instanceof Error ? error.message : String(error),
                },
                null,
                2
              ),
            },
          ],
        };
      }
    }

    if (name === 'search_templates') {
      const typedArgs = (args as unknown) as SearchArgs;
      const query = typedArgs.query?.toLowerCase() || '';

      try {
        let stdout: string;
        try {
          const result = await execAsync('npx ignix list component --json', {
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
          stdout = result.stdout;
        } catch {
          const result = await execAsync('ignix list component --json', {
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
          stdout = result.stdout;
        }

        const data = JSON.parse(stdout) as ComponentData;
        const templates = data.components.filter(
          (component: Component) =>
            component.type === 'template' &&
            (component.name.toLowerCase().includes(query) ||
              (component.description && component.description.toLowerCase().includes(query)))
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { success: true, query, results: templates, count: templates.length },
                null,
                2
              ),
            },
          ],
        };
      } catch {
        const fallbackTemplates = [
          { name: 'SignIn', description: 'Sign in page' },
          { name: 'SignUp', description: 'Sign up page' },
          { name: 'dashboard-overview-page', description: 'Dashboard overview' },
          { name: 'hero-section', description: 'Hero section' },
        ];
        const results = fallbackTemplates.filter(
          (template) =>
            template.name.toLowerCase().includes(query) ||
            template.description.toLowerCase().includes(query)
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { success: true, query, results, count: results.length, warning: 'Using fallback' },
                null,
                2
              ),
            },
          ],
        };
      }
    }

    if (name === 'search_themes') {
      const typedArgs = (args as unknown) as SearchArgs;
      const query = typedArgs.query?.toLowerCase() || '';

      try {
        let stdout: string;
        try {
          const result = await execAsync('npx ignix list theme --json', {
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
          stdout = result.stdout;
        } catch {
          const result = await execAsync('ignix list theme --json', {
            shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
          });
          stdout = result.stdout;
        }
        const data = JSON.parse(stdout) as ThemeData;
        const results = (data.themes || []).filter(
          (theme: Theme) =>
            theme.name.toLowerCase().includes(query) ||
            (theme.description && theme.description.toLowerCase().includes(query))
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { success: true, query, results, count: results.length },
                null,
                2
              ),
            },
          ],
        };
      } catch {
        const fallback = [
          { name: 'dark-forest', description: 'Dark theme' },
          { name: 'light-ocean', description: 'Light theme' },
        ].filter((theme) => theme.name.toLowerCase().includes(query));
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  query,
                  results: fallback,
                  count: fallback.length,
                  warning: 'Using fallback',
                },
                null,
                2
              ),
            },
          ],
        };
      }
    }

    if (name === 'check_prerequisites') {
      const checks: PrerequisitesResult = { node: false, npm: false, git: false, ignix: false };
      try {
        await execAsync('node --version', {
          shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
        });
        checks.node = true;
      } catch {
        // Node not installed
      }
      try {
        await execAsync('npm --version', {
          shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
        });
        checks.npm = true;
      } catch {
        // npm not installed
      }
      try {
        await execAsync('git --version', {
          shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
        });
        checks.git = true;
      } catch {
        // Git not installed
      }
      try {
        await execAsync('npx ignix --version', {
          shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
        });
        checks.ignix = true;
      } catch {
        // Ignix not installed
      }
      const allPass = checks.node && checks.npm;
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: allPass,
                checks,
                message: allPass ? '✅ All prerequisites satisfied' : '❌ Missing prerequisites',
                installCommands: {
                  node: 'https://nodejs.org/',
                  npm: 'Comes with Node.js',
                  git: 'https://git-scm.com/downloads',
                  ignix: 'npm install -g ignix-cli',
                },
              },
              null,
              2
            ),
          },
        ],
      };
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
