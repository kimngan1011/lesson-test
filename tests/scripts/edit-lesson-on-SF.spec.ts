import { test } from "../../playwright/fixtures";
import { CreateLesson } from "../pages/create-lesson";
import { LsCommonTest } from "../pages/common-test";
import { loginBO } from "../sf-login-page";
import { BOLesson } from "../pages/bo-lesson";
import { EditLesson } from "../pages/edit-lesson";
import { LESSON_NAME } from "../utils/masterData";

test("Edit one time individual lesson info", async ({ page }) => {
  const createLesson = new CreateLesson(page);
  const { lessonName, lessonCode, lessonDate } = await createLesson.createLesson("oneTimeIndividual"); // create one-time individual lesson
  const editLesson = new EditLesson(page);
  const lsCommonTest = new LsCommonTest(page);
  const boLesson = new BOLesson(page);

  await lsCommonTest.searchList(lessonName);
  await lsCommonTest.openHyperlink(lessonName);
  const { newLessonCode } = await editLesson.editLesson("oneTime");
  await createLesson.addTeacher(LESSON_NAME.teacherOneTimeIndividual);
  await editLesson.checkLessonInfoSF();
  await loginBO(page, "full");
  await boLesson.filterLessonBO({ option: "teacher", lessonType: "oneTimeIndividual" });
  await boLesson.filterLessonBO({ option: "lessonDate", lessonType: "oneTimeIndividual" });
  await editLesson.checkLessonCodeBO("oneTime", newLessonCode);
  await boLesson.openLessonDetail(true);
  await page.screenshot({ path: "playwright-report/screenshot" });
  await editLesson.checkLessonInfoBO("oneTimeIndividual");
  await lsCommonTest.redirectToTab("Student");
  await lsCommonTest.redirectToTab("Report");
  // check lesson name, date, time, classroom, lesson capacity, teaching medium
});

test("Edit recurring individual lesson info with only this lesson", async ({ page }) => {
  const createLesson = new CreateLesson(page);
  const { lessonName, lessonCode, lessonDate } = await createLesson.createLesson("recurringIndividual"); // create recurring group lesson
  const editLesson = new EditLesson(page);
  const lsCommonTest = new LsCommonTest(page);
  const boLesson = new BOLesson(page);

  await lsCommonTest.searchList(lessonName);
  await lsCommonTest.openHyperlink(lessonName);
  const { newLessonCode } = await editLesson.editLesson("recurring", "only");
  await editLesson.checkLessonInfoSF();
  await createLesson.addTeacher(LESSON_NAME.teacherRecurringIndividual, { save: true });
  await createLesson.checkLessonScheduleInfo("updated");
  await page.screenshot({ path: "playwright/screenshot/edit-lesson2.1.png" });
  await loginBO(page, "full");
  await boLesson.filterLessonBO({ option: "teacher", lessonType: "recurringIndividual" });
  await boLesson.filterLessonBO({ option: "lessonDate", lessonType: "recurringGroup" });
  await boLesson.filterLessonBO({ option: "lessonStatus", lessonStatus: "Draft" });
  await editLesson.checkLessonCodeBO("oneTime", newLessonCode);
  await page.screenshot({ path: "playwright/screenshot/edit-lesson2.2.png" });
  await boLesson.openLessonDetail(true);
  await page.screenshot({ path: "playwright/screenshot/edit-lesson2.3.png" });
  await editLesson.checkLessonInfoBO("recurringIndividual");
  await lsCommonTest.redirectToTab("Student");
  await lsCommonTest.redirectToTab("Report");
});

test("Edit recurring group lesson info with this and the following", async ({ page }) => {
  const createLesson = new CreateLesson(page);
  const { lessonName, lessonCode, lessonDate } = await createLesson.createLesson("recurringGroup"); // create recurring group lesson
  const editLesson = new EditLesson(page);
  const lsCommonTest = new LsCommonTest(page);
  const boLesson = new BOLesson(page);

  await lsCommonTest.searchList(lessonName);
  await lsCommonTest.openHyperlink(lessonName);
  const { newLessonCode } = await editLesson.editLesson("recurring", "following");
  await editLesson.checkLessonInfoSF();
  await createLesson.addTeacher(LESSON_NAME.teacherRecurringGroup, { save: true, scope: "following" });
  await createLesson.addStudent("[E2E] Kim Ngan Student RgXVzA", { save: true, scope: "following" });
  await createLesson.checkLessonScheduleInfo(LESSON_NAME.teacherRecurringGroup);
  await page.screenshot({ path: "playwright/screenshot/edit-lesson3.1.png" });
  await loginBO(page, "full");
  await boLesson.filterLessonBO({ option: "teacher", lessonType: "recurringGroup" });
  await boLesson.filterLessonBO({ option: "lessonDate", lessonType: "recurringGroup" });
  await boLesson.filterLessonBO({ option: "lessonStatus", lessonStatus: "Draft" });
  await boLesson.searchStudent("[E2E] Kim Ngan Student RgXVzA");
  await editLesson.checkLessonCodeBO("recurring", newLessonCode);
  await page.screenshot({ path: "playwright/screenshot/edit-lesson3.2.png" });
  await boLesson.openLessonDetail(true);
  await page.screenshot({ path: "playwright/screenshot/edit-lesson3.3.png" });
  await editLesson.checkLessonInfoBO("recurringGroup");
  await lsCommonTest.redirectToTab("Student");
  await lsCommonTest.redirectToTab("Report");
});
