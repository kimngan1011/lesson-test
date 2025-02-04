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
  await createLesson.addStudent("[E2E] Kim Ngan Student 5qta6d");
  await createLesson.checkLessonScheduleInfo(newLessonCode);
  await page.screenshot({ path: "playwright/screenshot/edit-one-time-individual-lesson1.1.png" });
  // await editLesson.checkLessonInfoSF();
  await loginBO(page, "full");
  await boLesson.filterLessonBO({ option: "teacher", lessonType: "oneTimeIndividual" });
  await boLesson.filterLessonBO({ option: "lessonDate", lessonType: "oneTimeIndividual" });
  await boLesson.filterLessonBO({ option: "lessonStatus", lessonStatus: "Draft" });
  await boLesson.searchStudent("[E2E] Kim Ngan Student 5qta6d");
  await editLesson.checkLessonCodeBO("oneTime", newLessonCode);
  await page.screenshot({ path: "playwright/screenshot/edit-one-time-individual-lesson1.2.png" });
  await boLesson.openLessonDetail();
  await editLesson.checkLessonInfoBO("oneTimeIndividual");
  await page.screenshot({ path: "playwright/screenshot/edit-one-time-individual-lesson1.3.png" });
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
  // await editLesson.checkLessonInfoSF();
  await createLesson.addTeacher(LESSON_NAME.teacherRecurringIndividual, { save: true });
  await createLesson.addStudent("[E2E] Kim Ngan Student 5qta6d", { save: true });
  await createLesson.checkLessonScheduleInfo(newLessonCode);
  await page.screenshot({ path: "playwright/screenshot/edit-recurring-individual-lesson2.1.png" });
  await loginBO(page, "full");
  await boLesson.filterLessonBO({ option: "teacher", lessonType: "recurringIndividual" });
  await boLesson.filterLessonBO({ option: "lessonDate", lessonType: "recurringGroup" });
  await boLesson.filterLessonBO({ option: "lessonStatus", lessonStatus: "Draft" });
  await boLesson.searchStudent("[E2E] Kim Ngan Student 5qta6d");
  await editLesson.checkLessonCodeBO("oneTime", newLessonCode);
  await page.screenshot({ path: "playwright/screenshot/edit-recurring-individual-lesson2.2.png" });
  await boLesson.openLessonDetail();
  await editLesson.checkLessonInfoBO("recurringIndividual");
  await page.screenshot({ path: "playwright/screenshot/edit-recurring-individual-lesson2.3.png" });
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
  // await editLesson.checkLessonInfoSF();
  await createLesson.addTeacher(LESSON_NAME.teacherRecurringGroup, { save: true, scope: "following" });
  await createLesson.addStudent("[E2E] Kim Ngan Student 5qta6d", { save: true, scope: "following" });
  await createLesson.checkLessonScheduleInfo(newLessonCode);
  await page.screenshot({ path: "playwright/screenshot/edit-recurring-group-lesson3.1.png" });
  await loginBO(page, "full");
  await boLesson.filterLessonBO({ option: "teacher", lessonType: "recurringGroup" });
  await boLesson.filterLessonBO({ option: "lessonDate", lessonType: "recurringGroup" });
  await boLesson.filterLessonBO({ option: "lessonStatus", lessonStatus: "Draft" });
  await boLesson.searchStudent("[E2E] Kim Ngan Student 5qta6d");
  await editLesson.checkLessonCodeBO("recurring", newLessonCode);
  await page.screenshot({ path: "playwright/screenshot/edit-recurring-group-lesson3.2.png" });
  await boLesson.openLessonDetail();
  await editLesson.checkLessonInfoBO("recurringGroup");
  await page.screenshot({ path: "playwright/screenshot/edit-recurring-group-lesson3.3.png" });
  await lsCommonTest.redirectToTab("Student");
  await lsCommonTest.redirectToTab("Report");
});
