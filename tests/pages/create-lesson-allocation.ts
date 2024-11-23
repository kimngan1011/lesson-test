import { Page } from "@playwright/test";
import { LsCommonTest } from "./common-test";
import { MASTER_URL } from "../utils/url";
import { LsPopup, StudentPopup } from "./lesson-popup";
import { randomText } from "../utils/random";
import { MASTER_NAME } from "../utils/masterData";

export class CreateLessonAllocation {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    public async createLessonAllocation() {
        const lsCommonTest = new LsCommonTest(this.page);
        const studentPopup = new StudentPopup(this.page);
        const lessonDialog = new LsPopup(this.page);
        const radomText = randomText(6);
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
        await lessonDialog.getLessonDate("Start Date");
        await lsCommonTest.clickOnExactButton("Save");
        await this.page.waitForTimeout(5000);
        const url=await this.page.url();
        console.log(url);
        await lsCommonTest.clickOnExactButton("Create Enrollment");
        await this.page.keyboard.press('PageDown');
        await lsCommonTest.clickOnExactButton("Manage");
        await lsCommonTest.clickOnExactButton("Add Products");
        await lsCommonTest.selectItem("Select Item 1");
        await lsCommonTest.clickOnExactButton("Next");
        await studentPopup.selectAssociatedCourse();
        await lsCommonTest.clickOnExactButton("Save");
        await lsCommonTest.clickOnExactButton("Save as Draft");
        await this.page.waitForTimeout(5000);
        await this.page.goto(url);
        await this.page.getByRole('button', { name: 'Submit Enrollment' }).click();
        await this.page.waitForTimeout(30000); // wait to sync data

        return fullName;
    };
}