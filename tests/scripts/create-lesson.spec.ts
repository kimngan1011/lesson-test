import { test } from "../../playwright/fixtures";
import { CreateLesson } from "../pages/create-lesson";
import { LsCommonTest } from "../pages/common-test";
import { loginBO } from "../sf-login-page";
import { CreateLessonAllocation } from "../pages/create-lesson-allocation";
import { LESSON_URL } from "../utils/url";

test("create-one-time-individual-lessons", async ({ page }) => {
    const createLessonAllocation = new CreateLessonAllocation(page);
    const lessonAllocationName = await createLessonAllocation.createLessonAllocation();
    const createLesson = new CreateLesson(page);
    const individualLessonName = await createLesson.createOneTimeIndividualLesson();
    const lsCommonTest = new LsCommonTest(page);
    await lsCommonTest.searchList(individualLessonName);
    await createLesson.addStudent(lessonAllocationName);
    await lsCommonTest.redirectToTab('Report');
    await createLesson.checkLessonReportInfo('Teaching MethodIndividual');
    await createLesson.checkLessonReportInfo('Lesson Report StatusDraft');
});


