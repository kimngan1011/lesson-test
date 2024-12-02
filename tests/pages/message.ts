import { expect, Page } from "@playwright/test";
export class MessageLesson {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    // Show success message when editing lesson on BO
    public async editLessonBO () {
        await this.page.getByText('You have updated the lesson successfully').click();
    }
}    
