import { test } from "../../playwright/fixtures";
import { CreateLesson } from "../pages/create-lesson";
import { LsCommonTest } from "../pages/common-test";
import { CreateLessonAllocation } from "../pages/create-lesson-allocation";
import { LESSON_NAME } from "../utils/masterData";
import path from "path";

test("Create one time individual lesson with student and teacher", async ({ page }) => {
  const createLessonAllocation = new CreateLessonAllocation(page);
  const { assignedLessonBefore, url } = await createLessonAllocation.openLADetail("783");

  const createLesson = new CreateLesson(page);
  const { lessonName, lessonCode, lessonDate } = await createLesson.createLesson("oneTimeIndividual"); // create one-time individual lesson

  const lsCommonTest = new LsCommonTest(page);

  await lsCommonTest.searchList(lessonName); // open lesson detail
  await page.screenshot({ path: "lesson-info.png" });
  const lessonCodeInfo = await createLesson.checkLessonCode("oneTime", lessonCode);
  await lsCommonTest.openHyperlink(lessonName);
  await createLesson.addTeacher(LESSON_NAME.teacherOneTimeIndividual);
  await createLesson.addStudent("[E2E] Kim Ngan Student RgXVzA");
  await createLesson.checkStudentSessionInfo("Student Sessions(1)");
  await createLesson.checkLessonTeacher("Lesson Teachers(1)");
  await lsCommonTest.redirectToTab("Report"); // check report info
  await createLesson.checkLessonReportInfo("Teaching MethodIndividual");
  await createLesson.checkLessonReportInfo("Lesson Report StatusDraft");

  await page.goto(url);
  const lessonAssigneddAfter = (await createLesson.getLessonAllocatedAfter()) as string;
  const lessonAssigned = await createLesson.increaseAssignedLesson1(assignedLessonBefore ?? "", lessonAssigneddAfter);

  console.log(lessonAssigned, lessonCodeInfo);
});

test("Create one time group lesson with student and teacher", async ({ page }) => {
  const createLessonAllocation = new CreateLessonAllocation(page);
  const { assignedLessonBefore, url } = await createLessonAllocation.openLADetail("783"); // create LA
  const createLesson = new CreateLesson(page);
  const { lessonName, lessonCode, lessonDate } = await createLesson.createLesson("oneTimeGroup"); // create one-time group lesson
  const lsCommonTest = new LsCommonTest(page);

  await lsCommonTest.searchList(lessonName); // open lesson detail
  const lessonCodeInfo = await createLesson.checkLessonCode("oneTime", lessonCode);
  await lsCommonTest.openHyperlink(lessonName);
  await createLesson.addTeacher(LESSON_NAME.teacherOneTimeGroup);
  await createLesson.addStudent("[E2E] Kim Ngan Student RgXVzA");
  await createLesson.checkStudentSessionInfo("Student Sessions(1)");
  await createLesson.checkLessonTeacher("Lesson Teachers(1)");
  await lsCommonTest.redirectToTab("Report"); // check report info
  await createLesson.checkLessonReportInfo("Teaching MethodGroup");
  await createLesson.checkLessonReportInfo("Lesson Report StatusDraft");

  await page.goto(url);
  const lessonAssigneddAfter = (await createLesson.getLessonAllocatedAfter()) as string;
  const lessonAssigned = await createLesson.increaseAssignedLesson1(assignedLessonBefore ?? "", lessonAssigneddAfter);

  console.log(lessonAssigned, lessonCodeInfo);
});
