import { test } from "../../playwright/fixtures";
import { CreateLesson } from "../pages/create-lesson";
import { LsCommonTest } from "../pages/common-test";
import { CreateLessonAllocation } from "../pages/create-lesson-allocation";
import { LESSON_NAME } from "../utils/masterData";
import { BOLesson } from "../pages/bo-lesson";

test("Create recurring group lesson with student and teacher", async ({ page }) => {
  const createLessonAllocation = new CreateLessonAllocation(page);
  const { assignedLessonBefore, url } = await createLessonAllocation.openLADetail("1767");
  const createLesson = new CreateLesson(page);
  const { lessonName, lessonCode, lessonDate } = await createLesson.createLesson("recurringGroup"); // create recurring group lesson
  const lsCommonTest = new LsCommonTest(page);

  await lsCommonTest.searchList(lessonName);
  const lessonCodeInfo = await createLesson.checkLessonCode("recurring", lessonCode);
  await page.screenshot({ path: "playwright/screenshot/create-recurring-group-lesson.png" });
  await lsCommonTest.openHyperlink(lessonName);
  await createLesson.addTeacher(LESSON_NAME.teacherRecurringGroup, { save: true, scope: "following" }); // add a teacher with following option
  await createLesson.addStudent("[E2E] Kim Ngan Student JZh5Zu", { save: true, scope: "following" }); // add a student with following option
  await createLesson.checkStudentSessionInfo("Student Sessions(1)");
  await createLesson.checkLessonTeacher("Lesson Teachers(1)");
  await lsCommonTest.redirectToTab("Report");
  await createLesson.checkLessonReportInfo("Teaching MethodGroup");
  await createLesson.checkLessonReportInfo("Lesson Report StatusDraft");

  await page.goto(url);
  const lessonAssigneddAfter = (await createLesson.getLessonAllocatedAfter()) as string;
  const lessonAssigned = await createLesson.increaseAssignedLessonRecurring(
    assignedLessonBefore ?? "",
    lessonAssigneddAfter
  );

  console.log(lessonAssigned, lessonCodeInfo);
});

test("Create recurring individual lesson with student and teacher", async ({ page }) => {
  const createLessonAllocation = new CreateLessonAllocation(page);
  const { assignedLessonBefore, url } = await createLessonAllocation.openLADetail("1767");
  const createLesson = new CreateLesson(page);
  const { lessonName, lessonCode, lessonDate } = await createLesson.createLesson("recurringIndividual"); // create recurring individual lesson
  const lsCommonTest = new LsCommonTest(page);

  await lsCommonTest.searchList(lessonName);
  const lessonCodeInfo = await createLesson.checkLessonCode("recurring", lessonCode);
  await page.screenshot({ path: "playwright/screenshot/create-recurring-individual-lesson.png" });
  await lsCommonTest.openHyperlink(lessonName);
  await createLesson.addTeacher(LESSON_NAME.teacherRecurringIndividual, { save: true }); // add a teacher with only option
  await createLesson.addStudent("[E2E] Kim Ngan Student JZh5Zu", { save: true }); // add a student with only option
  await createLesson.checkStudentSessionInfo("Student Sessions(1)");
  await createLesson.checkLessonTeacher("Lesson Teachers(1)");
  await lsCommonTest.redirectToTab("Report");
  await createLesson.checkLessonReportInfo("Teaching MethodIndividual");
  await createLesson.checkLessonReportInfo("Lesson Report StatusDraft");
  await lsCommonTest.redirectToTab("Participants"); // check LA info

  await page.goto(url);
  const lessonAssigneddAfter = (await createLesson.getLessonAllocatedAfter()) as string;
  const lessonAssigned = await createLesson.increaseAssignedLessonOneTime(
    assignedLessonBefore ?? "",
    lessonAssigneddAfter
  );

  console.log(lessonAssigned, lessonCodeInfo);
});
