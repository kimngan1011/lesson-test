import { test } from "../../playwright/fixtures";
import { BOLesson } from "../pages/bo-lesson";
import { LsCommonTest } from "../pages/common-test";
import { CreateLesson } from "../pages/create-lesson";
import { CreateLessonAllocation } from "../pages/create-lesson-allocation";
import { EditLesson } from "../pages/edit-lesson";
import { MessageLesson } from "../pages/message";
import { loginBO } from "../sf-login-page";
import { LESSON_NAME } from "../utils/masterData";

test("Change lesson status", async ({ page }) => {
  const createLessonAllocation = new CreateLessonAllocation(page);
  const lessonAllocationName = await createLessonAllocation.createLessonAllocation();
  const createLesson = new CreateLesson(page);
  const groupLessonName = await createLesson.createLesson("recurringGroup");
  const lsCommonTest = new LsCommonTest(page);
  const editLesson = new EditLesson(page);
  const showMessage = new MessageLesson(page);
  const boLesson = new BOLesson(page);

  await lsCommonTest.searchList(groupLessonName);
  await lsCommonTest.openRecurringLesson(groupLessonName);
  await editLesson.updateLessonStatus("draftToPublished");
  await showMessage.changeLessonStatus();
  await createLesson.addTeacher(LESSON_NAME.teacherRecurringGroup, { save: true, scope: "following" });
  await createLesson.addStudent(lessonAllocationName, { save: true, scope: "following" });
  await editLesson.updateAttendanceInfo("attend");
  await editLesson.updateLessonStatus("publishedToCompleted");
  await showMessage.changeLessonStatus();
  await editLesson.updateLessonStatus("completedToPublished");
  await editLesson.updateCancellationReason();
  await editLesson.updateLessonStatus("publishedToCancelled");
  await showMessage.changeLessonStatus();
  await editLesson.updateLessonStatus("cancelledToDraft");
  await showMessage.changeLessonStatus();
  await editLesson.updateLessonStatus("draftToPublished");
  await showMessage.changeLessonStatus();
  await editLesson.updateLessonStatus("publishedToDraft");
  await showMessage.changeLessonStatus();
  await editLesson.updateLessonStatus("draftToCancelled");
  await showMessage.changeLessonStatus();
  await createLesson.checkLessonScheduleInfo("Cancelled");
  await loginBO(page, "full"); // login BO
  await boLesson.searchStudent(lessonAllocationName);
  await page.getByText("Cancelled").click();
});

test("Bulk update lesson status to Completed", async ({ page }) => {
  const createLessonAllocation = new CreateLessonAllocation(page);
  const lessonAllocationName = await createLessonAllocation.createLessonAllocation();
  const createLesson = new CreateLesson(page);
  const groupLessonName = await createLesson.createLesson("recurringGroup");
  const lsCommonTest = new LsCommonTest(page);
  const editLesson = new EditLesson(page);
  const showMessage = new MessageLesson(page);
  const boLesson = new BOLesson(page);

  await page.waitForSelector(".toastContent", { state: "hidden" });
  await lsCommonTest.searchList(groupLessonName);
  await lsCommonTest.openRecurringLesson(groupLessonName);
  await editLesson.updateLessonStatus("draftToPublished");
  await createLesson.addTeacher(LESSON_NAME.teacherRecurringGroup, {
    save: true,
    scope: "following",
  });
  await createLesson.addStudent("Kim Ngan", { save: true, scope: "following" });
  await editLesson.updateAttendanceInfo("attend");
  await lsCommonTest.openHyperlink("Lessons");
  await lsCommonTest.selectItemLessonList("singleSelect");
  await editLesson.bulkUpdateLessonStatus("Published", "Completed", {
    OK: true,
  });
  await showMessage.bulkUpdateLessonStatus();
  await lsCommonTest.selectItemLessonList("selectAll");
  await editLesson.bulkUpdateLessonStatus("--None--", "Published");
  await showMessage.bulkUpdateLessonStatus();
  await editLesson.checkLessonStatus("Published");
  await loginBO(page, "full");
  await boLesson.searchStudent(lessonAllocationName);
  await page.getByText("Published").click();
});

test("Bulk update lesson status to Cancelled", async ({ page }) => {
  const createLesson = new CreateLesson(page);
  const groupLessonName = await createLesson.createLesson("recurringGroup");
  const lsCommonTest = new LsCommonTest(page);
  const editLesson = new EditLesson(page);
  const showMessage = new MessageLesson(page);

  await page.waitForSelector(".toastContent", { state: "hidden" });
  await lsCommonTest.searchList(groupLessonName);
  await lsCommonTest.openRecurringLesson(groupLessonName);
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
  await editLesson.checkLessonStatus("Cancelled");
});
