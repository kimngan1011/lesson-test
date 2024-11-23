import { test } from "../../playwright/fixtures";
import { CreateLesson } from "../pages/create-lesson";
import { LsCommonTest } from "../pages/common-test";
import { loginBO } from "../sf-login-page";
import { CreateLessonAllocation } from "../pages/create-lesson-allocation";
import { LESSON_URL } from "../utils/url";
import { LESSON_NAME } from "../utils/masterData";
import { BOLesson } from "../pages/bo-lesson";

test("create-one-time-individual-lessons-with-student-teacher", async ({ page }) => {
    const createLessonAllocation = new CreateLessonAllocation(page);
    const lessonAllocationName = await createLessonAllocation.createLessonAllocation();
    const createLesson = new CreateLesson(page);
    const individualLessonName = await createLesson.createOneTimeIndividualLesson();
    const lsCommonTest = new LsCommonTest(page);
    const boLesson = new BOLesson(page);
    await lsCommonTest.searchList(individualLessonName); // open lesson detail
    await createLesson.addTeacher(LESSON_NAME.teacher); // add student
    await createLesson.addStudent(lessonAllocationName); // add teacher
    await lsCommonTest.redirectToTab('Report'); // check report info
    await createLesson.checkLessonReportInfo('Teaching MethodIndividual');
    await createLesson.checkLessonReportInfo('Lesson Report StatusDraft');
    await lsCommonTest.redirectToTab('Participants'); // check LA info
    await createLesson.checkStudentSession(lessonAllocationName);
    await loginBO(page, 'full'); // login BO
    await boLesson.searchStudent(lessonAllocationName); // check lesson info on BO
    await boLesson.openLessonDetail();
    await page.waitForTimeout(5000);
    await lsCommonTest.redirectToTab ('Student');
    await lsCommonTest.redirectToTab ('Report');
});


