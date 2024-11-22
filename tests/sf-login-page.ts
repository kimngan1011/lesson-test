import { Page } from "@playwright/test";
import { ENV_BO } from "./utils/env";
export async function loginBO(page: Page, accessType: 'full' | 'partial') {
    await page.goto(ENV_BO.baseUrl);

    // Select locale
    await page.getByTestId('LocaleSwitcher').click();
    await page.getByTestId('LocaleButton-en').click();

    // Enter organization ID
    await page.getByTestId('OrganizationForm__textFieldOrganizations').click();
    await page.getByTestId('OrganizationForm__textFieldOrganizations').fill(ENV_BO.orgID);
    await page.getByTestId('OrganizationForm__buttonNext').click();

    // Handle different access types
    if (accessType === 'partial') {
        await page.getByTestId('StaffType__selector').getByRole('button', { name: '​' }).click();
        await page.getByRole('option', { name: 'Partial Access' }).click();
        await page.getByLabel('Log in').click();
        await page.getByPlaceholder('Username').click();
        await page.getByPlaceholder('Username').fill(ENV_BO.username);
        await page.getByPlaceholder('Password').click();
        await page.getByPlaceholder('Password').fill(ENV_BO.password);
        await page.getByRole('button', { name: 'Log in' }).click();
    } else if (accessType === 'full') {
        await page.getByTestId('StaffType__selector').getByRole('button', { name: '​' }).click();
        await page.getByRole('option', { name: 'Full Access' }).click();
        await page.getByLabel('Log in').click();
    }

    // Navigate to "Lesson Management"
    await page.getByText('Lesson').click({ timeout: 5000 });
    await page.getByLabel('Lesson Management').click();

    // Clear all filters
    await page.getByTestId('FormFilterAdvancedChipList__buttonClearAll').click();
}
