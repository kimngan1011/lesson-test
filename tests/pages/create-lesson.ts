import { expect, Page } from "@playwright/test";
import { randomText } from "../utils/random";
import { LsCommonTest } from "./common-test";
import { LsPopup } from "./lesson-popup";
import { MASTER_NAME, LESSON_NAME } from "../utils/masterData";
import { LESSON_URL } from "../utils/url";
import { CreateLessonAllocation } from "./create-lesson-allocation";
export class CreateLesson {
    readonly page: Page;
    page1: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async createOneTimeIndividualLesson(timeout: number = 5000): Promise<string> {
        const lsCommonTest = new LsCommonTest(this.page);
        const lessonDialog = new LsPopup(this.page);
        const lessonName = randomText(10);

        await this.page.setDefaultTimeout(timeout); // Set timeout for Playwright actions
        await lsCommonTest.navigateToPage(LESSON_URL.lesson);
        await lsCommonTest.clickOnButton("New");
        await lessonDialog.getLessonDate("*Date");
        await lessonDialog.inputData("*Lesson Name", lessonName);
        await lessonDialog.inputData("* Start Time", LESSON_NAME.startTime);
        await lessonDialog.inputData("* End Time", LESSON_NAME.endTime);
        await lessonDialog.searchAndSelectData("Search for location", MASTER_NAME.centerName);
        await lessonDialog.searchAndSelectData("Search for classroom", MASTER_NAME.classroomName);
        await lsCommonTest.clickOnButton("Save");

        return lessonName;
    }


    // Check lesson report info
    public async checkLessonReportInfo(value) {
        await this.page.locator('lightning-output-field').filter({ hasText: value }).click();
        await this.page.getByRole('heading', { name: 'Lesson Report Details (1)' }).click();

    }

    // Add a student to a lesson
    public async addStudent(value: string){
        const lsCommonTest = new LsCommonTest(this.page);
        await lsCommonTest.clickOnExactButton('Add Students');
        await lsCommonTest.searchData('Enter Student Name', value);
        await lsCommonTest.clickOnExactButton('Add');
        await this.page.getByText('Student Sessions(1)', { exact: true }).click();
    };

    // Check LA info

    public async checkStudentSession (value: string) {
        const page1Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: value }).click();
        await this.page.waitForTimeout(5000);
        const page1 = await page1Promise;
        page1.getByText('1/90 Lesson Allocated');
        page1.close();
    };


    // Add a teacher to a lesson
    public async addTeacher(value: string){
        const lsCommonTest = new LsCommonTest(this.page);
        await lsCommonTest.clickOnExactButton('Add Teacher');
        await lsCommonTest.searchData('Enter Teacher Name', value);
        await lsCommonTest.clickOnExactButton('Add');
        await this.page.getByText('Lesson Teachers(1)', { exact: true }).click();
    }
}