import { test } from "../../playwright/fixtures";
import { LsCommonTest } from "../pages/common-test";
import { loginBO } from "../sf-login-page";
import { MessageLesson } from "../pages/message";
import { randomText } from "../utils/random";
import { LESSON_URL } from "../utils/url";
import { BOLesson } from "../pages/bo-lesson";
import { CreateLesson } from "../pages/create-lesson";
import { LESSON_NAME } from "../utils/masterData";


// test('Edit one time individual lesson on BO', async ({ page }) => {
//     const boLesson = new BOLesson(page);
//     const showMessage = new MessageLesson(page);
//     const lsCommonTest = new LsCommonTest(page);
//     const lessonName = randomText(10);
//     const checkLCInfo = new CreateLesson(page);

//     await loginBO(page, 'partial');
//     await boLesson.filterTeacher('oneTimeIndividual');
//     await boLesson.openLessonDetail();
//     await boLesson.editLesson(lessonName,'oneTimeIndividual');
//     await showMessage.editLessonBO();
//     await boLesson.checkLessonInfo(lessonName,'oneTimeIndividual')
//     await lsCommonTest.navigateToPage(LESSON_URL.lesson);
//     await lsCommonTest.searchList(lessonName);
//     await checkLCInfo.checkLessonScheduleInfo(LESSON_NAME.teacherOneTime);
// })

// test('Edit recurring group lesson with only this lesson on BO', async ({ page }) => {
//     const boLesson = new BOLesson(page);
//     const showMessage = new MessageLesson(page);
//     const lsCommonTest = new LsCommonTest(page);
//     const lessonName = randomText(10);
//     const checkLCInfo = new CreateLesson(page);

//     await loginBO(page, 'partial');
//     await boLesson.filterTeacher('recurringGroup');
//     await boLesson.openLessonDetail();
//     await boLesson.editLesson(lessonName,'recurringGroup', 'only');
//     await showMessage.editLessonBO();
//     await boLesson.checkLessonInfo(lessonName,'recurringGroup');
//     await lsCommonTest.navigateToPage(LESSON_URL.lesson);
//     await lsCommonTest.searchList(lessonName);
//     await checkLCInfo.checkLessonScheduleInfo(LESSON_NAME.teacherRecurring);
// })

test('Edit recurring group lesson with this and the following on BO', async ({ page }) => {
    const boLesson = new BOLesson(page);
    const showMessage = new MessageLesson(page);
    const lsCommonTest = new LsCommonTest(page);
    const lessonName = randomText(10);
    const checkLCInfo = new CreateLesson(page);

    await loginBO(page, 'partial');
    await boLesson.filterTeacher('recurringGroup');
    await boLesson.openLessonDetail();
    await boLesson.editLesson(lessonName,'recurringGroup', 'following');
    await showMessage.editLessonBO();
    await boLesson.checkLessonInfo(lessonName,'recurringGroup');
    await page.waitForTimeout(15000);
    await lsCommonTest.navigateToPage(LESSON_URL.lesson);
    await lsCommonTest.searchRecurringLesson(lessonName);
    await checkLCInfo.checkLessonScheduleInfo(LESSON_NAME.teacherRecurring);
})