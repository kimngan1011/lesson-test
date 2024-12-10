import { test } from "../../playwright/fixtures";
import { CreateLesson } from "../pages/create-lesson";
import { LsCommonTest } from "../pages/common-test";
import { loginBO } from "../sf-login-page";
import { BOLesson } from "../pages/bo-lesson";
import { CreateLessonAllocation } from "../pages/create-lesson-allocation";
import { EditLesson } from "../pages/edit-lesson";

test('Edit one time individual lesson info', async ({ page }) => {
    const createLessonAllocation = new CreateLessonAllocation(page);
    const lessonAllocationName = await createLessonAllocation.createLessonAllocation(); // create LA
    const createLesson = new CreateLesson(page);
    const individualLessonName = await createLesson.createLesson('oneTimeIndividual'); // create one-time individual lesson
    const editLesson = new EditLesson(page);
    const lsCommonTest = new LsCommonTest(page);
    const boLesson = new BOLesson(page);

    await lsCommonTest.searchList(individualLessonName);
    await lsCommonTest.openHyperlink(individualLessonName);
    await editLesson.editLesson('oneTimeIndividual');
    await createLesson.addStudent(lessonAllocationName);
    await editLesson.checkLessonInfoSF();
    await loginBO(page, 'full');
    await boLesson.searchStudent(lessonAllocationName);
    await boLesson.openLessonDetail(true);
    await editLesson.checkLessonInfoBO('oneTimeIndividual');
    // check lesson name, date, time, classroom, lesson capacity, teaching medium    
})

test('Edit recurring group lesson info with only this lesson', async ({ page }) => {
    const createLessonAllocation = new CreateLessonAllocation(page);
    const lessonAllocationName = await createLessonAllocation.createLessonAllocation(); // create LA
    const createLesson = new CreateLesson(page);
    const groupLessonName = await createLesson.createLesson('recurringGroup'); // create recurring group lesson
    const editLesson = new EditLesson(page);
    const lsCommonTest = new LsCommonTest(page);
    const boLesson = new BOLesson(page);

    await lsCommonTest.searchList(groupLessonName);
    await lsCommonTest.openRecurringLesson(groupLessonName);
    await editLesson.editLesson('recurringGroup', 'only');
    await createLesson.addStudent(lessonAllocationName, { save: true, scope: 'following' });
    await editLesson.checkLessonInfoSF();
    await createLesson.checkLessonScheduleInfo('updated');
    await page.waitForTimeout(5000); // check lesson schedule info
    await loginBO(page, 'full');
    await boLesson.searchStudent(lessonAllocationName);
    await page.waitForTimeout(5000); // check lesson info
    await boLesson.openLessonDetail(true);
    await editLesson.checkLessonInfoBO('recurringGroup');
})

test('Edit recurring group lesson info with this and the following', async ({ page }) => {
    const createLessonAllocation = new CreateLessonAllocation(page);
    const lessonAllocationName = await createLessonAllocation.createLessonAllocation(); // create LA
    const createLesson = new CreateLesson(page);
    const groupLessonName = await createLesson.createLesson('recurringGroup'); // create recurring group lesson
    const editLesson = new EditLesson(page);
    const lsCommonTest = new LsCommonTest(page);
    const boLesson = new BOLesson(page);

    await lsCommonTest.searchList(groupLessonName);
    await lsCommonTest.openRecurringLesson(groupLessonName);
    await editLesson.editLesson('recurringGroup', 'following');
    await createLesson.addStudent(lessonAllocationName, { save: true, scope: 'following' });
    await editLesson.checkLessonInfoSF();
    await createLesson.checkLessonScheduleInfo('updated'); // check lesson info in lesson schedule
    await loginBO(page, 'full');
    await boLesson.searchStudent(lessonAllocationName); // check lesson info on lesson list
    await boLesson.openLessonDetail(true); // check lesson detail
    await editLesson.checkLessonInfoBO('recurringGroup');
})

