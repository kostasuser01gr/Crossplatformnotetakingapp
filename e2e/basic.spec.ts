import { test, expect } from '@playwright/test'

test.describe('Notes App', () => {
  test('should load the app', async ({ page }) => {
    await page.goto('/')
    
    // Check that the app title is present
    await expect(page.locator('text=Notes')).toBeVisible()
  })

  test('should create a note', async ({ page }) => {
    await page.goto('/')
    
    // Wait for the app to load
    await page.waitForTimeout(1000)
    
    // Click new note button
    const newNoteButton = page.locator('button:has-text("New Note")')
    if (await newNoteButton.isVisible()) {
      await newNoteButton.click()
      
      // Wait a bit for note creation
      await page.waitForTimeout(500)
      
      // Verify a note list item appears
      const noteItems = page.locator('[data-note-id], button:has-text("Untitled")')
      const count = await noteItems.count()
      expect(count).toBeGreaterThan(0)
    }
  })
})
