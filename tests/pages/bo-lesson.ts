import { Page } from "@playwright/test";

export class BOLesson {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    public async searchStudent(value) {
        await this.page.getByPlaceholder('Enter Student Name').click({ timeout: 5000 });
        await this.page.getByPlaceholder('Enter Student Name').fill(value);
        await this.page.getByPlaceholder('Enter Student Name').press('Enter');
        
    }; 

    public async getLessonDateLink () {
        const date = new Date();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const lessonDateLink = `${year}/${month}/${day}`;

        return lessonDateLink;
    }

    public async openLessonDetail () {
        const boLesson = new BOLesson (this.page);
        const lessonDateLink = await boLesson.getLessonDateLink();
        await this.page.getByRole("link", { name: lessonDateLink }).nth(0).click();
    }
}