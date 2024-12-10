import { test } from "../../playwright/fixtures";
import { BOLesson } from "../pages/bo-lesson";
import { LsCommonTest } from "../pages/common-test";
import { CreateLesson } from "../pages/create-lesson";
import { MessageLesson } from "../pages/message";
import { loginBO } from "../sf-login-page";
import { randomText } from "../utils/random";
import { LESSON_URL } from "../utils/url";

test ('Remove student from one-time individual lesson', async ({ page }) => {    
    const showMessage = new MessageLesson(page);
    const lsCommonTest = new LsCommonTest(page);
    const boLesson = new BOLesson(page);
    const lessonName = randomText(10);
    const checkStudentSessionInfo = new CreateLesson(page);


    await loginBO(page, 'partial');
    await boLesson.filterTeacher('oneTimeIndividual');
    await boLesson.openLessonDetail();
    await boLesson.editLessonName(lessonName,'oneTimeIndividual');
    await lsCommonTest.redirectToTab('Student');
    await boLesson.removeStudentOnBO('oneTimeIndividual');
    await showMessage.removeStudentBO();
    await page.waitForTimeout(15000);
    await lsCommonTest.navigateToPage(LESSON_URL.lesson);
    await lsCommonTest.searchList(lessonName);
    await lsCommonTest.openHyperlink(lessonName);
    await checkStudentSessionInfo.checkStudentSessionInfo('Student Sessions(0)');
})

test ('Remove student from recurring lesson with only this lesson', async ({page}) => {
    const showMessage = new MessageLesson(page);
    const lsCommonTest = new LsCommonTest(page);
    const boLesson = new BOLesson(page);
    const lessonName = randomText(10);
    const checkStudentSessionInfo = new CreateLesson(page);


    await loginBO(page, 'partial');
    await boLesson.filterTeacher('recurringIndividual');
    await boLesson.openLessonDetail();
    await boLesson.editLessonName(lessonName,'recurringGroup', 'only');
    await lsCommonTest.redirectToTab('Student');
    await boLesson.removeStudentOnBO('recurringGroup', 'only');
    await showMessage.removeStudentBO();
    await page.waitForTimeout(15000);
    await lsCommonTest.navigateToPage(LESSON_URL.lesson);
    await lsCommonTest.searchList(lessonName);
    await lsCommonTest.openRecurringLesson(lessonName);
    await checkStudentSessionInfo.checkStudentSessionInfo('Student Sessions(0)');
})

test ('Remove student from recurring lesson with this and the following lesson', async ({page}) => {
    const showMessage = new MessageLesson(page);
    const lsCommonTest = new LsCommonTest(page);
    const boLesson = new BOLesson(page);
    const lessonName = randomText(10);
    const checkStudentSessionInfo = new CreateLesson(page);


    await loginBO(page, 'partial');
    await boLesson.filterTeacher('recurringGroup');
    await boLesson.openLessonDetail();
    await boLesson.editLessonName(lessonName,'recurringGroup', 'following');
    await lsCommonTest.redirectToTab('Student');
    await boLesson.removeStudentOnBO('recurringGroup', 'following');
    await showMessage.removeStudentBO();
    await page.waitForTimeout(15000);
    await lsCommonTest.navigateToPage(LESSON_URL.lesson);
    await lsCommonTest.searchList(lessonName);
    await lsCommonTest.openRecurringLesson(lessonName);
    await checkStudentSessionInfo.checkStudentSessionInfo('Student Sessions(0)');
})