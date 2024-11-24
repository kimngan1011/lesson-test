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

    public async createLesson(
        lessonType: 'oneTimeIndividual' | 'oneTimeGroup' | 'recurringGroup' | 'recurringIndividual',
        timeout: number = 5000
    ): Promise<string> {
        const lsCommonTest = new LsCommonTest(this.page);
        const lessonDialog = new LsPopup(this.page);
        const lessonName = randomText(10);
    
        // Set timeout and navigate to the lesson page
        await this.page.setDefaultTimeout(timeout);
        await lsCommonTest.navigateToPage(LESSON_URL.lesson);
        await lsCommonTest.clickOnButton('New');
    
        // Fill in common fields
        await lessonDialog.getLessonDate('*Date');
        await lessonDialog.inputData('*Lesson Name', lessonName);
        await lessonDialog.inputData('* Start Time', LESSON_NAME.startTime);
        await lessonDialog.inputData('* End Time', LESSON_NAME.endTime);
        await lessonDialog.searchAndSelectData('Search for location', MASTER_NAME.centerName);
    
        // Handle lesson type-specific actions
        const lessonTypeActions: Record<string, () => Promise<void>> = {
            oneTimeGroup: async () => {
                await lessonDialog.selectData('Teaching Method', 'Group');
                await lessonDialog.searchAndSelectData('Search for course', MASTER_NAME.courseMasterName);
                await lessonDialog.searchAndSelectData('Search for class', MASTER_NAME.className);
            },
            recurringGroup: async () => {
                await lessonDialog.selectData('Teaching Method', 'Group');
                await lessonDialog.searchAndSelectData('Search for course', MASTER_NAME.courseMasterName);
                await lessonDialog.searchAndSelectData('Search for class', MASTER_NAME.className);
                await lessonDialog.getRecurringSetting('endDate');
            },
            recurringIndividual: async () => {
                await lessonDialog.getRecurringSetting('endDate');
            }
        };
    
        if (lessonTypeActions[lessonType]) {
            await lessonTypeActions[lessonType]();
        }
    
        // Add classroom and save
        await lessonDialog.searchAndSelectData('Search for classroom', MASTER_NAME.classroomName);
        await lsCommonTest.clickOnButton('Save');
    
        return lessonName;
    }
    
    // Check lesson report info
    public async checkLessonReportInfo(value) {
        await this.page.locator('lightning-output-field').filter({ hasText: value }).click();
        await this.page.getByRole('heading', { name: 'Lesson Report Details (1)' }).click();

    };

    // Add a student to a lesson
    public async addStudent(value: string, options?: { save?: boolean; scope?: 'following' }): Promise<void> {
        const lsCommonTest = new LsCommonTest(this.page);
    
        // Step 1: Click "Add Students" button
        await lsCommonTest.clickOnExactButton('Add Students');
    
        // Step 2: Search for the student by name
        await lsCommonTest.searchData('Enter Student Name', value);
    
        // Step 3: Add the student
        await lsCommonTest.clickOnExactButton('Add');
    
        // Step 4: Select "This and the following lessons" if required
        if (options?.scope === 'following') {
            await this.page
                .locator('label')
                .filter({ hasText: 'This and the following lessons' })
                .locator('span')
                .first()
                .click();
        }
    
        // Step 5: Click "Save" if required
        if (options?.save) {
            await lsCommonTest.clickOnExactButton('Save');
        }
    
        // Step 6: Verify the student was added
        await this.page.getByText('Student Sessions(1)', { exact: true }).click();
    }

    // Check LA info
    public async checkStudentSession (value: string, info: string) {
        const page1Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: value }).click();
        await this.page.waitForTimeout(5000);
        const page1 = await page1Promise;
        page1.getByText(info); // 1/90 Lesson Allocated or 5/90 Lesson Allocated
        page1.close();
    };


    // Add a teacher to a lesson
    public async addTeacher(value: string, options?: { save?: boolean; scope?: 'following' }): Promise<void> {
        const lsCommonTest = new LsCommonTest(this.page);

        await lsCommonTest.clickOnExactButton('Add Teacher');
        await lsCommonTest.searchData('Enter Teacher Name', value);
        await lsCommonTest.clickOnExactButton('Add');
        if (options?.scope === 'following') {
            await this.page
                .locator('label')
                .filter({ hasText: 'This and the following lessons' })
                .locator('span')
                .first()
                .click();
        }
        if (options?.save) {
            await lsCommonTest.clickOnExactButton('Save');
        }
        await this.page.getByText('Lesson Teachers(1)', { exact: true }).click();
    }

    // Check teacher on lesson schedule 
    public async checkLessonScheduleInfo (value: string) {
        await this.page.keyboard.press('PageDown');
        await this.page.locator('a[href*="/lightning/r/MANAERP__Lesson_Schedule__c/"]').click();
        await this.page.getByRole('grid').getByText(value).nth(0).click();

    }
}    