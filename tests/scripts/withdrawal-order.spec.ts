import { test } from "../../playwright/fixtures";
import { LsCommonTest } from "../pages/common-test";
import { CreateLessonAllocation } from "../pages/create-lesson-allocation";

test('Submit withdrawal order with start date < last attendance day', async ({ page }) => {
    const withdrawalOrder = new CreateLessonAllocation (page);
    const lsCommonTest = new LsCommonTest(page);
    const createLessonAllocation = new CreateLessonAllocation(page);
    const lessonAllocationName = await createLessonAllocation.createLessonAllocation(); // create LA

    await withdrawalOrder.withdrawalOrder();
    await lsCommonTest.openHyperlink(lessonAllocationName);
    await lsCommonTest.redirectToTab('Course');
    await withdrawalOrder.checkLADurationAndPS('Purchased Slot5/Week');
})

