import { expect, Page } from "@playwright/test";
export class MessageLesson {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    // Edit and publish lesson on BO
    public async editLessonBO () {
        await this.page.getByText('You have updated the lesson successfully').click();
    }

    // Collect attendance on BO
    public async collectAttendaneBO () {
        await this.page.getByText('You have collected the attendance successfully').click();
    }
}    
