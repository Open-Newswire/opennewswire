import { SyncLogger } from "@/domains/sync";

export class BasicLogger implements SyncLogger {
  info = console.info.bind(console);
  warn = console.warn.bind(console);
  debug = console.debug.bind(console);
  error = console.error.bind(console);
}
