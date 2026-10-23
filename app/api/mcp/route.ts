import { NextResponse } from "next/server";
import { SERVICES, searchServices, summarize } from "@/lib/status";

// Stateless JSON-RPC MCP endpoint over the same authored sample services the page shows (no live probe).

type RpcRequest = { id?: number | string | null; method?: string; params?: { name?: string; arguments?: Record<string, unknown> } };

const TOOLS = [
  { name: "get_all", description: "List every sample service with its state and uptime", inputSchema: { type: "object", properties: {} } },
  { name: "get_by_id", description: "Get one sample service by id", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "search", description: "Search service names, states and notes", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } },
];

class RpcError extends Error {
  constructor(readonly code: number, message: string) {
    super(message);
  }
}

function callTool(name: string | undefined, args: Record<string, unknown> = {}) {
  switch (name) {
    case "get_all":
      return { services: SERVICES, summary: summarize(SERVICES), sample: true };
    case "get_by_id": {
      const service = SERVICES.find((entry) => entry.id === args.id);
      if (!service) throw new RpcError(-32602, `No service with id ${String(args.id)}`);
      return { service };
    }
    case "search":
      if (typeof args.query !== "string") throw new RpcError(-32602, "query is required");
      return { services: searchServices(SERVICES, args.query) };
    default:
      throw new RpcError(-32602, `Unknown tool: ${String(name)}`);
  }
}

export async function POST(request: Request) {
  let id: RpcRequest["id"] = null;
  try {
    const body = (await request.json()) as RpcRequest;
    id = body.id ?? null;
    let result: unknown;
    switch (body.method) {
      case "initialize":
        result = { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "Service Status", version: "1.0.0" } };
        break;
      case "tools/list":
        result = { tools: TOOLS };
        break;
      case "tools/call":
        result = callTool(body.params?.name, body.params?.arguments);
        break;
      default:
        throw new RpcError(-32601, `Unknown method: ${String(body.method)}`);
    }
    return NextResponse.json({ jsonrpc: "2.0", id, result });
  } catch (error) {
    const code = error instanceof RpcError ? error.code : -32700;
    const message = error instanceof RpcError ? error.message : "Parse error";
    return NextResponse.json({ jsonrpc: "2.0", id, error: { code, message } }, { status: 400 });
  }
}
