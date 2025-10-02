import type { RulesGenerationStrategy } from '../RulesGenerationStrategy.ts';
import { Layer, Library, Stack } from '../../../data/dictionaries.ts';
import type { RulesContent } from '../RulesBuilderTypes.ts';
import {
  createProjectMarkdown,
  createEmptyStateMarkdown,
  formatLayerHeader,
  formatStackHeader,
  formatLibrarySection,
} from './shared-builders.ts';

/**
 * Strategy for single-file rules generation
 */
export class SingleFileRulesStrategy implements RulesGenerationStrategy {
  generateRules(
    projectName: string,
    projectDescription: string,
    selectedLibraries: Library[],
    stacksByLayer: Record<Layer, Stack[]>,
    librariesByStack: Record<Stack, Library[]>,
  ): RulesContent[] {
    let markdown = createProjectMarkdown(projectName, projectDescription);

    if (selectedLibraries.length === 0) {
      markdown += createEmptyStateMarkdown();
      return [{ markdown, label: 'Project', fileName: 'project.mdc' }];
    }

    markdown += this.generateLibraryMarkdown(stacksByLayer, librariesByStack);
    return [{ markdown, label: 'All Rules', fileName: 'rules.mdc' }];
  }

  private generateLibraryMarkdown(
    stacksByLayer: Record<Layer, Stack[]>,
    librariesByStack: Record<Stack, Library[]>,
  ): string {
    let markdown = '';

    Object.entries(stacksByLayer).forEach(([layer, stacks]) => {
      markdown += formatLayerHeader(layer);

      stacks.forEach((stack) => {
        markdown += formatStackHeader(stack);

        const libraries = librariesByStack[stack];
        if (libraries) {
          libraries.forEach((library) => {
            markdown += formatLibrarySection(library);
          });
        }

        markdown += '\n';
      });
    });

    return markdown;
  }
}
