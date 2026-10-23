import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/mcp/route";

function rpc(body: unknown) {
  return POST(new Request("http://localhost/api/mcp", { method: "POST", body: JSON.stringify(body) }));
}

describe("MCP route", () => {
  it("echoes the JSON-RPC request id", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 7, method: "tools/list" });
    expect((await res.json()).id).toBe(7);
  });

  it("get_all returns the services the page shows", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "get_all" } });
    const { result } = await res.json();
    expect(result.services.map((s: { id: string }) => s.id)).toEqual(["website", "api", "job-queue"]);
  });

  it("rejects an unknown tool instead of pretending to call it", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "delete_all" } });
    const body = await res.json();
    expect(body.error.code).toBe(-32602);
    expect(body.id).toBe(4);
  });

  it("get_by_id finds a service and errors on an unknown id", async () => {
    const ok = await (await rpc({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "get_by_id", arguments: { id: "api" } } })).json();
    expect(ok.result.service.name).toBe("API");
    const bad = await (await rpc({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "get_by_id", arguments: { id: "nope" } } })).json();
    expect(bad.error.code).toBe(-32602);
  });

  it("search filters services and requires a query", async () => {
    const hit = await (await rpc({ jsonrpc: "2.0", id: 5, method: "tools/call", params: { name: "search", arguments: { query: "queue" } } })).json();
    expect(hit.result.services.map((s: { id: string }) => s.id)).toEqual(["job-queue"]);
    const missing = await (await rpc({ jsonrpc: "2.0", id: 6, method: "tools/call", params: { name: "search" } })).json();
    expect(missing.error.code).toBe(-32602);
  });

  it("initialize names the server; unknown methods and bad JSON are JSON-RPC errors", async () => {
    const init = await (await rpc({ jsonrpc: "2.0", id: 8, method: "initialize" })).json();
    expect(init.result.serverInfo.name).toBe("Service Status");
    const unknown = await (await rpc({ jsonrpc: "2.0", id: 9, method: "resources/list" })).json();
    expect(unknown).toMatchObject({ id: 9, error: { code: -32601 } });
    const res = await POST(new Request("http://localhost/api/mcp", { method: "POST", body: "{" }));
    expect((await res.json()).error.code).toBe(-32700);
  });
});
