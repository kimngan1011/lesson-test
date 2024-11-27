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
        await this.page.waitForTimeout(7000);
        
    }; 

    public async getLessonDateLink (format: 'lessonDate' | 'lAStartDate') {
        const date = new Date();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        if (format === 'lessonDate') {
            const lessonDateLink = `${year}/${month}/${day}`;
            return lessonDateLink;
        }else if (format === 'lAStartDate') {
            const lAStartDate = `${year}-${month}-${day}`;
            return lAStartDate;
        }
    }

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

    public async openLessonDetail(isNext: boolean = false) {
        const boLesson = new BOLesson(this.page);
        const lessonDateLink = isNext 
            ? await boLesson.getNextLessonDateLink('nextLessonDate') 
            : await boLesson.getLessonDateLink('lessonDate');
        await this.page.getByRole("link", { name: lessonDateLink }).nth(0).click();
        await this.page.waitForTimeout(5000);
    }
}