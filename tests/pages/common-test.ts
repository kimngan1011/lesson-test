import { expect, Page } from "@playwright/test";
export class LsCommonTest {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    // Navigate to page
    public async navigateToPage(url) {
        await this.page.goto(url);
    };

    // Click on button
    public async clickOnButton(btnName: string) {
        await this.page.getByRole("button", { name: btnName }).waitFor({ state: "visible", timeout: 10000 });
        await this.page.getByRole("button", { name: btnName }).click();
    };

    public async clickOnExactButton(btnName: string){

        await this.page.getByRole("button", { name: btnName, exact: true }).waitFor({ state: "visible", timeout: 10000 });
        await this.page.getByRole("button", { name: btnName, exact: true }).click();
    };        

    // Search a list
    public async searchList(value) {
        await this.page.getByPlaceholder('Search this list...').click({ timeout: 5000 });
        await this.page.getByPlaceholder('Search this list...').fill(value);
        await this.page.getByPlaceholder('Search this list...').press('Enter');
        await this.page.getByRole("link", { name: value }).click();
    };

    public async searchRecurringLesson(value) {
        await this.page.getByPlaceholder('Search this list...').click({ timeout: 5000 });
        await this.page.getByPlaceholder('Search this list...').fill(value);
        await this.page.getByPlaceholder('Search this list...').press('Enter');
        await this.page.getByRole("link", { name: value }).nth(4).click();
    }

    // Search data in a popup

    public async searchData(name: string, value: string) {
        await this.page.getByPlaceholder(name).click();
        await this.page.getByPlaceholder(name).fill(value);
        await this.page.getByPlaceholder(name).press('Enter');
        await this.page.getByRole('gridcell', { name: 'Select Item' }).locator('span').nth(1).click();
    }

    // Redirect to a tab
    public async redirectToTab(tabName: string) {
        await this.page.getByRole("tab", { name: tabName }).click();
        await this.page.waitForTimeout(5000);
    };

    public async selectItem(itemName: string) {
          await this.page.getByRole('gridcell', { name: itemName }).locator('span').nth(1).click();

    };

    public async searchAndSelectDataStandard(fieldName: string, optionName: string) {
        await this.page.getByPlaceholder(fieldName).click();
        await this.page.getByPlaceholder(fieldName).fill(optionName);
        await this.page.getByTitle(optionName, { exact: true }).click();

    };
}    
