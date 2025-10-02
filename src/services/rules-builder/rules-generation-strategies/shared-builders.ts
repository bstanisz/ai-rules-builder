import type { Library, Stack } from '../../../data/dictionaries.ts';
import { getRulesForLibrary } from '../../../data/rules.ts';

/**
 * Creates the project header markdown
 */
export function createProjectMarkdown(projectName: string, projectDescription: string): string {
  return `# AI Rules for ${projectName}\n\n${projectDescription}\n\n`;
}

/**
 * Creates the empty state markdown shown when no libraries are selected
 */
export function createEmptyStateMarkdown(): string {
  return `---\n\n👈 Use the Rule Builder on the left or drop dependency file here`;
}

/**
 * Creates markdown content for a single library's rules
 */
export function createLibraryRulesMarkdown(library: Library): string {
  const libraryRules = getRulesForLibrary(library);
  if (libraryRules.length > 0) {
    return libraryRules.map((rule) => `- ${rule}`).join('\n');
  }
  return `- Use ${library} according to best practices`;
}

/**
 * Formats library rules with header
 */
export function formatLibrarySection(library: Library, indent: number = 4): string {
  const header = '#'.repeat(indent);
  const rulesContent = createLibraryRulesMarkdown(library);
  return `${header} ${library}\n\n${rulesContent}\n\n`;
}

/**
 * Formats a stack section header
 */
export function formatStackHeader(stack: Stack, indent: number = 3): string {
  const header = '#'.repeat(indent);
  return `${header} Guidelines for ${stack}\n\n`;
}

/**
 * Formats a layer section header
 */
export function formatLayerHeader(layer: string, indent: number = 2): string {
  const header = '#'.repeat(indent);
  return `${header} ${layer}\n\n`;
}
