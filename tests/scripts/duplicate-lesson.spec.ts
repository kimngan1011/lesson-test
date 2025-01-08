import { test } from "../../playwright/fixtures";
import { BOLesson } from "../pages/bo-lesson";
import { LsCommonTest } from "../pages/common-test";
import { CreateLesson } from "../pages/create-lesson";
import { MessageLesson } from "../pages/message";
import { loginBO } from "../sf-login-page";
import { LESSON_NAME } from "../utils/masterData";

test("Duplicate one time individual lesson to recurring group", async ({ page }) => {
  const createLesson = new CreateLesson(page);
  const { lessonName, lessonCode, lessonDate } = await createLesson.createLesson("oneTimeIndividual");
  const lsCommonTest = new LsCommonTest(page);
  const boLesson = new BOLesson(page);
  const showMessage = new MessageLesson(page);

  await lsCommonTest.searchList(lessonName);
  await lsCommonTest.openHyperlink(lessonName);
  const { newLessonName } = await createLesson.duplicateLesson("recurringGroup");
  await showMessage.duplicateLesson();
  await lsCommonTest.searchList(newLessonName);
  await page.screenshot({ path: "playwright/screenshot/duplicate-lesson1-1.png" });
  await lsCommonTest.openHyperlink(newLessonName);
  await createLesson.addTeacher(LESSON_NAME.teacherRecurringGroup, { save: true, scope: "following" });
  await createLesson.addStudent("[E2E] Kim Ngan Student JZh5Zu", { save: true, scope: "following" });
  await loginBO(page, "full");
  await boLesson.filterLessonBO({ option: "teacher", lessonType: "recurringGroup" });
  await boLesson.filterLessonBO({ option: "lessonDate", lessonType: "recurringGroup" });
  await boLesson.filterLessonBO({ option: "lessonStatus", lessonStatus: "Draft" });
  await boLesson.searchStudent("[E2E] Kim Ngan Student JZh5Zu");
  await page.screenshot({ path: "playwright/screenshot/duplicate-lesson1-2.png" });
});

test("Duplicate recurring group lesson to one time individual", async ({ page }) => {
  const createLesson = new CreateLesson(page);
  const { lessonName, lessonCode, lessonDate } = await createLesson.createLesson("recurringGroup");
  const lsCommonTest = new LsCommonTest(page);
  const boLesson = new BOLesson(page);
  const showMessage = new MessageLesson(page);

  await lsCommonTest.searchList(lessonName);
  await lsCommonTest.openHyperlink(lessonName);
  const { newLessonName } = await createLesson.duplicateLesson("oneTimeIndividual");
  await showMessage.duplicateLesson();
  await lsCommonTest.searchList(newLessonName);
  await page.screenshot({ path: "playwright/screenshot/duplicate-lesson2-1.png" });
  await lsCommonTest.openHyperlink(newLessonName);
  await createLesson.addTeacher(LESSON_NAME.teacherOneTimeIndividual);
  await createLesson.addStudent("[E2E] Kim Ngan Student JZh5Zu");
  await loginBO(page, "full");
  await boLesson.filterLessonBO({ option: "teacher", lessonType: "oneTimeIndividual" });
  await boLesson.filterLessonBO({ option: "lessonDate", lessonType: "recurringGroup" });
  await boLesson.filterLessonBO({ option: "lessonStatus", lessonStatus: "Draft" });
  await boLesson.searchStudent("[E2E] Kim Ngan Student JZh5Zu");
  await page.screenshot({ path: "playwright/screenshot/duplicate-lesson2-2.png" });
});
