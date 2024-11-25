import { expect, Page } from "@playwright/test";
import { randomText } from "../utils/random";
import { LsCommonTest } from "./common-test";
import { LsPopup } from "./lesson-popup";
import { MASTER_NAME, LESSON_NAME } from "../utils/masterData";
import { LESSON_URL } from "../utils/url";
export class EditLesson {
    readonly page: Page;
    page1: Page;

    constructor(page: Page) {
        this.page = page;
    }
    public async editLesson(
        lessonType: 'oneTimeIndividual' | 'recurringGroup',
        option?: 'only' | 'following',
    ): Promise<void> {
        const lsCommonTest = new LsCommonTest(this.page);
        const lessonDialog = new LsPopup(this.page);
    
        // Click the Edit button
        await lsCommonTest.clickOnExactButton('Edit');
    
        // Fill in common fields
        await lessonDialog.getNextLessonDate('*Date');
        await lessonDialog.inputData('*Lesson Name',  'updated');
        await lessonDialog.inputData('* Start Time', LESSON_NAME.newStartTime);
        await lessonDialog.inputData('* End Time', LESSON_NAME.newEndTime);
        await lessonDialog.selectData('Teaching Medium', 'Online');
        await lessonDialog.searchAndSelectData('Search for classroom', LESSON_NAME.newClassroom);
    
        // Handle options for recurring lessons
        // await this.page.pause();
        if (lessonType === 'recurringGroup' && option) {
            if (option === 'only') {
                await lsCommonTest.clickOnExactButton('Save');
                await lsCommonTest.clickOnExactButton('Save');
            } else if (option === 'following') {
                await lsCommonTest.clickOnExactButton('Save');
                await this.page
                    .locator('label')
                    .filter({ hasText: 'This and the following lessons' })
                    .locator('span')
                    .first()
                    .click();
                await lsCommonTest.clickOnExactButton('Save');
            }
        } else {
            // Save for one-time lessons or default case
            await lsCommonTest.clickOnExactButton('Save');
        }
    }
    
    public async checkLessonInfo () {
        const viewNextDate = await this.getNextLessonDate();
        await this.page.locator("lightning-formatted-text").filter({ hasText: 'updated' }).click();
        await this.page.locator("lightning-formatted-text").filter({ hasText: `${viewNextDate}, ${LESSON_NAME.newStartTime}` }).click();
        await this.page.locator("lightning-formatted-text").filter({ hasText: `${viewNextDate}, ${LESSON_NAME.newEndTime}` }).click();
        await this.page.locator("lightning-formatted-text").filter({ hasText: 'Online' }).click();
    }

    public async getNextLessonDate () {
        const date = new Date();
        date.setDate(date.getDate() + 1);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const nextLessonDate = `${day}/${month}/${year}`;

        return nextLessonDate;
    }
}