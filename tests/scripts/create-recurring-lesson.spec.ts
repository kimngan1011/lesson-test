import { test } from "../../playwright/fixtures";
import { CreateLesson } from "../pages/create-lesson";
import { LsCommonTest } from "../pages/common-test";
import { loginBO } from "../sf-login-page";
import { CreateLessonAllocation } from "../pages/create-lesson-allocation";
import { LESSON_NAME } from "../utils/masterData";
import { BOLesson } from "../pages/bo-lesson";

test('Create recurring group lesson with student and teacher', async ({ page }) => {
    const createLessonAllocation = new CreateLessonAllocation(page);
    const lessonAllocationName = await createLessonAllocation.createLessonAllocation();
    const createLesson = new CreateLesson(page);
    const groupLessonName = await createLesson.createLesson('recurringGroup'); // create recurring group lesson
    const lsCommonTest = new LsCommonTest(page); 
    const boLesson = new BOLesson(page);

    await lsCommonTest.searchRecurringLesson(groupLessonName);
    await createLesson.addTeacher(LESSON_NAME.teacherRecurring, { save:true, scope: 'following' }); // add a teacher with following option
    await createLesson.addStudent(lessonAllocationName, { save: true, scope: 'following' }); // add a student with following option
    await createLesson.checkStudentSessionInfo('Student Sessions(1)');
    await createLesson.checkLessonTeacher('Lesson Teachers(1)');
    await lsCommonTest.redirectToTab('Report');
    await createLesson.checkLessonReportInfo('Teaching MethodGroup');
    await createLesson.checkLessonReportInfo('Lesson Report StatusDraft');  
    await lsCommonTest.redirectToTab('Participants'); // check LA info  
    await createLesson.checkStudentSession(lessonAllocationName, '5/90 Lesson Allocated');
    await createLesson.checkLessonScheduleInfo(LESSON_NAME.teacherRecurring);
    await loginBO(page, 'full'); // login BO
    await boLesson.searchStudent(lessonAllocationName); // check lesson info on BO
    await boLesson.openLessonDetail();
    await createLesson.checkLessonInfo(groupLessonName, 'recurringGroup');
    await lsCommonTest.redirectToTab ('Student');
    await lsCommonTest.redirectToTab ('Report');
});

test('Create recurring individual lesson with student and teacher', async ({ page }) => {
    const createLessonAllocation = new CreateLessonAllocation(page);
    const lessonAllocationName = await createLessonAllocation.createLessonAllocation();
    const createLesson = new CreateLesson(page);
    const individualLessonName = await createLesson.createLesson('recurringIndividual'); // create recurring individual lesson
    const lsCommonTest = new LsCommonTest(page); 
    const boLesson = new BOLesson(page);

    await lsCommonTest.searchRecurringLesson(individualLessonName);
    await createLesson.addTeacher(LESSON_NAME.teacherRecurring, { save:true }); // add a teacher with only option
    await createLesson.addStudent(lessonAllocationName, { save: true }); // add a student with only option
    await createLesson.checkStudentSessionInfo('Student Sessions(1)');
    await createLesson.checkLessonTeacher('Lesson Teachers(1)');
    await lsCommonTest.redirectToTab('Report');
    await createLesson.checkLessonReportInfo('Teaching MethodIndividual');
    await createLesson.checkLessonReportInfo('Lesson Report StatusDraft');  
    await lsCommonTest.redirectToTab('Participants'); // check LA info  
    await createLesson.checkStudentSession(lessonAllocationName, '1/90 Lesson Allocated');
    await createLesson.checkLessonScheduleInfo(LESSON_NAME.teacherRecurring);
    await loginBO(page, 'full'); // login BO
    await boLesson.searchStudent(lessonAllocationName); // check lesson info on BO
    await boLesson.openLessonDetail();
    await createLesson.checkLessonInfo(individualLessonName, 'recurringIndividual');
    await lsCommonTest.redirectToTab ('Student');
    await lsCommonTest.redirectToTab ('Report');
})


