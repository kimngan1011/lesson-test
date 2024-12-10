import { test } from "../../playwright/fixtures";
import { LsCommonTest } from "../pages/common-test";
import { loginBO } from "../sf-login-page";
import { MessageLesson } from "../pages/message";
import { randomText } from "../utils/random";
import { LESSON_URL } from "../utils/url";
import { BOLesson } from "../pages/bo-lesson";
import { CreateLesson } from "../pages/create-lesson";

test('Edit one time individual lesson on BO', async ({ page }) => {
    const boLesson = new BOLesson(page);
    const showMessage = new MessageLesson(page);
    const lsCommonTest = new LsCommonTest(page);
    const lessonName = randomText(10);
    const checkLCInfo = new CreateLesson(page);

    await loginBO(page, 'partial');
    await boLesson.filterTeacher('oneTimeIndividual');
    await boLesson.publishLessonOnBO();
    await boLesson.openLessonDetail();
    await boLesson.editLesson(lessonName,'oneTimeIndividual');
    await showMessage.editLessonBO();
    await boLesson.checkUpdatedLessonInfo(lessonName, 'oneTimeIndividual')
    await boLesson.collectAttendanceOnBO('attend');
    await showMessage.collectAttendaneBO();
    await page.waitForTimeout(15000);
    await lsCommonTest.navigateToPage(LESSON_URL.lesson);
    await lsCommonTest.searchList(lessonName);
    await lsCommonTest.openHyperlink(lessonName);
    await boLesson.checkAttendAndLate('Attend');
    await checkLCInfo.checkLessonScheduleInfo('Published');
})

test('Edit recurring individual lesson with this and the following on BO', async ({ page }) => {
    const boLesson = new BOLesson(page);
    const showMessage = new MessageLesson(page);
    const lsCommonTest = new LsCommonTest(page);
    const lessonName = randomText(10);
    const checkLCInfo = new CreateLesson(page);

    await loginBO(page, 'partial');
    await boLesson.filterTeacher('recurringIndividual');
    await boLesson.publishLessonOnBO();
    await boLesson.openLessonDetail();
    await boLesson.editLesson(lessonName,'recurringGroup', 'following');
    await showMessage.editLessonBO();
    await boLesson.checkUpdatedLessonInfo(lessonName,'recurringIndividual')
    await boLesson.collectAttendanceOnBO('late');
    await showMessage.collectAttendaneBO();
    await page.waitForTimeout(15000);
    await lsCommonTest.navigateToPage(LESSON_URL.lesson);
    await lsCommonTest.searchList(lessonName);
    await lsCommonTest.openRecurringLesson(lessonName);
    await boLesson.checkAttendAndLate('Late');
    await checkLCInfo.checkLessonScheduleInfo('Published');
})

test('Edit recurring group lesson with only this lesson on BO', async ({ page }) => {
    const boLesson = new BOLesson(page);
    const showMessage = new MessageLesson(page);
    const lsCommonTest = new LsCommonTest(page);
    const lessonName = randomText(10);
    const checkLCInfo = new CreateLesson(page);

    await loginBO(page, 'partial');
    await boLesson.filterTeacher('recurringGroup');
    await boLesson.openLessonDetail();
    await boLesson.editLesson(lessonName,'recurringGroup', 'only');
    await showMessage.editLessonBO();
    await boLesson.checkUpdatedLessonInfo(lessonName,'recurringGroup')
    await boLesson.collectAttendanceOnBO('absent');
    await showMessage.collectAttendaneBO();
    await page.waitForTimeout(15000);
    await lsCommonTest.navigateToPage(LESSON_URL.lesson);
    await lsCommonTest.searchList(lessonName);
    await lsCommonTest.openRecurringLesson(lessonName);
    await boLesson.checkAbsent('Absent', 'Family Reasons', 'On The Day');
    await checkLCInfo.checkLessonScheduleInfo('Published');
})

test('Edit one time group lesson on BO', async ({ page }) => {
    const boLesson = new BOLesson(page);
    const showMessage = new MessageLesson(page);
    const lsCommonTest = new LsCommonTest(page);
    const lessonName = randomText(10);
    const checkLCInfo = new CreateLesson(page);

    await loginBO(page, 'partial');
    await page.pause();
    await boLesson.filterTeacher('oneTimeGroup');
    await boLesson.openLessonDetail();
    await boLesson.editLesson(lessonName,'oneTimeIndividual');
    await showMessage.editLessonBO();
    await boLesson.checkUpdatedLessonInfo(lessonName, 'oneTimeGroup')
    await boLesson.collectAttendanceOnBO('allAttend');
    await showMessage.collectAttendaneBO();
    await page.waitForTimeout(15000);
    await lsCommonTest.navigateToPage(LESSON_URL.lesson);
    await lsCommonTest.searchList(lessonName);
    await lsCommonTest.openHyperlink(lessonName);
    await boLesson.checkAttendAndLate('Attend');
    await checkLCInfo.checkLessonScheduleInfo('Published');
})
