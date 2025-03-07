import { expect, Page } from "@playwright/test";
export class LsCommonTest {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to page
  public async navigateToPage(url) {
    await this.page.goto(url, { timeout: 15000 });
  }

  public async pinList() {
    await this.page.getByRole("button", { name: "Pin this list view." }).click();
  }

  // Click on button
  public async clickOnButton(btnName: string) {
    await this.page.getByText(btnName, { exact: true }).waitFor({ state: "visible", timeout: 15000 });
    await this.page.getByText(btnName, { exact: true }).click();
  }

  public async clickOnExactButton(btnName: string) {
    await this.page.getByRole("button", { name: btnName, exact: true }).waitFor({ state: "visible", timeout: 15000 });
    await this.page.getByRole("button", { name: btnName, exact: true }).click();

    // try {
    //   await this.page.getByRole("button", { name: btnName }).waitFor({ state: "visible", timeout: 15000 });
    //   await this.page.getByRole("button", { name: btnName, exact: true }).click();
    // } catch {
    //   await this.page.getByText(btnName, { exact: true }).waitFor({ state: "visible", timeout: 15000 });
    //   await this.page.getByText(btnName, { exact: true }).click();
    // }
  }

  // Search a list and open detail
  public async searchList(value) {
    await this.page.waitForSelector(".toastContent", { state: "visible" });
    await this.page.getByPlaceholder("Search this list...").click();
    await this.page.getByPlaceholder("Search this list...").fill(value);
    await this.page.getByPlaceholder("Search this list...").press("Enter");
    await this.page.getByRole("gridcell").first().click();
  }

  // Open hyperlink
  public async openHyperlink(value: string) {
    try {
      await this.page.getByRole("link", { name: value, exact: true }).first().click({ timeout: 5000 });
    } catch {
      await this.page
        .getByRole("rowheader", { name: `${value} Edit` })
        .getByRole("link")
        .first()
        .click();
    }
  }

  public async openRecurringLesson(lessonName: string) {
    await this.page.getByRole("link", { name: lessonName, exact: true }).nth(4).click();
  }

  // Search data in a popup
  public async searchData(name: string, value: string) {
    await this.page.getByPlaceholder(name).click();
    await this.page.getByPlaceholder(name).fill(value);
    await this.page.getByPlaceholder(name).press("Enter");
    await this.page.getByRole("gridcell", { name: "Select Item" }).locator("span").nth(1).click();
  }

  // Redirect to a tab
  public async redirectToTab(tabName: string) {
    await this.page.getByRole("tab", { name: tabName }).click();
    await this.page.waitForTimeout(2000);
  }

  // Select item student and teacher
  public async selectItem(itemName: string) {
    await this.page.getByRole("gridcell", { name: itemName }).locator("span").nth(1).click();
  }

  // Search and select data in lesson upsert
  public async searchAndSelectDataStandard(fieldName: string, optionName: string) {
    await this.page.getByPlaceholder(fieldName).click();
    await this.page.getByPlaceholder(fieldName).fill(optionName);
    await this.page.getByTitle(optionName, { exact: true }).click();
  }

  // Show more and click menu
  public async showMoreAndClickItem(value: string) {
    await this.page.getByRole("button", { name: "More Tabs" }).click();
    await this.page.getByRole("menuitem", { name: value }).click();
  }

  // Show quick action and click menu
  public async showActionAndClickItem(value: string) {
    await this.page.getByRole("button", { name: "Show actions" }).click();
    await this.page.getByRole("menuitem", { name: value }).click();
  }

  // Scroll page
  public async scrollPage() {
    await this.page.keyboard.press("PageDown");
  }

  // Open LC detail
  public async openLCDetail() {
    await this.page.keyboard.press("PageDown");
    await this.page.locator('a[href*="/lightning/r/MANAERP__Lesson_Schedule__c/"]').click();
    await this.page.waitForTimeout(2000);
  }

  // Select data in dropdown list
  public async selectDropdownList(dropdownName: string, value: string) {
    try {
      await this.page.getByRole("combobox", { name: dropdownName }).click();
    } catch {
      await this.page.locator("lightning-layout-item").filter({ hasText: dropdownName }).click();
    }

    await this.page.getByText(value, { exact: true }).click();
  }

  // Input data
  public async inputDataByLabel(labelName: string, value: string) {
    await this.page.getByLabel(labelName).click();
    await this.page.getByLabel(labelName).fill(value);
  }

  public async selectItemLessonList(actionType: "selectAll" | "singleSelect") {
    if (actionType === "selectAll") {
      try {
        await this.page.getByRole("cell", { name: "Select 5 items" }).locator("span").first().click({ timeout: 5000 });
      } catch {
        await this.page.getByRole("cell", { name: "Select 4 items" }).locator("span").first().click();
      }
    } else if (actionType === "singleSelect") {
      await this.page.getByRole("gridcell", { name: "Select item 1", exact: true }).locator("div span").click();
    }
  }
}
