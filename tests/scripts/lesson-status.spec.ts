import { test } from "../../playwright/fixtures";
import { BOLesson } from "../pages/bo-lesson";
import { LsCommonTest } from "../pages/common-test";
import { CreateLesson } from "../pages/create-lesson";
import { EditLesson } from "../pages/edit-lesson";
import { MessageLesson } from "../pages/message";
import { loginBO } from "../sf-login-page";
import { LESSON_NAME } from "../utils/masterData";

// test("Change lesson status in detailed lesson page", async ({ page }) => {
//   const createLesson = new CreateLesson(page);
//   const { lessonName, lessonCode, lessonDate } = await createLesson.createLesson("pastLesson");
//   const lsCommonTest = new LsCommonTest(page);
//   const editLesson = new EditLesson(page);
//   const showMessage = new MessageLesson(page);
//   const boLesson = new BOLesson(page);

//   await lsCommonTest.searchList(lessonName);
//   await lsCommonTest.openHyperlink(lessonName);
//   await editLesson.updateLessonStatus("draftToPublished");
//   await showMessage.changeLessonStatus();
//   await createLesson.addTeacher(LESSON_NAME.teacherRecurringGroup, { save: true, scope: "following" });
//   await createLesson.addStudent("[E2E] Kim Ngan Student JZh5Zu", { save: true, scope: "following" });
//   await editLesson.updateAttendanceInfo("attend");
//   await editLesson.updateLessonStatus("publishedToCompleted");
//   await showMessage.changeLessonStatus();
//   await editLesson.updateLessonStatus("completedToPublished");
//   await editLesson.updateCancellationReason();
//   await editLesson.updateLessonStatus("publishedToCancelled");
//   await showMessage.changeLessonStatus();
//   await editLesson.updateLessonStatus("cancelledToDraft");
//   await showMessage.changeLessonStatus();
//   await editLesson.updateLessonStatus("draftToPublished");
//   await showMessage.changeLessonStatus();
//   await editLesson.updateLessonStatus("publishedToDraft");
//   await showMessage.changeLessonStatus();
//   await editLesson.updateLessonStatus("draftToCancelled");
//   await showMessage.changeLessonStatus();
//   await createLesson.checkLessonScheduleInfo("Cancelled");
//   await page.screenshot({ path: "playwright/screenshot/change-lesson-status1.1.png" });
//   await loginBO(page, "full"); // login BO
//   await boLesson.filterLessonBO({ option: "lessonListView", lessonListView: "Past Lesson" });
//   await boLesson.filterLessonBO({ option: "teacher", lessonType: "recurringGroup" });
//   await boLesson.filterLessonBO({ option: "lessonStatus", lessonStatus: "Cancelled" });
//   await boLesson.searchStudent("[E2E] Kim Ngan Student JZh5Zu");
//   await page.getByText("Cancelled").first().click();
//   await page.screenshot({ path: "playwright/screenshot/change-lesson-status1.2.png" });
// });

test("Bulk update lesson status to Completed", async ({ page }) => {
  const createLesson = new CreateLesson(page);
  const { lessonName, lessonCode, lessonDate } = await createLesson.createLesson("pastLesson");
  const lsCommonTest = new LsCommonTest(page);
  const editLesson = new EditLesson(page);
  const showMessage = new MessageLesson(page);

  await page.waitForSelector(".toastContent", { state: "hidden" });
  await lsCommonTest.searchList(lessonName);
  await lsCommonTest.openHyperlink(lessonName);
  await editLesson.updateLessonStatus("draftToPublished");
  await createLesson.addTeacher(LESSON_NAME.teacherRecurringIndividual, {
    save: true,
    scope: "following",
  });
  await createLesson.addStudent("[E2E] Kim Ngan Student JZh5Zu", { save: true, scope: "following" });
  await editLesson.updateAttendanceInfo("attend");
  await lsCommonTest.openHyperlink("Lessons");
  await lsCommonTest.selectItemLessonList("singleSelect");
  await editLesson.bulkUpdateLessonStatus("Published", "Completed", {
    OK: true,
  });
  await showMessage.bulkUpdateLessonStatus();
  await page.screenshot({ path: "playwright/screenshot/bulk-update-lesson-status-to-completed1.1.png" });
  await lsCommonTest.selectItemLessonList("selectAll");
  await editLesson.bulkUpdateLessonStatus("--None--", "Published");
  await showMessage.bulkUpdateLessonStatus();
  // await editLesson.checkLessonStatus("Published");
  await page.screenshot({ path: "playwright/screenshot/bulk-update-lesson-status-to-completed1.2.png" });
});

test("Bulk update lesson status to Cancelled", async ({ page }) => {
  const createLesson = new CreateLesson(page);
  const { lessonName, lessonCode, lessonDate } = await createLesson.createLesson("pastLesson");
  const lsCommonTest = new LsCommonTest(page);
  const editLesson = new EditLesson(page);
  const showMessage = new MessageLesson(page);
  const boLesson = new BOLesson(page);

  await page.waitForSelector(".toastContent", { state: "hidden" });
  await lsCommonTest.searchList(lessonName);
  await lsCommonTest.openHyperlink(lessonName);
  await editLesson.updateCancellationReason();
  await lsCommonTest.openHyperlink("Lessons");
  await lsCommonTest.selectItemLessonList("selectAll");
  await editLesson.bulkUpdateLessonStatus("Draft", "Cancelled");
  await showMessage.bulkUpdateLessonStatus();
  await lsCommonTest.selectItemLessonList("selectAll");
  await editLesson.bulkUpdateLessonStatus("Cancelled", "Draft");
  await showMessage.bulkUpdateLessonStatus();
  await lsCommonTest.selectItemLessonList("selectAll");
  await editLesson.bulkUpdateLessonStatus("Draft", "Published");
  await showMessage.bulkUpdateLessonStatus();
  await lsCommonTest.selectItemLessonList("selectAll");
  await editLesson.bulkUpdateLessonStatus("Published", "Cancelled");
  await showMessage.bulkUpdateLessonStatus();
  // await editLesson.checkLessonStatus("Cancelled");
  await page.screenshot({ path: "playwright/screenshot/bulk-update-lesson-status-to-cancelled.png" });
});
