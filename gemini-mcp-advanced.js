import { GoogleGenAI, mcpToTool } from "@google/genai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

/**
 * Przykład użycia Gemini z różnymi MCP serverami
 *
 * Dostępne publiczne MCP servery:
 * - @philschmid/weather-mcp     - pogoda
 * - @anthropics/mcp-server-fetch - pobieranie stron www
 * - @anthropics/mcp-server-filesystem - operacje na plikach
 */

async function createMCPClient(command, args) {
  const transport = new StdioClientTransport({ command, args });
  const client = new Client({
    name: "gemini-client",
    version: "1.0.0",
  });
  await client.connect(transport);
  return client;
}

async function askGeminiWithMCP(question, mcpClient) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: question,
    config: {
      tools: [mcpToTool(mcpClient)],
    },
  });

  return response.text;
}

async function demo() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("Brak GEMINI_API_KEY! Ustaw: export GEMINI_API_KEY='...'");
    process.exit(1);
  }

  console.log("=== Gemini + MCP Demo ===\n");

  // Przykład 1: Weather MCP
  console.log("1. Łączenie z Weather MCP...");
  const weatherClient = await createMCPClient("npx", [
    "-y",
    "@philschmid/weather-mcp",
  ]);

  const weatherAnswer = await askGeminiWithMCP(
    "Jaka będzie pogoda w Krakowie w najbliższy weekend?",
    weatherClient
  );
  console.log("Odpowiedź:", weatherAnswer);
  await weatherClient.close();

  console.log("\n--- Koniec demo ---");
}

// Prosty tryb interaktywny
async function interactive() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("Brak GEMINI_API_KEY!");
    process.exit(1);
  }

  const mcpServer = process.argv[2] || "@philschmid/weather-mcp";
  console.log(`Używam MCP: ${mcpServer}`);
  console.log("Łączenie...\n");

  const client = await createMCPClient("npx", ["-y", mcpServer]);

  // Pokaż dostępne narzędzia
  const tools = await client.listTools();
  console.log("Dostępne narzędzia:");
  tools.tools.forEach((t) => console.log(`  - ${t.name}`));
  console.log("");

  // Zadaj pytanie z argumentu lub domyślne
  const question = process.argv[3] || "Jaka jest pogoda w Warszawie?";
  console.log(`Pytanie: ${question}\n`);

  const answer = await askGeminiWithMCP(question, client);
  console.log("Gemini:", answer);

  await client.close();
}

// Uruchom (możesz zmienić na demo() dla pełnego przykładu)
const mode = process.argv.includes("--demo") ? demo : interactive;
mode().catch(console.error);
