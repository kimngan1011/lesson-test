import { test } from "../../playwright/fixtures";
import { CreateLessonAllocation } from "../pages/create-lesson-allocation";

test("Create LA", async ({ page }) => {
  const createLessonAllocation = new CreateLessonAllocation(page);
  const lessonAllocationName = await createLessonAllocation.createLessonAllocation(); // create LA

  console.log(lessonAllocationName);
});
