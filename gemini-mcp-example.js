import { GoogleGenAI, mcpToTool } from "@google/genai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Sprawdź czy masz GEMINI_API_KEY
if (!process.env.GEMINI_API_KEY) {
  console.error("Ustaw GEMINI_API_KEY:");
  console.error("  export GEMINI_API_KEY='twój-klucz-z-aistudio'");
  console.error("");
  console.error("Klucz możesz wygenerować na: https://aistudio.google.com/apikey");
  process.exit(1);
}

// Konfiguracja MCP Server (przykład: weather)
const serverParams = new StdioClientTransport({
  command: "npx",
  args: ["-y", "@philschmid/weather-mcp"],
});

// Klient MCP
const mcpClient = new Client({
  name: "gemini-mcp-client",
  version: "1.0.0",
});

// Klient Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  console.log("Łączenie z MCP serverem...");
  await mcpClient.connect(serverParams);
  console.log("Połączono!\n");

  // Pobierz dostępne narzędzia z MCP
  const tools = await mcpClient.listTools();
  console.log("Dostępne narzędzia MCP:");
  tools.tools.forEach((tool) => {
    console.log(`  - ${tool.name}: ${tool.description}`);
  });
  console.log("");

  // Zapytanie do Gemini z MCP tools
  const query = `Jaka jest pogoda w Warszawie dzisiaj (${new Date().toLocaleDateString("pl-PL")})?`;
  console.log(`Pytanie: ${query}\n`);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      tools: [mcpToTool(mcpClient)], // MCP jako narzędzie Gemini!
    },
  });

  console.log("Odpowiedź Gemini:");
  console.log(response.text);

  // Zamknij połączenie
  await mcpClient.close();
  console.log("\nZakończono.");
}

main().catch(console.error);
