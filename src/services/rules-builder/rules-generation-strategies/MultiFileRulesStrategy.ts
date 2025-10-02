import type { RulesGenerationStrategy } from '../RulesGenerationStrategy.ts';
import { Layer, type Library, Stack } from '../../../data/dictionaries.ts';
import type { RulesContent } from '../RulesBuilderTypes.ts';
import { slugify } from '../../../utils/slugify.ts';
import {
  createProjectMarkdown,
  createEmptyStateMarkdown,
  createLibraryRulesMarkdown,
  formatLayerHeader,
  formatStackHeader,
} from './shared-builders.ts';

/**
 * Strategy for multi-file rules generation
 */
export class MultiFileRulesStrategy implements RulesGenerationStrategy {
  generateRules(
    projectName: string,
    projectDescription: string,
    selectedLibraries: Library[],
    stacksByLayer: Record<Layer, Stack[]>,
    librariesByStack: Record<Stack, Library[]>,
  ): RulesContent[] {
    const markdowns: RulesContent[] = [];
    const projectMarkdown = createProjectMarkdown(projectName, projectDescription);

    if (selectedLibraries.length === 0) {
      markdowns.push({
        markdown: projectMarkdown + createEmptyStateMarkdown(),
        label: 'Project',
        fileName: 'project.mdc',
      });
      return markdowns;
    }

    markdowns.push({ markdown: projectMarkdown, label: 'Project', fileName: 'project.mdc' });

    Object.entries(stacksByLayer).forEach(([layer, stacks]) => {
      stacks.forEach((stack) => {
        librariesByStack[stack].forEach((library) => {
          markdowns.push(this.buildRulesContent({ layer, stack, library }));
        });
      });
    });

    return markdowns;
  }

  private buildRulesContent({
    layer,
    stack,
    library,
  }: {
    layer: string;
    stack: Stack;
    library: Library;
  }): RulesContent {
    const label = `${layer} - ${stack} - ${library}`;
    const fileName: RulesContent['fileName'] = `${slugify(`${layer}-${stack}-${library}`)}.mdc`;
    const content = createLibraryRulesMarkdown(library);
    const markdown =
      formatLayerHeader(layer) + formatStackHeader(stack) + `#### ${library}\n\n${content}\n\n`;
    return { markdown, label, fileName };
  }
}
