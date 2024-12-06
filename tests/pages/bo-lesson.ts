import { Page } from "@playwright/test";
import { LESSON_NAME, MASTER_NAME } from "../utils/masterData";
import { LsCommonTest } from "./common-test";
import { randomText } from "../utils/random";
import { LsPopup } from "./lesson-popup";

export class BOLesson {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    // Search student on BO
    public async searchStudent(value) {
        await this.page.getByPlaceholder('Enter Student Name').click({ timeout: 5000 });
        await this.page.getByPlaceholder('Enter Student Name').fill(value);
        await this.page.getByPlaceholder('Enter Student Name').press('Enter');
        await this.page.waitForTimeout(7000);
        
    }; 

    // Filter teacher on BP
    public async filterTeacher(lessonType: 'oneTimeIndividual' | 'oneTimeGroup' | 'recurringIndividual' | 'recurringGroup') {
        await this.page.getByTestId('MButtonDropdownWithPopover__button').click();
        // await this.page.getByTestId('FilterLessonList__lessonStatuses').getByLabel('Open').click();
        // await this.page.getByRole('option', { name: 'Draft' }).click();
        await this.page.locator('div').filter({ hasText: /^Teacher Name$/ }).click();

        switch (lessonType){
            case 'oneTimeIndividual':
                await this.page.getByTestId('FilterLessonList__teachers').getByLabel('Teacher Name').fill(LESSON_NAME.teacherOneTimeIndividual);
                await this.page.getByTestId('MTooltipBase').getByText(LESSON_NAME.teacherOneTimeIndividual).click();
                break;

            case 'oneTimeGroup':
                await this.page.getByTestId('FilterLessonList__teachers').getByLabel('Teacher Name').fill(LESSON_NAME.teacherOneTimeGroup);
                await this.page.getByTestId('MTooltipBase').getByText(LESSON_NAME.teacherOneTimeGroup).click();
                break; 

            case 'recurringIndividual': 
                await this.page.getByTestId('FilterLessonList__teachers').getByLabel('Teacher Name').fill(LESSON_NAME.teacherRecurringIndividual);
                await this.page.getByTestId('MTooltipBase').getByText(LESSON_NAME.teacherRecurringIndividual).click();
                break; 
                
            case 'recurringGroup':
                await this.page.getByTestId('FilterLessonList__teachers').getByLabel('Teacher Name').fill(LESSON_NAME.teacherRecurringGroup);
                await this.page.getByTestId('MTooltipBase').getByText(LESSON_NAME.teacherRecurringGroup).click();
                break;    
            } 

        await this.page.getByTestId('MButtonDropdownWithPopover__buttonApply').click(); 

    }

    // Get Lesson Date
    public async getLessonDateLink (format: 'lessonDate' | 'lAStartDate' | 'orderStartDate') {
        const date = new Date();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        if (format === 'lessonDate') {
            const lessonDateLink = `${year}/${month}/${day}`;
            return lessonDateLink;
        } if (format === 'orderStartDate') {
            const lessonDateLink = `${day}/${month}/${year}`;
            return lessonDateLink;
        } else if (format === 'lAStartDate') {
            const lAStartDate = `${year}-${month}-${day}`;
            return lAStartDate;
        }
    }

    public 

    // Get Next Lesson Date
    public async getNextLessonDateLink (format: 'nextLessonDate' | 'lAEndDate') {
        const date = new Date();
        date.setDate(date.getDate() + 1);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        if (format === 'nextLessonDate') {
            const nextLessonDateLink = `${year}/${month}/${day}`;
            return nextLessonDateLink;
        }else if (format === 'lAEndDate') {
            const lAEndDate = `${year}-${month}-${day}`;
            return lAEndDate;
        }
    }

    // Get end date
    public async getEndDate () {
        const date = new Date();
        date.setDate(date.getDate() + 30);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const endDate = `${year}/${month}/${day}`;

        return endDate;
    }

    // Open lesson detail
    public async openLessonDetail(isNext: boolean = false) {
        const boLesson = new BOLesson(this.page);
        const lessonDateLink = isNext 
            ? await boLesson.getNextLessonDateLink('nextLessonDate') 
            : await boLesson.getLessonDateLink('lessonDate');
        await this.page.getByRole("link", { name: lessonDateLink }).nth(0).click();
        await this.page.waitForTimeout(5000);
    }

    // Edit lesson on BO
    public async editLesson(
        lessonName: string,
        lessonType: 'oneTimeIndividual' | 'recurringGroup',
        option?: 'only' | 'following'
    ): Promise<void> {
        const lsCommonTest = new LsCommonTest(this.page);
        const boLesson = new BOLesson(this.page);
        const lessonDate = await boLesson.getNextLessonDateLink('nextLessonDate');
    
        // Click the Edit button
        await this.page.getByTestId('TabLessonDetailSF__buttonEdit').click();
    
        // Fill in common fields
        await this.page.getByTestId('MDatePickerHF__input').click();
        await this.page.getByTestId('MDatePickerHF__input').fill(lessonDate as string); 
        await this.page.getByTestId('SectionLessonTime__startTime').locator('div').nth(1).click();
        await this.page.getByLabel('End Time *').fill('13:00');
        await this.page.getByTestId('MTooltipBase').getByText('13:00').click();
        await this.page.getByTestId('SectionLessonTime__endTime').locator('div').nth(1).click();
        await this.page.getByTestId('SectionLessonTime__endTime').locator('#AutocompleteTimeOfDayHF__autocomplete').fill('14:00');
        await this.page.getByRole('listbox', { name: 'Start Time' }).click();
        await this.page.getByLabel('Offline').click();
        await this.page.getByRole('option', { name: 'Online' }).click();
        await this.page.getByTestId('SectionLessonNameSF__textField').getByTestId('MTextFieldHF__input').click();
        await this.page.getByTestId('SectionLessonNameSF__textField').getByTestId('MTextFieldHF__input').fill(lessonName);
        // PT Teacher cannot edit teacher
        // await this.page.getByLabel('Teacher *').click();
        // await this.page.getByTestId('SectionTeacherSF__autocomplete').getByLabel('Teacher *').fill(LESSON_NAME.teacherAdded);
        // await this.page.getByRole('option', { name: LESSON_NAME.teacherAdded }).click();
        await this.page.getByLabel('Classroom').click();
        await this.page.getByTestId('SectionClassroom__autocomplete').getByLabel('Classroom').fill(LESSON_NAME.newClassroom);
        await this.page.getByTestId('MTooltipBase').getByText(LESSON_NAME.newClassroom).click();
        await this.page.getByLabel('Lesson Capacity').click();
        await this.page.getByLabel('Lesson Capacity').fill('20');
        await this.page.getByTestId('SectionLiveStreamingSF__textField').getByTestId('MTextFieldHF__input').click();
        await this.page.getByTestId('SectionLiveStreamingSF__textField').getByTestId('MTextFieldHF__input').fill('https://us06web.zoom.us/j/83241203966');
        await this.page.getByTestId('SectionCancelLessonSF__select').getByLabel('').click();
        await this.page.getByRole('option', { name: 'Acts of nature' }).click();
        await lsCommonTest.scrollPage();
        await this.page.getByTestId('FooterLessonUpsert__buttonSave').click();

        // Handle options for recurring lessons
        if (lessonType === 'recurringGroup' && option) {
            if (option === 'only') {
                await this.page.locator('div').filter({ hasText: /^Apply$/ }).click();
            } if (option === 'following') {
                await this.page.getByLabel('This and the following lessons').click();
                await this.page.locator('div').filter({ hasText: /^Apply$/ }).click();
            }
        } 
    }

    // Edit lesson name
    public async editLessonName(
        lessonName: string,
        lessonType: 'oneTimeIndividual' | 'recurringGroup',
        option?: 'only' | 'following'
    ): Promise<void> {
        const lsCommonTest = new LsCommonTest(this.page);
    
        await this.page.getByTestId('TabLessonDetailSF__buttonEdit').click();
        await this.page.getByTestId('SectionLessonNameSF__textField').getByTestId('MTextFieldHF__input').click();
        await this.page.getByTestId('SectionLessonNameSF__textField').getByTestId('MTextFieldHF__input').fill(lessonName);
        await lsCommonTest.scrollPage();
        await this.page.getByTestId('FooterLessonUpsert__buttonSave').click();

        // Handle options for recurring lessons
        if (lessonType === 'recurringGroup' && option) {
            if (option === 'only') {
                await this.page.locator('div').filter({ hasText: /^Apply$/ }).click();
            } if (option === 'following') {
                await this.page.getByLabel('This and the following lessons').click();
                await this.page.locator('div').filter({ hasText: /^Apply$/ }).click();
            }
        } 
    }

    // Check lesson info on BO
    public async checkUpdatedLessonInfo (
        lessonName: string,
        lessonType: 'oneTimeIndividual' | 'oneTimeGroup' | 'recurringIndividual' | 'recurringGroup') {
            
        const boLesson = new BOLesson(this.page);
        const lessonDate = await boLesson.getNextLessonDateLink('nextLessonDate');
        const endDate = await boLesson.getEndDate();
        const lsCommonTest = new LsCommonTest(this.page);

        await this.page.getByText(`Published${lessonDate}`).click();
        await this.page.getByText(`Lesson Date${lessonDate}`).click();
        await this.page.getByText('Start Time13:00').click();
        await this.page.getByText('End Time14:00').click();
        await this.page.getByText('Teaching MediumOnline').click();
        await this.page.getByText(`Lesson Name${lessonName}`).click();
        await this.page.getByText('Location[E2E] Brand A - Center').click();
        await this.page.getByText(`${MASTER_NAME.classroomName}, ${LESSON_NAME.newClassroom}`).click();
        await this.page.getByText('Lesson Capacity20').click();
        await this.page.getByText('Cancellation ReasonActs of nature').click();
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

    // Publish lesson on BO
    public async publishLessonOnBO () {
        await this.page.getByLabel('Select all items').check();
        await this.page.getByTestId('ActionPanel__trigger').click();
        await this.page.getByLabel('Bulk Publish Lesson').click();
        await this.page.getByTestId('MFooterDialogConfirm__buttonConfirm').click();
    }

    // Collect Attendance on BO
    public async collectAttendanceOnBO (attendanceType: 'attend' | 'absent' | 'late' | 'allAttend') {
        const lsCommonTest = new LsCommonTest(this.page);

        await lsCommonTest.redirectToTab ('Student');
        await this.page.getByTestId('ActionPanel__trigger').click();
        await this.page.getByLabel('Collect Attendance').click();
        switch (attendanceType) {
            case 'attend':
                await this.page.getByTestId('MDialogCustom__content').getByLabel('Attend').check();
                await this.page.getByRole('button').nth(1).click();
                await this.page.getByTestId('MTextFieldHF__input').click();
                await this.page.getByTestId('MTextFieldHF__input').fill('Remark');
                await this.page.getByRole('button', { name: 'Save' }).click();
                await this.page.getByRole('button', { name: 'Save' }).click();
                await this.page.getByRole('cell', { name: 'Attend' }).click();
                break;

            case 'allAttend':
                await this.page.getByRole('button', { name: 'Mark All As Attend' }).click();
                await this.page.getByRole('button', { name: 'Save' }).click();
                await this.page.getByRole('cell', { name: 'Attend' }).click();
                break;
        
            case 'absent':
                await this.page.getByLabel('Absent').click();
                await this.page.getByTestId('MTextFieldHF__input').click();
                await this.page.getByTestId('MTextFieldHF__input').fill('Remark');
                await this.page.waitForTimeout(3000);
                await this.page.getByRole('button', { name: 'Save' }).click();
                await this.page.getByLabel('Reallocate').check();
                await this.page.getByRole('button', { name: 'Save' }).click();
                await this.page.getByTestId('CheckIcon').click();
                await this.page.getByRole('cell', { name: 'Absent' }).click();
                break;
        
            case 'late':
                await this.page.getByLabel('Late, Leave Early').click({ force: true });
                await this.page.getByLabel('Physical Reasons').check();
                await this.page.getByRole('button', { name: 'Save' }).click();
                await this.page.getByRole('button', { name: 'Save' }).click();
                await this.page.getByRole('cell', { name: 'Late, Leave Early' }).click();
                break;
        }
    }

    // Check attendance info
    public async checkAttendAndLate (attendanceStatus: string) {
        await this.page.getByRole('gridcell', { name: attendanceStatus }).locator('span').click();
    }    

    public async checkAbsent (attendanceStatus: string, attendanceReason: string, attendanceNotice: string) {
        await this.page.getByRole('gridcell', { name: attendanceStatus }).locator('span').click();
        await this.page.getByRole('gridcell', { name: attendanceReason }).locator('span').click();
        await this.page.getByRole('gridcell', { name: attendanceNotice }).locator('span').click();
        await this.page.getByRole('gridcell', { name: 'True' }).locator('span').first().click();  
    }   
    
    // Remove student on BO
    public async removeStudentOnBO (
        lessonType: 'oneTimeIndividual' | 'recurringGroup',
        option?: 'only' | 'following'
    ): Promise<void> {
        await this.page.getByLabel('Select all items').check();
        await this.page.getByTestId('ActionPanel__trigger').click();
        await this.page.getByLabel('Remove Student').click();

        if (lessonType === 'recurringGroup' && option === 'only') {
            await this.page.getByRole('button', { name: 'Apply' }).click();
        } else if (lessonType === 'recurringGroup' && option === 'following') {
            await this.page.getByLabel('This and the following lessons').check();
            await this.page.getByRole('button', { name: 'Apply' }).click();
        }
    }    
}
