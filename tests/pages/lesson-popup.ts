import { expect, Page } from "@playwright/test";

export class LsPopup {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    public async getLessonDate(fieldName: string) {
        const currentDate = new Date();
        const formatOptions = { day: 'numeric', month: 'short', year: 'numeric' } as any;
        const lessonDate = currentDate.toLocaleDateString('en-GB', formatOptions);
        await this.page.getByLabel(fieldName).click();
        await this.page.getByLabel(fieldName).fill(lessonDate);
    };

    public async inputData(fieldName: string, value: string) {
        await this.page.getByLabel(fieldName).click();
        await this.page.getByLabel(fieldName).fill(value);
    };

    public async selectData(fieldName: string, optionName: string) {
        await this.page.getByRole("combobox", { name: fieldName }).click();
        await this.page.getByRole("option", { name: optionName }).locator("span").nth(1).click();
    };

    public async searchAndSelectData(fieldName: string, optionName: string) {
        await this.page.getByPlaceholder(fieldName).click();
        await this.page.getByPlaceholder(fieldName).fill(optionName);
        await this.page.getByLabel(optionName).locator("span").nth(1).click();
    }

}

export class StudentPopup {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    public async inputData(fieldName: string, value: string) {
        await this.page.getByPlaceholder(fieldName).click();
        await this.page.getByPlaceholder(fieldName).fill(value);        
    };

    public async inputEmail(value: string) {
        await this.page.getByLabel('New Contact: Student').getByLabel('Email').click();
        await this.page.getByLabel('New Contact: Student').getByLabel('Email').fill(value);
        await this.page.locator('div').filter({ hasText: /^Username$/ }).nth(1).click();
    };
    public async selectPaymentMethod() {
        await this.page.getByLabel('Use Student as Payer').check();
        await this.page.getByPlaceholder('Search Payment Method').click();
        await this.page.getByPlaceholder('Search Payment Method').fill('gmo');
        await this.page.getByTitle('GMO Convenience Store').click();
    };

    public async selectAssociatedCourse() {
        await this.page.locator(`[class="product-item"] [data-row-number="1"] `).getByRole('gridcell', {name: `Select Item 1`}).waitFor({ state: "visible", timeout: 10000 });
        await this.page.locator(`[class="product-item"] [data-row-number="1"] `).getByRole('gridcell', {name: `Select Item 1`}).click();
    }
}       