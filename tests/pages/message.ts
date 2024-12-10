import { expect, Page } from "@playwright/test";
export class MessageLesson {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  // Edit and publish lesson on BO
  public async editLessonBO() {
    await this.page
      .getByText("You have updated the lesson successfully")
      .click();
  }

  // Collect attendance on BO
  public async collectAttendaneBO() {
    await this.page
      .getByText("You have collected the attendance successfully")
      .click();
  }

  // Remove student on BO
  public async removeStudentBO() {
    await this.page.getByText("Removed successfully").click();
  }

  // Remove teacher on SF
  public async removeTeacherSF() {
    await this.page.getByText("You have remove teacher successfully").click();
  }

  // Remove student on SF
  public async removeStudentSF() {
    await this.page.getByText("You have remove student successfully").click();
  }

  // Change lesson status on SF
  public async changeLessonStatus() {
    await this.page.getByText("Status changed successfully.").click();
  }

  // Bulk update lesson status
  public async bulkUpdateLessonStatus() {
    await this.page.getByText("Update lesson status successfully").click();
  }
}
