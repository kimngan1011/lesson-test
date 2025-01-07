import { expect, Page } from "@playwright/test";
import { randomNumber, randomText } from "../utils/random";
import { LsCommonTest } from "./common-test";
import { LsPopup } from "./lesson-popup";
import { MASTER_NAME, LESSON_NAME } from "../utils/masterData";
import { LESSON_URL } from "../utils/url";
import { BOLesson } from "./bo-lesson";
export class EditLesson {
  readonly page: Page;
  page1: Page;

  constructor(page: Page) {
    this.page = page;
  }
  public async editLesson(
    lessonType: "oneTime" | "recurring",
    option?: "only" | "following"
  ): Promise<{ newLessonCode: string }> {
    const lsCommonTest = new LsCommonTest(this.page);
    const lessonDialog = new LsPopup(this.page);
    const newLessonCode = randomNumber();
    const nextLessonDate = await lessonDialog.getNextLessonDate();

    await this.page.waitForLoadState("domcontentloaded");
    await lsCommonTest.clickOnExactButton("Edit");

    await lessonDialog.inputData("*Date", nextLessonDate);
    await lessonDialog.inputData("*Lesson Name", "updated");
    await lessonDialog.inputData("* Start Time", LESSON_NAME.newStartTime);
    await lessonDialog.inputData("* End Time", LESSON_NAME.newEndTime);
    await lessonDialog.selectData("Teaching Medium", "Online");
    await lessonDialog.searchAndSelectData("Search for classroom", LESSON_NAME.newClassroom);
    await lessonDialog.inputDataTextBox("Lesson Code", newLessonCode);

    // Handle options for recurring lessons
    // await this.page.pause();
    if (lessonType === "recurring" && option) {
      if (option === "only") {
        await lsCommonTest.clickOnExactButton("Save");
        await lsCommonTest.clickOnExactButton("Save");
      } else if (option === "following") {
        await lsCommonTest.clickOnExactButton("Save");
        await this.page
          .locator("label")
          .filter({ hasText: "This and the following lessons" })
          .locator("span")
          .first()
          .click();
        await lsCommonTest.clickOnExactButton("Save");
      }
    } else {
      // Save for one-time lessons or default case
      await lsCommonTest.clickOnExactButton("Save");
    }

    return { newLessonCode };
  }

  public async updateCancellationReason() {
    const lsCommonTest = new LsCommonTest(this.page);
    const lessonDialog = new LsPopup(this.page);

    await lsCommonTest.clickOnExactButton("Edit");
    await lsCommonTest.selectDropdownList("Cancellation Reason", "Acts of nature");
    const modal = await lsCommonTest.clickOnExactButton("Save");
    await this.page
      .locator("label")
      .filter({ hasText: "This and the following lessons" })
      .locator("span")
      .first()
      .click();
    await lsCommonTest.clickOnExactButton("Save");
  }

  public async checkLessonInfoSF() {
    const viewNextDate = await this.getNextLessonDate();
    await this.page.locator("lightning-formatted-text").filter({ hasText: "updated" }).click();
    await this.page
      .locator("lightning-formatted-text")
      .filter({ hasText: `${viewNextDate}, ${LESSON_NAME.newStartTime}` })
      .click();
    await this.page
      .locator("lightning-formatted-text")
      .filter({ hasText: `${viewNextDate}, ${LESSON_NAME.newEndTime}` })
      .click();
    await this.page.locator("lightning-formatted-text").filter({ hasText: "Online" }).click();
  }

  // Check lesson info on BO after editing
  public async checkLessonInfoBO(
    lessonType: "oneTimeIndividual" | "oneTimeGroup" | "recurringIndividual" | "recurringGroup"
  ) {
    const boLesson = new BOLesson(this.page);
    const lessonDate = await boLesson.getNextLessonDateLink("nextLessonDate");
    const endDate = await boLesson.getEndDate();
    const lsCommonTest = new LsCommonTest(this.page);

    await this.page.getByText(`Draft${lessonDate}`).click();
    await this.page.getByText(`Lesson Date${lessonDate}`).click();
    await this.page.getByText(LESSON_NAME.newStartTimeBO).click();
    await this.page.getByText(LESSON_NAME.newEndTimeBO).click();
    await this.page.getByText("Teaching MediumOnline").click();
    await this.page.getByText("Lesson Nameupdated").click();
    await this.page.getByText("Location[E2E] Brand A - Center").click();
    await this.page.getByText(`${MASTER_NAME.classroomName}, ${LESSON_NAME.newClassroom}`).click();
    await this.page.getByText("Lesson Capacity20").click();
    switch (lessonType) {
      case "oneTimeIndividual":
        await this.page.getByText("Teaching MethodIndividual").click();
        await this.page.getByText("Saving OptionOne Time").click();
        break;

      case "recurringIndividual":
        await this.page.getByText("Teaching MethodIndividual").click();
        await this.page.getByText("Saving OptionWeekly Recurring").click();
        await this.page.getByText(`End Date${endDate}`).click();
        break;

      case "recurringGroup":
        await this.page.getByText("Teaching MethodGroup").click();
        await this.page.getByText(`Course${MASTER_NAME.courseMasterName}`).click();
        await this.page.getByText(`Class${MASTER_NAME.className}`).click();
        await this.page.getByText("Saving OptionWeekly Recurring").click();
        await this.page.getByText(`End Date${endDate}`).click();
        break;
    }
  }

  public async checkLessonCodeBO(lessonType: "oneTime" | "recurring", lessonCode: string): Promise<boolean> {
    try {
      if (lessonType === "oneTime") {
        await this.page.getByText(lessonCode, { exact: true }).click();
      } else if (lessonType === "recurring") {
        for (let i = 0; i < 3; i++) {
          const modifiedLessonCode = (Number(lessonCode) + i).toString();
          // if false return false now
          try {
            await this.page.getByText(modifiedLessonCode, { exact: true }).click();
          } catch {
            return false;
          }
        }
      }
      return true;
    } catch {
      return false;
    }
  }
  public async getNextLessonDate() {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const nextLessonDate = `${day}/${month}/${year}`;

    return nextLessonDate;
  }

  // Remove a student from a lesson
  public async removeStudent(options?: { save?: boolean; scope?: "following" }): Promise<void> {
    const lsCommonTest = new LsCommonTest(this.page);

    await this.page.waitForTimeout(3000);
    await this.page.getByRole("columnheader", { name: "Choose a Row Select All" }).locator("span").nth(2).click();
    await lsCommonTest.clickOnExactButton("Remove Students");

    // Step 4: Select "This and the following lessons" if required
    if (options?.scope === "following") {
      await this.page
        .locator("label")
        .filter({ hasText: "This and the following lessons" })
        .locator("span")
        .first()
        .click();
      await this.page.getByRole("button", { name: "Save" }).click();
    }

    // Step 5: Click "Save" if required
    if (options?.save) {
      await lsCommonTest.clickOnExactButton("Save");
    }
  }

  // Remove a teacher from a lesson
  public async removeTeacher(options?: { save?: boolean; scope?: "following" }): Promise<void> {
    const lsCommonTest = new LsCommonTest(this.page);

    await lsCommonTest.showActionAndClickItem("Delete");
    await lsCommonTest.clickOnExactButton("Confirm");

    // Step 4: Select "This and the following lessons" if required
    if (options?.scope === "following") {
      await this.page
        .locator("label")
        .filter({ hasText: "This and the following lessons" })
        .locator("span")
        .first()
        .click();
      await this.page.getByRole("button", { name: "Save" }).click();
    }

    // Step 5: Click "Save" if required
    if (options?.save) {
      await lsCommonTest.clickOnExactButton("Save");
    }
  }

  public async updateLessonStatus(
    lessonStatus:
      | "draftToPublished"
      | "draftToCancelled"
      | "publishedToCompleted"
      | "publishedToCancelled"
      | "publishedToDraft"
      | "completedToPublished"
      | "cancelledToDraft"
  ) {
    await this.page.waitForLoadState("load");
    switch (lessonStatus) {
      case "draftToPublished":
        await this.page.getByTitle("Published", { exact: true }).click();
        await this.page.locator("button").filter({ hasText: "Mark as Current Status" }).click();
        break;

      case "draftToCancelled":
        await this.page.getByTitle("Cancelled").click();
        await this.page.locator("button").filter({ hasText: "Mark as Current Status" }).click();
        break;

      case "publishedToCompleted":
        await this.page.getByTitle("Completed").click();
        await this.page.locator("button").filter({ hasText: "Mark as Current Status" }).click();
        break;

      case "publishedToCancelled":
        await this.page.getByTitle("Cancelled").click();
        await this.page.locator("button").filter({ hasText: "Mark as Current Status" }).click();
        await this.page.waitForTimeout(3000);
        break;

      case "publishedToDraft":
        await this.page.getByText("stage completeDraft").click();
        await this.page.locator("button").filter({ hasText: "Mark as Current Status" }).click();
        break;

      case "completedToPublished":
        await this.page.getByText("stage completePublished").click();
        await this.page.locator("button").filter({ hasText: "Mark as Current Status" }).click();
        break;

      case "cancelledToDraft":
        await this.page.getByText("stage completeDraft").click();
        await this.page.locator("button").filter({ hasText: "Mark as Current Status" }).click();
        break;
    }
  }

  public async bulkUpdateLessonStatus(
    lessonStatusBefore?: string,
    lessonStatusAfter?: string,
    option?: { OK?: boolean }
  ) {
    const lsCommonTest = new LsCommonTest(this.page);

    await lsCommonTest.clickOnExactButton("Bulk update Lesson Status");
    await this.page
      .getByLabel("Bulk update Lesson Status")
      .getByText(lessonStatusBefore as string)
      .click();
    await this.page.getByRole("option", { name: lessonStatusAfter }).click();
    await lsCommonTest.clickOnExactButton("Save");
    if (!option?.OK) {
      await lsCommonTest.clickOnExactButton("OK");
    }
  }

  public async checkLessonStatus(lessonStatusInfo) {
    await this.page
      .getByLabel("Recently Viewed|Lessons|List")
      .getByText(lessonStatusInfo, { exact: true })
      .nth(3)
      .click();
  }

  // Update attendance info on SF
  public async updateAttendanceInfo(attendanceStatus: "attend" | "absent" | "late") {
    const lsCommonTest = new LsCommonTest(this.page);

    await this.page
      .locator("span")
      .filter({ hasText: /^Show actions$/ })
      .nth(2)
      .click();
    await this.page.getByRole("menuitem", { name: "Edit" }).click();
    await lsCommonTest.selectDropdownList("Attendance Notice", "In Advance");
    await lsCommonTest.selectDropdownList("Attendance Reason", "Family Reasons");
    await lsCommonTest.inputDataByLabel("Attendance Note", "Attendance Note");

    switch (attendanceStatus) {
      case "attend":
        await lsCommonTest.selectDropdownList("Attendance Status", "Attend");
        break;

      case "absent":
        await lsCommonTest.selectDropdownList("Attendance Status", "Absent");
        break;

      case "late":
        await lsCommonTest.selectDropdownList("Attendance Status", "Late, Leave Early");
        break;
    }

    await lsCommonTest.clickOnExactButton("Save");
  }
}
