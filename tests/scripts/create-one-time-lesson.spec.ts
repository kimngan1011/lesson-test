import { test } from "../../playwright/fixtures";
import { CreateLesson } from "../pages/create-lesson";
import { LsCommonTest } from "../pages/common-test";
import { loginBO } from "../sf-login-page";
import { CreateLessonAllocation } from "../pages/create-lesson-allocation";
import { LESSON_NAME } from "../utils/masterData";
import { BOLesson } from "../pages/bo-lesson";

test('Create one time individual lesson with student and teacher', async ({ page }) => {
    const createLessonAllocation = new CreateLessonAllocation(page);
    const lessonAllocationName = await createLessonAllocation.createLessonAllocation(); // create LA
    const createLesson = new CreateLesson(page);
    const individualLessonName = await createLesson.createLesson('oneTimeIndividual'); // create one-time individual lesson
    const lsCommonTest = new LsCommonTest(page);
    const boLesson = new BOLesson(page);

    await lsCommonTest.searchList(individualLessonName); // open lesson detail
    await createLesson.addTeacher(LESSON_NAME.teacherOneTime); // add student
    await createLesson.addStudent(lessonAllocationName); // add teacher
    await createLesson.checkStudentSessionInfo('Student Sessions(1)');
    await createLesson.checkLessonTeacher('Lesson Teachers(1)');
    await lsCommonTest.redirectToTab('Report'); // check report info
    await createLesson.checkLessonReportInfo('Teaching MethodIndividual');
    await createLesson.checkLessonReportInfo('Lesson Report StatusDraft');
    await lsCommonTest.redirectToTab('Participants'); // check LA info
    await createLesson.checkStudentSession(lessonAllocationName, '1/90 Lesson Allocated');
    await loginBO(page, 'full'); // login BO
    await boLesson.searchStudent(lessonAllocationName); // check lesson info on BO
    await boLesson.openLessonDetail();
    await createLesson.checkLessonInfo(individualLessonName, 'oneTimeIndividual');
    await lsCommonTest.redirectToTab ('Student');
    await lsCommonTest.redirectToTab ('Report');
});

test('Create one time group lesson with student and teacher', async ({ page }) => {
    const createLessonAllocation = new CreateLessonAllocation(page);
    const lessonAllocationName = await createLessonAllocation.createLessonAllocation(); // create LA
    const createLesson = new CreateLesson(page);
    const grouplLessonName = await createLesson.createLesson('oneTimeGroup'); // create one-time group lesson
    const lsCommonTest = new LsCommonTest(page);
    const boLesson = new BOLesson(page);

    await lsCommonTest.searchList(grouplLessonName); // open lesson detail
    await createLesson.addTeacher(LESSON_NAME.teacherOneTime); // add student
    await createLesson.addStudent(lessonAllocationName); // add teacher
    await createLesson.checkStudentSessionInfo('Student Sessions(1)');
    await createLesson.checkLessonTeacher('Lesson Teachers(1)');
    await lsCommonTest.redirectToTab('Report'); // check report info
    await createLesson.checkLessonReportInfo('Teaching MethodGroup');
    await createLesson.checkLessonReportInfo('Lesson Report StatusDraft');
    await lsCommonTest.redirectToTab('Participants'); // check LA info
    await createLesson.checkStudentSession(lessonAllocationName, '1/90 Lesson Allocated');
    await loginBO(page, 'full'); // login BO
    await boLesson.searchStudent(lessonAllocationName); // check lesson info on BO
    await boLesson.openLessonDetail();
    await createLesson.checkLessonInfo(grouplLessonName, 'oneTimeGroup');
    await lsCommonTest.redirectToTab ('Student');
    await lsCommonTest.redirectToTab ('Report');
});