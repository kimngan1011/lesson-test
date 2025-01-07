import { Page } from "@playwright/test";
import { LsCommonTest } from "./common-test";
import { LESSON_URL, MASTER_URL } from "../utils/url";
import { LsPopup, StudentPopup } from "./lesson-popup";
import { randomText } from "../utils/random";
import { MASTER_NAME } from "../utils/masterData";
import { BOLesson } from "./bo-lesson";

export class CreateLessonAllocation {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  // Create lesson allocation
  public async createLessonAllocation() {
    const lsCommonTest = new LsCommonTest(this.page);
    const studentPopup = new StudentPopup(this.page);
    const lessonDialog = new LsPopup(this.page);
    const boLesson = new BOLesson(this.page);
    const radomText = randomText(6);
    const startDate = await boLesson.getLessonDateLink("orderStartDate");
    const firstName = "[E2E] Kim Ngan Student";
    const lastName = radomText;
    const fullName = `${firstName} ${lastName}`;

    await lsCommonTest.navigateToPage(MASTER_URL.newStudentPopup); // create student
    await studentPopup.inputData("First Name", "[E2E] Kim Ngan Student");
    await studentPopup.inputData("Last Name", radomText);
    await studentPopup.inputEmail(`kimngan.doan+student${radomText}@manabie.com`);
    await lsCommonTest.searchAndSelectDataStandard("Search Grades", MASTER_NAME.gradeName);
    await studentPopup.selectPaymentMethod();
    await lsCommonTest.clickOnExactButton("Save");
    await lsCommonTest.clickOnExactButton("Create Enrollment Application"); // create order
    await lsCommonTest.searchAndSelectDataStandard("Search Accounts", MASTER_NAME.centerName);
    await lessonDialog.inputData("Start Date", startDate as string);
    await lsCommonTest.clickOnExactButton("Save");
    await this.page.waitForTimeout(5000);
    const applicationUrl = await this.page.url();
    await lsCommonTest.clickOnExactButton("Create Enrollment");
    await lsCommonTest.scrollPage();
    await lsCommonTest.clickOnExactButton("Manage");
    await lsCommonTest.clickOnExactButton("Add Products");
    await lsCommonTest.selectItem("Select Item 1");
    await lsCommonTest.clickOnExactButton("Next");
    await studentPopup.selectAssociatedCourse();
    await lsCommonTest.clickOnExactButton("Save");
    await lsCommonTest.clickOnExactButton("Save as Draft");
    await this.page.waitForTimeout(5000);
    await this.page.goto(applicationUrl);
    await this.page.getByRole("button", { name: "Submit Enrollment" }).click();
    await this.page.waitForTimeout(60000);
    await lsCommonTest.openHyperlink(fullName);
    await lsCommonTest.redirectToTab("Course");
    const LANumber = await this.page.getByRole("rowheader").nth(0).textContent();

    return { fullName, LANumber };
  }

  public async openLADetail(LANumber: string) {
    const lsCommonTest = new LsCommonTest(this.page);
    await lsCommonTest.navigateToPage(LESSON_URL.lessonAllocation);
    await lsCommonTest.searchList(LANumber);
    await this.page.getByRole("gridcell").first().click();
    const LAElement = await this.page.getByRole("rowheader").textContent();
    const splitLANumber = LAElement?.split("Item");
    const getLANumber = splitLANumber?.[1];

    // const studentElement = await this.page.getByRole("gridcell").nth(2).textContent();
    // const splitStudentElement = studentElement?.split("\n");
    // const studentName = splitStudentElement?.[0];

    await this.page.getByRole("link", { name: getLANumber as string }).click({ timeout: 5000 });
    const lessonAllocatedBefore = await this.page.getByRole("alert").textContent();
    const splitLessonAllocatedBefore = lessonAllocatedBefore?.split("/");
    const splitassignedLessonBefore = splitLessonAllocatedBefore?.[0];
    const assignedLessonBefore = splitassignedLessonBefore?.replace("info", "");

    const url = this.page.url();

    return { assignedLessonBefore, url };
  }

  // Check LA info
  public async checkLADurationAndPS(info: string, action: "Submit" | "Cancel") {
    const boLesson = new BOLesson(this.page);
    const lAStartDate = await boLesson.getLessonDateLink("lAStartDate");
    const lAEndDate = await boLesson.getNextLessonDateLink("lAEndDate");
    const page1Promise = this.page.waitForEvent("popup");

    await this.page.locator('a[href*="/lightning/r/Lesson_Allocation__c/"]').click();
    await this.page.waitForTimeout(5000);
    const page1 = await page1Promise;
    if (action === "Submit") {
      await page1.getByText(`Duration${lAStartDate} - ${lAEndDate}`).click();
    } else if (action === "Cancel") {
      await page1.getByText(`Duration${lAStartDate} - 2026-03-31`).click();
    }
    await page1.getByText(info).click(); // Purchased Slot5/Week
    page1.close();
  }

  public async checkLAInfo(info: string) {
    await this.page.getByRole("heading", { name: info }).click(); // 'Lesson Allocation (0)'
  }

  public get getWithdrawalApplicationRecord() {
    const withdrawalApplicationRecord = this.page.locator(
      '[aria-label="Withdrawals"] [data-label="Application Number"] [data-label="Application Number"]'
    );

    return withdrawalApplicationRecord;
  }

  public async accessWithdrawalOrder() {
    const applicationNumber = this.getWithdrawalApplicationRecord;
    // get application number and extract to find link and click
    const StringApplicationNumber = await applicationNumber.innerText();
    const startIndex = StringApplicationNumber.indexOf("Application-");
    const endIndex = StringApplicationNumber.indexOf("\n" + "Open");
    const StringApplicationNumber_Extract = StringApplicationNumber.slice(startIndex, endIndex);
    console.log(StringApplicationNumber_Extract);
    await this.page
      .getByRole("rowheader", { name: StringApplicationNumber_Extract + " Open" })
      .getByRole("link")
      .click();
  }

  public async searchAndSelectLocation(fieldName: string, optionName: string) {
    await this.page.getByPlaceholder(fieldName).click();
    await this.page.getByPlaceholder(fieldName).fill(optionName);
    await this.page.getByTitle(optionName, { exact: true }).nth(1).click();
  }

  // Withdrawal Order
  public async withdrawalOrder(action: "UpdateLA" | "DeleteLA") {
    const lsCommonTest = new LsCommonTest(this.page);
    const lessonDialog = new LsPopup(this.page);
    const accessWithdrawalOrder = new CreateLessonAllocation(this.page);
    const boLesson = new BOLesson(this.page);
    const currentDate = await boLesson.getLessonDateLink("orderStartDate");
    const nextDate = await boLesson.getNextLessonDateLink("orderStartDate");

    await lsCommonTest.showMoreAndClickItem("Application");
    await this.page.getByLabel("Withdrawals").getByRole("button", { name: "New" }).click();
    // await this.page.locator("label").filter({ hasText: "Withdrawal" }).locator("span").first().click();
    // await lsCommonTest.clickOnExactButton("Next");
    await accessWithdrawalOrder.searchAndSelectLocation("Search Accounts", MASTER_NAME.centerName);
    if (action === "UpdateLA") {
      await lessonDialog.inputData("*Last Attendance Day", nextDate as string);
    } else if (action === "DeleteLA") {
      await lessonDialog.inputData("*Last Attendance Day", currentDate as string);
    }
    await this.page.getByRole("option", { name: "Graduate" }).click();
    await this.page.getByRole("button", { name: "Move to Chosen" }).click();
    await lsCommonTest.clickOnExactButton("Save");
    // await accessWithdrawalOrder.accessWithdrawalOrder();
    await this.page.waitForTimeout(5000);
    const withdrawalUrl = await this.page.url();
    await lsCommonTest.clickOnExactButton("Create Withdrawal");
    await this.page.locator("lightning-formatted-text").filter({ hasText: "Withdrawal" }).click();
    await lsCommonTest.scrollPage();
    await lsCommonTest.clickOnExactButton("Manage");
    await lsCommonTest.clickOnExactButton("Add Withdrawal Products");
    await lsCommonTest.clickOnExactButton("Continue");
    await this.page.waitForTimeout(5000);
    await lsCommonTest.clickOnExactButton("Save as Draft");
    await this.page.waitForTimeout(5000);
    await this.page.goto(withdrawalUrl);
    await this.page.getByRole("button", { name: "Submit Withdrawal" }).click();
    // await this.page.getByRole("button", { name: "Close this window" }).click();
    await this.page.waitForTimeout(40000); // wait to sync data

    return withdrawalUrl;
  }

  public async cancelWithdrawal() {
    const lsCommonTest = new LsCommonTest(this.page);

    await lsCommonTest.clickOnExactButton("Cancel Withdrawal");
    await this.page.waitForTimeout(40000);
  }
}
