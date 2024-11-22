import { expect, Page } from "@playwright/test";
import { randomText } from "../utils/random";
import { LsCommonTest } from "./common-test";
import { LsPopup } from "./lesson-popup";
import { MASTER_NAME, LESSON_NAME } from "../utils/masterData";
import { LESSON_URL } from "../utils/url";
import { CreateLessonAllocation } from "./create-lesson-allocation";
export class CreateLesson {
    readonly page: Page;

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
    }

    public async addStudent(value: string){
        const lsCommonTest = new LsCommonTest(this.page);
        // const createLessonAllocation = new CreateLessonAllocation(this.page);
        // const 
        // const lessonAllocationName = await createLessonAllocation.createLessonAllocation();
        // const individualLessonName = await createLesson.createOneTimeIndividualLesson();
        // await lsCommonTest.navigateToPage(LESSON_URL.lesson);
        // await lsCommonTest.searchList(individualLessonName);
        await lsCommonTest.clickOnExactButton('Add Students');
        await lsCommonTest.searchData('Enter Student Name', value);
        await lsCommonTest.clickOnExactButton('Add');
    }
}