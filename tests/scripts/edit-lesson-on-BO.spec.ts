import { test } from "../../playwright/fixtures";
import { LsCommonTest } from "../pages/common-test";
import { loginBO } from "../sf-login-page";
import { MessageLesson } from "../pages/message";
import { randomText } from "../utils/random";
import { LESSON_URL } from "../utils/url";
import { BOLesson } from "../pages/bo-lesson";
import { CreateLesson } from "../pages/create-lesson";

test("Edit, Publish and Collect Attendance = Attend for one time individual lesson on BO", async ({ page }) => {
  const boLesson = new BOLesson(page);
  const showMessage = new MessageLesson(page);
  const lsCommonTest = new LsCommonTest(page);
  const lessonName = randomText(10);
  const checkLCInfo = new CreateLesson(page);

  await loginBO(page, "full");
  await boLesson.filterLessonBO({ option: "teacher", lessonType: "oneTimeIndividual" });
  await boLesson.searchStudent("[E2E] Kim Ngan Student 5qta6d");
  await boLesson.publishLessonOnBO();
  await boLesson.filterLessonBO({ option: "lessonStatus", lessonStatus: "Published" });
  await boLesson.openLessonDetail();
  await boLesson.editLesson(lessonName, "oneTimeIndividual");
  console.log(lessonName);
  await showMessage.editLessonBO();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "playwright/screenshot/edit-one-time-individual-lesson-BO1.1.png" });
  await boLesson.checkUpdatedLessonInfo(lessonName, "oneTimeIndividual");
  await boLesson.collectAttendanceOnBO("attend");
  await showMessage.collectAttendaneBO();
  await page.waitForTimeout(15000);
  await lsCommonTest.navigateToPage(LESSON_URL.lesson);
  await lsCommonTest.searchList(lessonName);
  await page.screenshot({ path: "playwright/screenshot/edit-one-time-individual-lesson-BO1.2.png" });
  await lsCommonTest.openHyperlink(lessonName);
  await boLesson.checkAttendAndLate("Attend");
  await checkLCInfo.checkLessonScheduleInfo("Published");
});

test("Edit, Publish and Collect Attendance = Late for recurring individual lesson with this and the following on BO", async ({
  page,
}) => {
  const boLesson = new BOLesson(page);
  const showMessage = new MessageLesson(page);
  const lsCommonTest = new LsCommonTest(page);
  const lessonName = randomText(10);
  const checkLCInfo = new CreateLesson(page);

  await loginBO(page, "full");
  await boLesson.filterLessonBO({ option: "teacher", lessonType: "recurringIndividual" });
  await boLesson.searchStudent("[E2E] Kim Ngan Student 5qta6d");
  await boLesson.publishLessonOnBO();
  await boLesson.filterLessonBO({ option: "lessonStatus", lessonStatus: "Published" });
  await boLesson.openLessonDetail();
  await boLesson.editLesson(lessonName, "recurringGroup", "only");
  await showMessage.editLessonBO();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "playwright/screenshot/edit-recurring-individual-lesson-BO1.1.png" });
  await boLesson.checkUpdatedLessonInfo(lessonName, "recurringIndividual");
  await boLesson.collectAttendanceOnBO("late");
  await showMessage.collectAttendaneBO();
  await page.waitForTimeout(15000);
  await lsCommonTest.navigateToPage(LESSON_URL.lesson);
  await lsCommonTest.searchList(lessonName);
  await page.screenshot({ path: "playwright/screenshot/edit-recurring-individual-lesson-BO1.2.png" });
  await lsCommonTest.openHyperlink(lessonName);
  await boLesson.checkAttendAndLate("Late");
  await checkLCInfo.checkLessonScheduleInfo("Published");
});

test("Edit, Publish and Collect Attendance = Absent for recurring group lesson with only this lesson on BO", async ({
  page,
}) => {
  const boLesson = new BOLesson(page);
  const showMessage = new MessageLesson(page);
  const lsCommonTest = new LsCommonTest(page);
  const lessonName = randomText(10);
  const checkLCInfo = new CreateLesson(page);

  await loginBO(page, "full");
  await boLesson.filterLessonBO({ option: "teacher", lessonType: "recurringGroup" });
  await boLesson.searchStudent("[E2E] Kim Ngan Student 5qta6d");
  await boLesson.publishLessonOnBO();
  await boLesson.filterLessonBO({ option: "lessonStatus", lessonStatus: "Published" });
  await boLesson.openLessonDetail();
  await boLesson.editLesson(lessonName, "recurringGroup", "following");
  await showMessage.editLessonBO();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "playwright/screenshot/edit-recurring-group-lesson-BO1.1.png" });
  await boLesson.checkUpdatedLessonInfo(lessonName, "recurringGroup");
  await boLesson.collectAttendanceOnBO("absent");
  await showMessage.collectAttendaneBO();
  await page.waitForTimeout(15000);
  await lsCommonTest.navigateToPage(LESSON_URL.lesson);
  await lsCommonTest.searchList(lessonName);
  await page.screenshot({ path: "playwright/screenshot/edit-recurring-group-lesson-BO1.2.png" });
  await lsCommonTest.openHyperlink(lessonName);
  await boLesson.checkAbsent("Absent", "Family Reasons", "On The Day");
  await checkLCInfo.checkLessonScheduleInfo("Published");
});

test("Edit, Publish and Collect Attendance = allAttend for one time group lesson on BO", async ({ page }) => {
  const boLesson = new BOLesson(page);
  const showMessage = new MessageLesson(page);
  const lsCommonTest = new LsCommonTest(page);
  const lessonName = randomText(10);
  const checkLCInfo = new CreateLesson(page);

  await loginBO(page, "full");
  await boLesson.filterLessonBO({ option: "teacher", lessonType: "oneTimeGroup" });
  await boLesson.searchStudent("[E2E] Kim Ngan Student 5qta6d");
  await boLesson.publishLessonOnBO();
  await boLesson.filterLessonBO({ option: "lessonStatus", lessonStatus: "Published" });
  await boLesson.openLessonDetail();
  await boLesson.editLesson(lessonName, "oneTimeIndividual");
  await showMessage.editLessonBO();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "playwright/screenshot/edit-one-time-group-lesson-BO1.1.png" });
  await boLesson.checkUpdatedLessonInfo(lessonName, "oneTimeGroup");
  await boLesson.collectAttendanceOnBO("allAttend");
  await showMessage.collectAttendaneBO();
  await page.waitForTimeout(15000);
  await lsCommonTest.navigateToPage(LESSON_URL.lesson);
  await lsCommonTest.searchList(lessonName);
  await page.screenshot({ path: "playwright/screenshot/edit-one-time-group-lesson-BO1.2.png" });
  await lsCommonTest.openHyperlink(lessonName);
  await boLesson.checkAttendAndLate("Attend");
  await checkLCInfo.checkLessonScheduleInfo("Published");
});
