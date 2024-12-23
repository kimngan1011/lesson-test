import { test } from "../../playwright/fixtures";
import { BOLesson } from "../pages/bo-lesson";
import { LsCommonTest } from "../pages/common-test";
import { CreateLesson } from "../pages/create-lesson";
import { CreateLessonAllocation } from "../pages/create-lesson-allocation";
import { EditLesson } from "../pages/edit-lesson";
import { MessageLesson } from "../pages/message";
import { loginBO } from "../sf-login-page";
import { LESSON_NAME } from "../utils/masterData";

test("Remove student and teacher from one-time individual lesson", async ({ page }) => {
  const createLessonAllocation = new CreateLessonAllocation(page);
  const { assignedLessonBefore, url } = await createLessonAllocation.openLADetail("783");
  const createLesson = new CreateLesson(page);
  const { lessonName, lessonCode, lessonDate } = await createLesson.createLesson("oneTimeIndividual"); // create one-time individual lesson
  const boLesson = new BOLesson(page);
  const editLesson = new EditLesson(page);
  const showMessage = new MessageLesson(page);
  const lsCommonTest = new LsCommonTest(page);

  await lsCommonTest.searchList(lessonName);
  await lsCommonTest.openHyperlink(lessonName);
  await createLesson.addTeacher(LESSON_NAME.teacherOneTimeIndividual);
  await createLesson.addStudent("[E2E] Kim Ngan Student RgXVzA");
  await editLesson.removeStudent();
  await showMessage.removeStudentSF();
  await createLesson.checkStudentSessionInfo("Student Sessions(0)");
  await editLesson.removeTeacher();
  await showMessage.removeTeacherSF();
  await createLesson.checkLessonTeacher("Lesson Teachers(0)");
  await lsCommonTest.openLCDetail();

  await page.goto(url);
  const lessonAssigneddAfter = (await createLesson.getLessonAllocatedAfter()) as string;
  const lessonAssigned = await createLesson.decreaseAssignedLesson1(assignedLessonBefore ?? "", lessonAssigneddAfter);

  await loginBO(page, "full");
  await boLesson.searchStudent("[E2E] Kim Ngan Student RgXVzA");
  await page.screenshot({ path: "playwright/screenshot/remove-student-teacher-1.png" });

  console.log(lessonAssigned);
});

test("Remove student and teacher from recurring individual lesson with only this lesson", async ({ page }) => {
  const createLessonAllocation = new CreateLessonAllocation(page);
  const { assignedLessonBefore, url } = await createLessonAllocation.openLADetail("783");
  const createLesson = new CreateLesson(page);
  const { lessonName, lessonCode, lessonDate } = await createLesson.createLesson("recurringIndividual"); // create one-time individual lesson
  const boLesson = new BOLesson(page);
  const editLesson = new EditLesson(page);
  const showMessage = new MessageLesson(page);
  const lsCommonTest = new LsCommonTest(page);

  await lsCommonTest.searchList(lessonName);
  await lsCommonTest.openHyperlink(lessonName);
  await createLesson.addTeacher(LESSON_NAME.teacherRecurringIndividual, { save: true, scope: "following" });
  await createLesson.addStudent("[E2E] Kim Ngan Student RgXVzA", { save: true, scope: "following" });
  await editLesson.removeStudent({ save: true });
  await showMessage.removeStudentSF();
  await createLesson.checkStudentSessionInfo("Student Sessions(0)");
  await editLesson.removeTeacher({ save: true });
  await showMessage.removeTeacherSF();
  await createLesson.checkLessonTeacher("Lesson Teachers(0)");
  await lsCommonTest.openLCDetail();

  await page.goto(url);
  const lessonAssigneddAfter = (await createLesson.getLessonAllocatedAfter()) as string;
  const lessonAssigned = await createLesson.decreaseAssignedLesson1(assignedLessonBefore ?? "", lessonAssigneddAfter);

  await loginBO(page, "full");
  await boLesson.searchStudent("[E2E] Kim Ngan Student RgXVzA");
  await page.screenshot({ path: "playwright/screenshot/remove-student-teacher-2.png" });

  console.log(lessonAssigned);
});

test("Remove student and teacher from recurring group lesson with following lessons", async ({ page }) => {
  const createLessonAllocation = new CreateLessonAllocation(page);
  const { assignedLessonBefore, url } = await createLessonAllocation.openLADetail("783");
  const createLesson = new CreateLesson(page);
  const { lessonName, lessonCode, lessonDate } = await createLesson.createLesson("recurringGroup"); // create one-time individual lesson
  const boLesson = new BOLesson(page);
  const editLesson = new EditLesson(page);
  const showMessage = new MessageLesson(page);
  const lsCommonTest = new LsCommonTest(page);

  await lsCommonTest.searchList(lessonName);
  await lsCommonTest.openHyperlink(lessonName);
  await createLesson.addTeacher(LESSON_NAME.teacherRecurringIndividual, { save: true, scope: "following" });
  await createLesson.addStudent("[E2E] Kim Ngan Student RgXVzA", { save: true, scope: "following" });
  await editLesson.removeStudent({ save: true, scope: "following" });
  await showMessage.removeStudentSF();
  await createLesson.checkStudentSessionInfo("Student Sessions(0)");
  await editLesson.removeTeacher({ save: true, scope: "following" });
  await showMessage.removeTeacherSF();
  await createLesson.checkLessonTeacher("Lesson Teachers(0)");
  await lsCommonTest.openLCDetail();

  await page.goto(url);
  const lessonAssigneddAfter = (await createLesson.getLessonAllocatedAfter()) as string;
  const lessonAssigned = await createLesson.decreaseAssignedLesson5(assignedLessonBefore ?? "", lessonAssigneddAfter);

  await loginBO(page, "full");
  await boLesson.searchStudent("[E2E] Kim Ngan Student RgXVzA");
  await page.screenshot({ path: "playwright/screenshot/remove-student-teacher-3.png" });

  console.log(lessonAssigned);
});
