import { test as baseTest, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { ENV_PREPROD } from "../tests/utils/env";
export * from "@playwright/test";
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [
    async ({ browser }, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      const id = test.info().parallelIndex;
      const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);

      if (fs.existsSync(fileName)) {
        // Reuse existing authentication state if any.
        await use(fileName);
        return;
      }

      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const page = await browser.newPage({ storageState: undefined });

      // Perform authentication steps. Replace these actions with your own.
      await page.goto(ENV_PREPROD.baseUrl);
      await page.fill('input[id="username"]', ENV_PREPROD.username);
      await page.fill('input[id="password"]', ENV_PREPROD.password);
      await page.getByRole("button", { name: "Log In" }).click();
      await page.context().storageState({ path: fileName });
      await page.close();
      await use(fileName);
    },
    { scope: "worker" },
  ],
});
