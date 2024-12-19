import { expect, Page } from "@playwright/test";

// Create lesson popup
export class LsPopup {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  // Handle for Lesson date
  public async getLessonDate() {
    const currentDate = new Date();
    const formatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    } as any;
    const lessonDate = currentDate.toLocaleDateString("en-GB", formatOptions);

    return lessonDate;
  }

  public async getEndDate(fieldName: string) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 30);
    const formatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    } as any;
    const endDate = currentDate.toLocaleDateString("en-GB", formatOptions);
    await this.page.getByLabel(fieldName, { exact: true }).click();
    await this.page.getByLabel(fieldName, { exact: true }).fill(endDate);
  }

  public async getNextLessonDate() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const formatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    } as any;
    const nextLessonDate = currentDate.toLocaleDateString("en-GB", formatOptions);

    return nextLessonDate;
  }

  // Input data use label
  public async inputData(fieldName: string, value: string) {
    await this.page.getByLabel(fieldName).click();
    await this.page.getByLabel(fieldName).fill(value);
  }

  public async inputDataTextBox(fieldName: string, value: string) {
    await this.page.getByRole("textbox", { name: fieldName }).fill(value);
  }

  // select teaching medium and teaching method
  public async selectData(fieldName: string, optionName: string) {
    await this.page.getByRole("combobox", { name: fieldName }).click();
    await this.page.getByRole("option", { name: optionName }).locator("span").nth(1).click();
  }

  // Search and select data with placeholder
  public async searchAndSelectData(fieldName: string, optionName: string) {
    await this.page.getByPlaceholder(fieldName, { exact: true }).click();
    await this.page.getByPlaceholder(fieldName, { exact: true }).fill(optionName);
    await this.page.getByLabel(optionName).locator("span").nth(1).click();
  }

  // Recurring Setting
  public async getRecurringSetting(recurringType: "endDate" | "courseSchedule" | "oneTime") {
    if (recurringType == "oneTime") {
      await this.page.locator("lightning-primitive-input-checkbox span").nth(1).click();
    }
    if (recurringType == "endDate") {
      await this.page.locator("lightning-primitive-input-checkbox span").nth(1).click();
      await this.page.locator("label").filter({ hasText: "End Date" }).locator("span").first().click();
      await this.getEndDate("*");
    } else if (recurringType == "courseSchedule") {
      await this.page.locator("lightning-primitive-input-checkbox span").nth(1).click();
      await this.page.locator("label").filter({ hasText: "Course Schedule" }).locator("span").first().click();
    }
  }
}

// Create student popup
export class StudentPopup {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  public async inputData(fieldName: string, value: string) {
    await this.page.getByPlaceholder(fieldName).click();
    await this.page.getByPlaceholder(fieldName).fill(value);
  }

  public async inputEmail(value: string) {
    await this.page.getByLabel("New Contact: Student").getByLabel("Email").click();
    await this.page.getByLabel("New Contact: Student").getByLabel("Email").fill(value);
    await this.page
      .locator("div")
      .filter({ hasText: /^Username$/ })
      .nth(1)
      .click();
  }
  public async selectPaymentMethod() {
    await this.page.getByLabel("Use Student as Payer").check();
    await this.page.getByPlaceholder("Search Payment Method").click();
    await this.page.getByPlaceholder("Search Payment Method").fill("gmo");
    await this.page.getByTitle("GMO Convenience Store").click();
  }

  public async selectAssociatedCourse() {
    await this.page
      .locator(`[class="product-item"] [data-row-number="1"] `)
      .getByRole("gridcell", { name: `Select Item 1` })
      .waitFor({ state: "visible", timeout: 10000 });
    await this.page
      .locator(`[class="product-item"] [data-row-number="1"] `)
      .getByRole("gridcell", { name: `Select Item 1` })
      .click();
  }
}
