// import { test } from "../../playwright/fixtures";
// import { LsCommonTest } from "../pages/common-test";
// import { CreateLessonAllocation } from "../pages/create-lesson-allocation";

// test("Submit withdrawal order with start date < last attendance day", async ({ page }) => {
//   const withdrawalOrder = new CreateLessonAllocation(page);
//   const lsCommonTest = new LsCommonTest(page);
//   const createLessonAllocation = new CreateLessonAllocation(page);
//   const { fullName, LANumber } = await createLessonAllocation.createLessonAllocation(); // create LA

//   console.log(fullName);
//   await withdrawalOrder.withdrawalOrder("UpdateLA");
//   await lsCommonTest.openHyperlink(fullName as string);
//   await lsCommonTest.redirectToTab("Course");
//   await withdrawalOrder.checkLADurationAndPS("Purchased Slot5/Week", "Submit");
//   await page.screenshot({ path: "playwright/screenshot/submit-withdrawal-order1.png" });
// });

// test("Submit withdrawal order with start date = last attendance day", async ({ page }) => {
//   const withdrawalOrder = new CreateLessonAllocation(page);
//   const lsCommonTest = new LsCommonTest(page);
//   const createLessonAllocation = new CreateLessonAllocation(page);
//   const { fullName, LANumber } = await createLessonAllocation.createLessonAllocation(); // create LA

//   console.log(fullName);
//   await withdrawalOrder.withdrawalOrder("DeleteLA");
//   await lsCommonTest.openHyperlink(fullName as string);
//   await lsCommonTest.redirectToTab("Course");
//   await withdrawalOrder.checkLAInfo("Lesson Allocation (0)");
//   await page.screenshot({ path: "playwright/screenshot/submit-withdrawal-order2.png" });
// });

// test("Cancel withdrawal order with start date < last attendance day", async ({ page }) => {
//   const withdrawalOrder = new CreateLessonAllocation(page);
//   const lsCommonTest = new LsCommonTest(page);
//   const createLessonAllocation = new CreateLessonAllocation(page);
//   const { fullName, LANumber } = await createLessonAllocation.createLessonAllocation(); // create LA

//   console.log(fullName);
//   await withdrawalOrder.withdrawalOrder("UpdateLA");
//   await withdrawalOrder.cancelWithdrawal();
//   await lsCommonTest.openHyperlink(fullName as string);
//   await lsCommonTest.redirectToTab("Course");
//   await withdrawalOrder.checkLADurationAndPS("Purchased Slot5/Week", "Cancel");
//   await page.screenshot({ path: "playwright/screenshot/cancel-withdrawal-order1.png" });
// });

// test("Cancel withdrawal order with start date = last attendance day", async ({ page }) => {
//   const withdrawalOrder = new CreateLessonAllocation(page);
//   const lsCommonTest = new LsCommonTest(page);
//   const createLessonAllocation = new CreateLessonAllocation(page);
//   const { fullName, LANumber } = await createLessonAllocation.createLessonAllocation(); // create LA

//   console.log(fullName);
//   await withdrawalOrder.withdrawalOrder("DeleteLA");
//   await withdrawalOrder.cancelWithdrawal();
//   await lsCommonTest.openHyperlink(fullName as string);
//   await lsCommonTest.redirectToTab("Course");
//   await withdrawalOrder.checkLADurationAndPS("Purchased Slot5/Week", "Cancel");
//   await page.screenshot({ path: "playwright/screenshot/cancel-withdrawal-order2.png" });
// });
