import { expect, Page } from "@playwright/test";
import { randomText } from "../utils/random";
import { LsCommonTest } from "./common-test";
import { LsPopup } from "./lesson-popup";
import { MASTER_NAME, LESSON_NAME } from "../utils/masterData";
import { LESSON_URL } from "../utils/url";
import { BOLesson } from "./bo-lesson";
export class CreateLesson {
    readonly page: Page;
    page1: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async createLesson(
        lessonType: 'oneTimeIndividual' | 'oneTimeGroup' | 'recurringGroup' | 'recurringIndividual',
        timeout: number = 10000
    ): Promise<string> {
        const lsCommonTest = new LsCommonTest(this.page);
        const lessonDialog = new LsPopup(this.page);
        const lessonName = randomText(10);
    
        // Set timeout and navigate to the lesson page
        await this.page.setDefaultTimeout(timeout);
        await lsCommonTest.navigateToPage(LESSON_URL.lesson);
        await lsCommonTest.clickOnExactButton('New');
    
        // Fill in common fields
        await lessonDialog.getLessonDate('*Date' );
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
        await lsCommonTest.clickOnExactButton('Save');
    
        return lessonName;
    }

    // Check lesson info on BO
    public async checkLessonInfo (
        lessonName: string,
        lessonType: 'oneTimeIndividual' | 'oneTimeGroup' | 'recurringIndividual' | 'recurringGroup') {
            
        const boLesson = new BOLesson(this.page);
        const lessonDate = await boLesson.getLessonDateLink('lessonDate');
        const endDate = await boLesson.getEndDate();
        const lsCommonTest = new LsCommonTest(this.page);

        await this.page.getByText(`Draft${lessonDate}`).click();
        await this.page.getByText(`Lesson Date${lessonDate}`).click();
        await this.page.getByText(LESSON_NAME.startTime).click();
        await this.page.getByText(LESSON_NAME.endTime).click();
        await this.page.getByText('Teaching MediumOnline').click();
        await this.page.getByText(`Lesson Name${lessonName}`).click();
        await this.page.getByText('Location[E2E] Brand A - Center').click();
        await this.page.getByText(MASTER_NAME.classroomName).click();
        await this.page.getByText('Lesson Capacity10').click();
        await lsCommonTest.scrollPage();
        switch (lessonType) {
            case 'oneTimeIndividual':
                await this.page.getByText(LESSON_NAME.teacherOneTimeIndividual).click();
                await this.page.getByText('Teaching MethodIndividual').click();
                await this.page.getByText('Saving OptionOne Time').click();
                break;
        
            case 'oneTimeGroup':
                await this.page.getByText(LESSON_NAME.teacherOneTimeGroup).click();
                await this.page.getByText('Teaching MethodGroup').click();
                await this.page.getByText(`Course${MASTER_NAME.courseMasterName}`).click();
                await this.page.getByText(`Class${MASTER_NAME.className}`).click();
                await this.page.getByText('Saving OptionOne Time').click();
                break;
        
            case 'recurringIndividual':
                await this.page.getByText(LESSON_NAME.teacherRecurringIndividual).click();
                await this.page.getByText('Teaching MethodIndividual').click();
                await this.page.getByText('Saving OptionWeekly Recurring').click();
                await this.page.getByText(`End Date${endDate}`).click();
                break;
        
            case 'recurringGroup':
                await this.page.getByText(LESSON_NAME.teacherRecurringGroup).click();
                await this.page.getByText('Teaching MethodGroup').click();
                await this.page.getByText(`Course${MASTER_NAME.courseMasterName}`).click(); // bug
                await this.page.getByText(`Class${MASTER_NAME.className}`).click();
                await this.page.getByText('Saving OptionWeekly Recurring').click();
                await this.page.getByText(`End Date${endDate}`).click();
                break;
          }
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
    }    

    // Check student session info
    public async checkStudentSessionInfo(studentSessionInfo: string) {
        await this.page.getByText(studentSessionInfo, { exact: true }).click(); // Student Sessions(1)
    };

    // Check LA info
    public async getLessonAllocatedBefore (studentName: string) {
        const page1Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: studentName }).click();
        const page1 = await page1Promise;
        await this.page.waitForTimeout(5000);

        const url = await page1.url();
        const lessonAllocatedBefore = await page1.getByRole('alert').textContent();
        const splitLessonAllocatedBefore = lessonAllocatedBefore?.split('/')
        const splitassignedLessonBefore = splitLessonAllocatedBefore?.[0];
        const assignedLessonBefore = splitassignedLessonBefore?.slice(splitassignedLessonBefore?.length-1);

        await page1.close();
        return {assignedLessonBefore, url}
    };

    public async getLessonAllocatedAfter () {
        const lessonAllocatedAfter = await this.page.getByRole('alert').textContent();

        const splitLessonAllocatedAfter = lessonAllocatedAfter?.split('/')
        const splitassignedLessonAfter = splitLessonAllocatedAfter?.[0];
        const assignedLessonAfter = splitassignedLessonAfter?.slice(splitassignedLessonAfter?.length-1);

        return assignedLessonAfter;
    }

    public async increaseAssignedLesson (lessonAssignedBefore: string, lessonAllocatedAfter: string) {

        if (Number(lessonAllocatedAfter) === Number(lessonAssignedBefore || '0') + 1) {
            return true;
        } else return false;
    }

    public async decreaseAssignedLesson (lessonAssignedBefore: string, lessonAllocatedAfter: string) {

        if (Number(lessonAllocatedAfter) === Number(lessonAssignedBefore || '0') - 1) {
            return true;
        } else return false;
    }

    public async removeAllAssignedLesson (lessonAllocatedAfter: string) {

        if (Number(lessonAllocatedAfter) === 0) {
            return true;
        } else return false;
    }




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
    }

    // Check Lesson Teacher
    public async checkLessonTeacher (lessonTeacherInfo: string) {
        await this.page.getByText(lessonTeacherInfo, { exact: true }).click(); // Lesson Teachers(1)
    }

    // Check teacher on lesson schedule 
    public async checkLessonScheduleInfo (value: string) {
        await this.page.keyboard.press('PageDown');
        await this.page.locator('a[href*="/lightning/r/MANAERP__Lesson_Schedule__c/"]').click();
        await this.page.getByRole('grid').getByText(value).nth(0).click();
        await this.page.waitForTimeout(7000);
    }
}    