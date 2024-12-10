import { test } from "../../playwright/fixtures";
import { LsCommonTest } from "../pages/common-test";
import { CreateLessonAllocation } from "../pages/create-lesson-allocation";

test('Submit withdrawal order with start date < last attendance day', async ({ page }) => {
    const withdrawalOrder = new CreateLessonAllocation (page);
    const lsCommonTest = new LsCommonTest(page);
    const createLessonAllocation = new CreateLessonAllocation(page);
    const lessonAllocationName = await createLessonAllocation.createLessonAllocation(); // create LA

    await withdrawalOrder.withdrawalOrder('UpdateLA');
    await lsCommonTest.openHyperlink(lessonAllocationName);
    await lsCommonTest.redirectToTab('Course');
    await withdrawalOrder.checkLADurationAndPS('Purchased Slot5/Week', 'Submit');
})

test('Submit withdrawal order with start date = last attendance day', async ({ page }) => {
    const withdrawalOrder = new CreateLessonAllocation (page);
    const lsCommonTest = new LsCommonTest(page);
    const createLessonAllocation = new CreateLessonAllocation(page);
    const lessonAllocationName = await createLessonAllocation.createLessonAllocation(); // create LA

    await withdrawalOrder.withdrawalOrder('DeleteLA');
    await lsCommonTest.openHyperlink(lessonAllocationName);
    await lsCommonTest.redirectToTab('Course');
    await withdrawalOrder.checkLAInfo('Lesson Allocation (0)');
})

test('Cancel withdrawal order with start date < last attendance day', async ({ page }) => {
    const withdrawalOrder = new CreateLessonAllocation (page);
    const lsCommonTest = new LsCommonTest(page);
    const createLessonAllocation = new CreateLessonAllocation(page);
    const lessonAllocationName = await createLessonAllocation.createLessonAllocation(); // create LA

    await withdrawalOrder.withdrawalOrder('UpdateLA');
    await withdrawalOrder.cancelWithdrawal();
    await lsCommonTest.openHyperlink(lessonAllocationName);
    await lsCommonTest.redirectToTab('Course');
    await withdrawalOrder.checkLADurationAndPS('Purchased Slot5/Week', 'Cancel');
})

test('Cancel withdrawal order with start date = last attendance day', async ({ page }) => {
    const withdrawalOrder = new CreateLessonAllocation (page);
    const lsCommonTest = new LsCommonTest(page);
    const createLessonAllocation = new CreateLessonAllocation(page);
    const lessonAllocationName = await createLessonAllocation.createLessonAllocation(); // create LA

    await withdrawalOrder.withdrawalOrder('DeleteLA');
    await withdrawalOrder.cancelWithdrawal();
    await lsCommonTest.openHyperlink(lessonAllocationName);
    await lsCommonTest.redirectToTab('Course');
    await withdrawalOrder.checkLADurationAndPS('Purchased Slot5/Week', 'Cancel');
})



