# Documentation Images

This directory contains screenshots and images used in the documentation.

## Required Screenshots

The following screenshots should be captured from Thunderbird and added to this directory:

1. **settings-page.png** - Screenshot of the add-on settings page showing:
   - API key configuration field
   - API endpoint URL field
   - Custom prompt templates section
   - Cache retention settings
   - Test Connection and Save Settings buttons

2. **compose-window-icon.png** - Screenshot of Thunderbird compose window showing:
   - The Gemini Mail Review icon in the toolbar
   - Highlighted or circled for clarity

3. **popup-template-selection.png** - Screenshot of the popup when first opened:
   - Template selection dropdown
   - Custom prompt text area
   - Analyze Email button

4. **popup-analyzing.png** - Screenshot showing the analysis in progress:
   - Loading indicator
   - "Analyzing your email..." message

5. **popup-results.png** - Screenshot of analysis results:
   - AI feedback and suggestions
   - Action buttons (Edit Email, Send Anyway, etc.)

6. **popup-cached-result.png** - Screenshot showing a cached result:
   - "📦 Showing cached response" indicator
   - "Request Again from Gemini" button

7. **popup-content-changed.png** - Screenshot showing content changed warning:
   - "⚠️ Email content has changed" indicator
   - Previous analysis displayed
   - "Request Again from Gemini" button

## How to Capture Screenshots

1. Install the add-on in Thunderbird
2. Configure the settings with your API key
3. Compose a test email
4. Take screenshots at each stage described above
5. Save the screenshots in this directory with the exact filenames listed above
6. Ensure screenshots are clear and legible (recommend PNG format, reasonable resolution)

## Image Guidelines

- Format: PNG (preferred) or JPEG
- Resolution: High enough to read text clearly (suggest at least 800px width)
- File size: Keep reasonable for documentation (under 500KB per image)
- Language: Capture screenshots in both English and Japanese if UI text differs
  - Use suffix `-en.png` for English screenshots
  - Use suffix `-ja.png` for Japanese screenshots
  - If UI is language-neutral, no suffix needed

## Current Status

### Japanese Screenshots (`-ja.png`)

The following Japanese screenshot files exist:

✅ **Completed (with Japanese UI text):**
- `popup-template-selection-ja.png`
- `popup-analyzing-ja.png`
- `popup-results-ja.png`
- `popup-cached-result-ja.png`
- `popup-content-changed-ja.png`

⚠️ **Placeholders (need proper Japanese UI capture):**
- `settings-page-ja.png` - Currently uses English UI, needs Japanese locale capture
- `compose-window-icon-ja.png` - Currently uses English UI, needs Japanese locale capture

To capture proper Japanese screenshots:
1. Set Thunderbird to Japanese locale (日本語)
2. Install the add-on
3. Capture screenshots following the guidelines above
4. Replace the placeholder files
