/******************************************************************************
 *
 * Copyright (c) 2019, the nbcelltest authors.
 *
 * This file is part of the nbcelltest library, distributed under the terms of
 * the Apache License 2.0.  The full license can be found in the LICENSE file.
 *
 */
import { JupyterFrontEnd } from "@jupyterlab/application";
import { runCellLints, runCellTests } from "./run";
import { CelltestsTool } from "./tool";
// tslint:disable-next-line:max-line-length
import { CELLTESTS_ID, CELLTESTS_CATEGORY, CELLTESTS_LINT_CAPTION, CELLTESTS_LINT_ID, CELLTESTS_TEST_CAPTION, CELLTESTS_TEST_ID, isEnabled } from "./utils";
import { IDocumentManager } from "@jupyterlab/docmanager";
import { ICommandPalette } from "@jupyterlab/apputils";
import { INotebookTools, INotebookTracker } from "@jupyterlab/notebook";
import { IEditorServices } from "@jupyterlab/codeeditor";

export function activate(app: JupyterFrontEnd, docManager: IDocumentManager, palette: ICommandPalette, tracker: INotebookTracker, cellTools: INotebookTools, editorServices: IEditorServices) {
  /* Add to cell tools sidebar */
  const testsTool = new CelltestsTool(app, tracker, cellTools, editorServices);

  // Adds a section to notebookTools.
  cellTools.addSection({
    sectionName: CELLTESTS_ID,
    rank: 1,
    label: CELLTESTS_CATEGORY,
  });

  cellTools.addItem({ tool: testsTool, rank: 1.9, section: CELLTESTS_ID });

  /* Add to commands to sidebar */
  palette.addItem({ command: CELLTESTS_TEST_ID, category: CELLTESTS_CATEGORY });
  palette.addItem({ command: CELLTESTS_LINT_ID, category: CELLTESTS_CATEGORY });

  app.commands.addCommand(CELLTESTS_TEST_ID, {
    caption: CELLTESTS_TEST_CAPTION,
    execute: async () => {
      await runCellTests(app, docManager);
    },
    isEnabled: isEnabled(app, docManager),
    label: CELLTESTS_TEST_CAPTION,
  });

  app.commands.addCommand(CELLTESTS_LINT_ID, {
    caption: CELLTESTS_LINT_CAPTION,
    execute: async () => {
      await runCellLints(app, docManager);
    },
    isEnabled: isEnabled(app, docManager),
    label: CELLTESTS_LINT_CAPTION,
  });
}
